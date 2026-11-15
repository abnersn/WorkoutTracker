import {
  type HydratedDocument,
  isObjectIdOrHexString,
  type Model,
} from "mongoose";
import { normalizeEmail, UserRecord } from "./user.schema";
import { fromDate, type User } from "@workout-tracker/proto";
import { Injectable } from "@nestjs/common";
import * as argon2 from "argon2";
import { InjectModel } from "@nestjs/mongoose";
import { EmailTakenError, InvalidCredentialError } from "./errors";

type NewUser = {
  email: string;
  password: string;
  displayName: string;
};

const isDuplicateKey = (err: unknown): boolean =>
  (err as { code?: unknown } | null)?.code === 11000;

function toUser(doc: HydratedDocument<UserRecord>): User {
  return {
    id: doc.id,
    email: doc.email,
    displayName: doc.displayName,
    createdAt: fromDate(doc.createdAt),
  };
}

@Injectable()
export class UsersService {
  private readonly decoy = argon2.hash("no account has this password");

  constructor(
    @InjectModel(UserRecord.name)
    private readonly users: Model<UserRecord>,
  ) {}

  async create({ email, password, displayName }: NewUser): Promise<User> {
    const passwordHash = await argon2.hash(password);
    try {
      const doc = await this.users.create({
        email: normalizeEmail(email),
        displayName,
        passwordHash,
      });
      return toUser(doc);
    } catch (err) {
      if (isDuplicateKey(err)) {
        throw new EmailTakenError();
      }
      throw err;
    }
  }

  async verify(email: string, password: string): Promise<User> {
    const user = await this.users
      .findOne({ email: normalizeEmail(email) })
      .select("+passwordHash")
      .exec();
    const hash = user?.passwordHash ?? (await this.decoy);
    const valid = await argon2.verify(hash, password);
    if (!user || !valid) {
      throw new InvalidCredentialError();
    }
    return toUser(user);
  }

  async getMany(ids: string[]): Promise<User[]> {
    const valid = ids.filter((id) => isObjectIdOrHexString(id));
    const docs = await this.users.find({ _id: { $in: valid } }).exec();
    return docs.map(toUser);
  }
}
