import { type ChannelCredentials, credentials, Metadata } from "@grpc/grpc-js";

// How the gateway authenticates to the services:
// - "none": plaintext, for local services on loopback.
// - "google-id-token": TLS plus a Google ID token for the service's URL, which
//   Cloud Run checks against roles/run.invoker before the call reaches it.
export type GrpcAuth = "none" | "google-id-token";

export type FetchIdToken = (audience: string) => Promise<string>;

// Renew this long before expiry, so a token never lapses mid-call.
const REFRESH_MARGIN_MS = 5 * 60_000;

const METADATA_IDENTITY_URL =
  "http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/identity";

// Cloud Run's metadata server mints ID tokens for the runtime service account.
export const fetchIdTokenFromMetadataServer: FetchIdToken = async (
  audience,
) => {
  const res = await fetch(
    `${METADATA_IDENTITY_URL}?audience=${encodeURIComponent(audience)}`,
    { headers: { "Metadata-Flavor": "Google" } },
  );
  if (!res.ok) {
    throw new Error(`metadata server returned ${res.status} for an ID token`);
  }
  return res.text();
};

function expiresAt(token: string): number {
  const payload = token.split(".")[1] ?? "";
  const { exp } = JSON.parse(Buffer.from(payload, "base64url").toString()) as {
    exp?: number;
  };
  if (typeof exp !== "number") {
    throw new Error("ID token has no exp claim");
  }
  return exp * 1000;
}

// One token per audience, shared by concurrent calls and renewed near expiry.
export function cachedIdToken(
  audience: string,
  fetchIdToken: FetchIdToken,
  now: () => number = Date.now,
): () => Promise<string> {
  let current: { token: string; expiresAt: number } | undefined;
  let pending: Promise<string> | undefined;
  return () => {
    if (current && now() < current.expiresAt - REFRESH_MARGIN_MS) {
      return Promise.resolve(current.token);
    }
    pending ??= fetchIdToken(audience)
      .then((token) => {
        current = { token, expiresAt: expiresAt(token) };
        return token;
      })
      .finally(() => {
        pending = undefined;
      });
    return pending;
  };
}

// The audience Cloud Run expects is the service's https URL, without the port.
export function audienceFor(url: string): string {
  return `https://${url.replace(/:\d+$/, "")}`;
}

export function grpcCredentials(
  auth: GrpcAuth,
  url: string,
  fetchIdToken: FetchIdToken = fetchIdTokenFromMetadataServer,
): ChannelCredentials {
  if (auth === "none") {
    return credentials.createInsecure();
  }
  const token = cachedIdToken(audienceFor(url), fetchIdToken);
  return credentials.combineChannelCredentials(
    credentials.createSsl(),
    credentials.createFromMetadataGenerator((_params, callback) => {
      token().then(
        (value) => {
          const metadata = new Metadata();
          metadata.set("authorization", `Bearer ${value}`);
          callback(null, metadata);
        },
        (err: Error) => callback(err),
      );
    }),
  );
}
