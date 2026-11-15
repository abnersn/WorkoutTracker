import { type PipeTransform } from "@nestjs/common";
import { prettifyError, type ZodType } from "zod";
import { InvalidArgumentError } from "./errors";

export class ZodPipe<T> implements PipeTransform<unknown, T> {
  constructor(private readonly schema: ZodType<T>) {}

  transform(value: unknown): T {
    const result = this.schema.safeParse(value);
    if (!result.success) {
      throw new InvalidArgumentError(prettifyError(result.error));
    }
    return result.data;
  }
}
