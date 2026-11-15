import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes, type Types } from "mongoose";
import { SetStage } from "@workout-tracker/proto";
import type { LogId, UserId, WorkoutId } from "@workout-tracker/helpers";

export const SET_STAGES = [
  SetStage.IDLE,
  SetStage.ACTIVE,
  SetStage.RESTING,
  SetStage.COMPLETE,
] as const;

@Schema()
export class WorkoutSetRecord {
  _id!: Types.ObjectId;

  @Prop({ required: true, enum: SET_STAGES, default: SetStage.IDLE })
  stage!: SetStage;

  @Prop({ min: 0 })
  defaultReps?: number;

  @Prop({ min: 0 })
  defaultWeight?: number; // always kg

  @Prop({ min: 0 })
  defaultRestTime?: number; // seconds

  @Prop()
  restStartedAt?: number; // epoch ms
}

export const WorkoutSetSchema = SchemaFactory.createForClass(WorkoutSetRecord);

@Schema()
export class ExerciseRecord {
  _id!: Types.ObjectId;

  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ min: 1, max: 10 })
  rpe?: number;

  @Prop({ type: [WorkoutSetSchema], default: [] })
  sets!: WorkoutSetRecord[];
}

export const ExerciseSchema = SchemaFactory.createForClass(ExerciseRecord);

// The fields a workout and a log share. Not a schema of its own: each
// record below extends it and adds its own _id type.
export abstract class WorkoutBody {
  // The owning user. Not a real reference.
  @Prop({ type: SchemaTypes.ObjectId, required: true, immutable: true })
  userId!: UserId;

  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ required: true })
  date!: Date;

  @Prop({ required: true, min: 0, default: 0 })
  duration!: number; // seconds

  @Prop({ required: true, default: false })
  isComplete!: boolean;

  @Prop({ type: SchemaTypes.ObjectId })
  activeSetId?: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId })
  activeExerciseId?: Types.ObjectId;

  @Prop({ type: [ExerciseSchema], default: [] })
  exercises!: ExerciseRecord[];

  createdAt!: Date;
}

@Schema({
  collection: "workouts",
  timestamps: {
    createdAt: true,
    updatedAt: true,
  },
  // save() only applies if the document is still at the version it was
  // loaded at; otherwise it throws a VersionError (ABORTED over gRPC).
  optimisticConcurrency: true,
})
export class WorkoutRecord extends WorkoutBody {
  _id!: WorkoutId;
}

export const WorkoutSchema = SchemaFactory.createForClass(WorkoutRecord);
WorkoutSchema.index({ userId: 1, createdAt: 1 });

@Schema({
  collection: "logs",
  timestamps: {
    createdAt: true,
    updatedAt: true,
  },
  // save() only applies if the document is still at the version it was
  // loaded at; otherwise it throws a VersionError (ABORTED over gRPC).
  optimisticConcurrency: true,
})
export class LogEntryRecord extends WorkoutBody {
  _id!: LogId;

  @Prop({
    type: SchemaTypes.ObjectId,
    required: true,
    immutable: true,
    ref: WorkoutRecord.name,
  })
  workoutId!: WorkoutId;
}

export const LogEntrySchema = SchemaFactory.createForClass(LogEntryRecord);
LogEntrySchema.index({ userId: 1, date: -1 });
// Serves getLastRuns, which reads only these fields, so Mongo can answer it
// from the index without loading the logs themselves.
LogEntrySchema.index({ userId: 1, workoutId: 1, date: -1 });
