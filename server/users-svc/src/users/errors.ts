export class EmailTakenError extends Error {
  constructor() {
    super("That email is already registered");
  }
}

export class InvalidCredentialError extends Error {
  constructor() {
    super("Invalid email or password");
  }
}
