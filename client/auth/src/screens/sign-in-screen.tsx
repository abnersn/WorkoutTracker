import { useMutation } from "@apollo/client/react";
import { graphql } from "@workout-tracker/api";
import {
  AuthForm,
  readText,
  type AuthScreenProps,
} from "../components/auth-form";
import { EmailField, PasswordField } from "../components/auth-field";

const SignIn = graphql(/* GraphQL */ `
  mutation SignIn($input: SignInInput!) {
    signIn(input: $input) {
      token
      user {
        id
        displayName
      }
    }
  }
`);

export function SignInScreen(props: AuthScreenProps): React.JSX.Element {
  const [signIn, { loading, error }] = useMutation(SignIn);

  async function submit(form: FormData): Promise<string | undefined> {
    const { data } = await signIn({
      variables: {
        input: {
          email: readText(form, "email"),
          password: readText(form, "password", false),
        },
      },
    });
    return data?.signIn.token;
  }

  return (
    <AuthForm
      {...props}
      title="Sign in"
      submitLabel="Sign in"
      pendingLabel="Signing in…"
      loading={loading}
      error={error}
      submit={submit}
      alternative={{
        prompt: "No account yet?",
        label: "Sign up",
        screen: "sign-up",
      }}
    >
      <EmailField />
      <PasswordField />
    </AuthForm>
  );
}
