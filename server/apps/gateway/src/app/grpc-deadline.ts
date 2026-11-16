// moment a grpc call gives up
export function deadline(
  service: string,
  seconds: number,
): Record<string, string> {
  const serviceConfig = {
    methodConfig: [{ name: [{ service }], timeout: `${seconds}s` }],
  };
  return { "grpc.service_config": JSON.stringify(serviceConfig) };
}
