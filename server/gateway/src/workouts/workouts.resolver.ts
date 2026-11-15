import {
  Args,
  Context,
  ID,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { AuthUser, CurrentUser } from "../auth/current-user.decorator";
import { LastRunLoaders } from "./last-run.loader";
import {
  ByIdArgs,
  CreateWorkoutInput,
  UpdateWorkoutInput,
} from "./workout.inputs";
import { WorkoutGql } from "./workout.types";
import { WorkoutsService } from "./workouts.service";

@Resolver(() => WorkoutGql)
export class WorkoutsResolver {
  constructor(
    private readonly service: WorkoutsService,
    private readonly lastRuns: LastRunLoaders,
  ) {}

  @Query(() => [WorkoutGql])
  workouts(@CurrentUser() user: AuthUser): Promise<WorkoutGql[]> {
    return this.service.listWorkouts(user.id);
  }

  @Query(() => WorkoutGql)
  workout(
    @Args() { id }: ByIdArgs,
    @CurrentUser() user: AuthUser,
  ): Promise<WorkoutGql> {
    return this.service.getWorkout(id, user.id);
  }

  @Mutation(() => WorkoutGql)
  createWorkout(
    @Args("input") input: CreateWorkoutInput,
    @CurrentUser() user: AuthUser,
  ): Promise<WorkoutGql> {
    return this.service.createWorkout(input, user.id);
  }

  @Mutation(() => WorkoutGql)
  updateWorkout(
    @Args("input") input: UpdateWorkoutInput,
    @CurrentUser() user: AuthUser,
  ): Promise<WorkoutGql> {
    return this.service.updateWorkout(input, user.id);
  }

  @Mutation(() => ID, {
    description: "Returns the deleted id. Logs run from it are kept.",
  })
  deleteWorkout(
    @Args() { id }: ByIdArgs,
    @CurrentUser() user: AuthUser,
  ): Promise<string> {
    return this.service.deleteWorkout(id, user.id);
  }

  @ResolveField(() => Date, {
    nullable: true,
    description: "When this workout was last run; null if never.",
  })
  lastRunAt(
    @Parent() workout: WorkoutGql,
    @Context() context: object,
    @CurrentUser() user: AuthUser,
  ): Promise<Date | null> {
    return this.lastRuns.for(context, user.id).load(workout.id);
  }
}
