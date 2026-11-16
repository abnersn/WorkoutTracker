import { deadline } from "./grpc-deadline";

describe("deadline", () => {
  it("builds a per-service timeout service config", () => {
    const options = deadline("users.v1.UsersService", 5);
    expect(JSON.parse(options["grpc.service_config"])).toEqual({
      methodConfig: [
        { name: [{ service: "users.v1.UsersService" }], timeout: "5s" },
      ],
    });
  });
});
