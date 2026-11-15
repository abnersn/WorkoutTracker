import { ArgsType, Field, Float, ID, InputType, Int } from "@nestjs/graphql";
import type { KnownSetStage } from "@workout-tracker/proto";
import { Type } from "class-transformer";
import {
  ArrayMaxSize,
  IsBoolean,
  IsDate,
  IsIn,
  IsInt,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
  ValidateNested,
} from "class-validator";
import { SetStageGql } from "./workout.types";

// The limits mirror workouts-svc's zod schemas, so a bad payload fails here
// with every problem listed instead of at the service with the first one.
const MAX_ITEMS = 100;

@ArgsType()
export class ByIdArgs {
  @Field(() => ID) @IsMongoId() id!: string;
}

@ArgsType()
export class PreviousRunArgs {
  @Field(() => ID) @IsMongoId() logId!: string;
}

@InputType()
export class WorkoutSetInput {
  @Field(() => ID, {
    nullable: true,
    description: "Omit for a new set; the server assigns its id.",
  })
  @IsOptional()
  @IsMongoId()
  id?: string | null;

  @Field(() => SetStageGql, {
    nullable: true,
    description: "Defaults to IDLE. Ignored on saved workouts.",
  })
  @IsOptional()
  @IsIn(Object.values(SetStageGql))
  stage?: KnownSetStage | null;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  defaultReps?: number | null;

  @Field(() => Float, { nullable: true, description: "Always kg." })
  @IsOptional()
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(0)
  defaultWeight?: number | null;

  @Field(() => Int, { nullable: true, description: "Seconds." })
  @IsOptional()
  @IsInt()
  @Min(0)
  defaultRestTime?: number | null;

  @Field(() => Float, {
    nullable: true,
    description: "Epoch ms. Ignored on saved workouts.",
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  restStartedAt?: number | null;
}

@InputType()
export class ExerciseInput {
  @Field(() => ID, {
    nullable: true,
    description: "Omit for a new exercise; the server assigns its id.",
  })
  @IsOptional()
  @IsMongoId()
  id?: string | null;

  @Field() @IsString() @Length(1, 100) name!: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  rpe?: number | null;

  @Field(() => [WorkoutSetInput])
  @ArrayMaxSize(MAX_ITEMS)
  @ValidateNested({ each: true })
  @Type(() => WorkoutSetInput)
  sets!: WorkoutSetInput[];
}

@InputType()
export class CreateWorkoutInput {
  @Field() @IsString() @Length(1, 100) name!: string;

  @Field(() => [ExerciseInput], { defaultValue: [] })
  @ArrayMaxSize(MAX_ITEMS)
  @ValidateNested({ each: true })
  @Type(() => ExerciseInput)
  exercises!: ExerciseInput[];
}

/** Changes the given fields of a saved workout; omitted ones are kept. */
@InputType()
export class UpdateWorkoutInput {
  @Field(() => ID) @IsMongoId() id!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  name?: string;

  @Field(() => [ExerciseInput], {
    nullable: true,
    description: "Replaces every exercise.",
  })
  @IsOptional()
  @ArrayMaxSize(MAX_ITEMS)
  @ValidateNested({ each: true })
  @Type(() => ExerciseInput)
  exercises?: ExerciseInput[];
}

@InputType()
export class CreateLogInput {
  @Field(() => ID, { description: "The saved workout this was run from." })
  @IsMongoId()
  workoutId!: string;

  @Field() @IsString() @Length(1, 100) name!: string;
  @Field() @IsDate() date!: Date;
  @Field(() => Int) @IsInt() @Min(0) duration!: number;
  @Field() @IsBoolean() isComplete!: boolean;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsMongoId()
  activeSetId?: string | null;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsMongoId()
  activeExerciseId?: string | null;

  @Field(() => [ExerciseInput])
  @ArrayMaxSize(MAX_ITEMS)
  @ValidateNested({ each: true })
  @Type(() => ExerciseInput)
  exercises!: ExerciseInput[];
}

/**
 * Changes the given fields of a log; omitted ones are kept. Send null to
 * clear an active id. The log's workoutId never changes.
 */
@InputType()
export class UpdateLogInput {
  @Field(() => ID) @IsMongoId() id!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  name?: string;

  @Field({ nullable: true }) @IsOptional() @IsDate() date?: Date;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  duration?: number;

  @Field({ nullable: true }) @IsOptional() @IsBoolean() isComplete?: boolean;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsMongoId()
  activeSetId?: string | null;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsMongoId()
  activeExerciseId?: string | null;

  @Field(() => [ExerciseInput], {
    nullable: true,
    description: "Replaces every exercise.",
  })
  @IsOptional()
  @ArrayMaxSize(MAX_ITEMS)
  @ValidateNested({ each: true })
  @Type(() => ExerciseInput)
  exercises?: ExerciseInput[];
}
