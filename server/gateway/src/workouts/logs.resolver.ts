import { Args, ID, Mutation, Query, Resolver } from "@nestjs/graphql";
import { AuthUser, CurrentUser } from "../auth/current-user.decorator";
import {
  ByIdArgs,
  CreateLogInput,
  PreviousRunArgs,
  UpdateLogInput,
} from "./workout.inputs";
import { LogEntryGql } from "./workout.types";
import { WorkoutsService } from "./workouts.service";

@Resolver(() => LogEntryGql)
export class LogsResolver {
  constructor(private readonly service: WorkoutsService) {}

  @Query(() => [LogEntryGql], { description: "Newest first." })
  logs(@CurrentUser() user: AuthUser): Promise<LogEntryGql[]> {
    return this.service.listLogs(user.id);
  }

  @Query(() => LogEntryGql)
  log(
    @Args() { id }: ByIdArgs,
    @CurrentUser() user: AuthUser,
  ): Promise<LogEntryGql> {
    return this.service.getLog(id, user.id);
  }

  // A query, not a LogEntry field: GetPreviousRun takes one log, so a field
  // would cost one RPC per entry in `logs { previousRun }`.
  @Query(() => LogEntryGql, {
    nullable: true,
    description:
      "The run of the same workout just before this log; null for its first run.",
  })
  previousRun(
    @Args() { logId }: PreviousRunArgs,
    @CurrentUser() user: AuthUser,
  ): Promise<LogEntryGql | null> {
    return this.service.getPreviousRun(logId, user.id);
  }

  @Mutation(() => LogEntryGql)
  createLog(
    @Args("input") input: CreateLogInput,
    @CurrentUser() user: AuthUser,
  ): Promise<LogEntryGql> {
    return this.service.createLog(input, user.id);
  }

  @Mutation(() => LogEntryGql)
  updateLog(
    @Args("input") input: UpdateLogInput,
    @CurrentUser() user: AuthUser,
  ): Promise<LogEntryGql> {
    return this.service.updateLog(input, user.id);
  }

  @Mutation(() => ID, { description: "Returns the deleted id." })
  deleteLog(
    @Args() { id }: ByIdArgs,
    @CurrentUser() user: AuthUser,
  ): Promise<string> {
    return this.service.deleteLog(id, user.id);
  }
}
