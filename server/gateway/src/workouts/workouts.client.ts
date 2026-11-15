import { Metadata } from "@grpc/grpc-js";
import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { USER_ID_METADATA } from "@workout-tracker/helpers";
import {
  LastRun,
  LogEntry,
  Workout,
  WORKOUTS_SERVICE_NAME,
  WorkoutsServiceClient,
} from "@workout-tracker/proto";
import { firstValueFrom } from "rxjs";

export const WORKOUTS_CLIENT = Symbol("WORKOUTS_CLIENT");

@Injectable()
export class WorkoutsClient implements OnModuleInit {
  private svc!: WorkoutsServiceClient;

  constructor(
    @Inject(WORKOUTS_CLIENT)
    private readonly grpc: ClientGrpc,
  ) {}

  // Unlike users-svc, every workouts-svc call needs the caller's id.
  private metadata(userId: string): Metadata {
    const md = new Metadata();
    md.set(USER_ID_METADATA, userId);
    return md;
  }

  onModuleInit(): void {
    this.svc = this.grpc.getService<WorkoutsServiceClient>(
      WORKOUTS_SERVICE_NAME,
    );
  }

  async listWorkouts(userId: string): Promise<Workout[]> {
    const res = await firstValueFrom(
      this.svc.listWorkouts({}, this.metadata(userId)),
    );
    return res.workouts;
  }

  getWorkout(id: string, userId: string): Promise<Workout> {
    return firstValueFrom(this.svc.getWorkout({ id }, this.metadata(userId)));
  }

  createWorkout(workout: Workout, userId: string): Promise<Workout> {
    return firstValueFrom(
      this.svc.createWorkout({ workout }, this.metadata(userId)),
    );
  }

  updateWorkout(workout: Workout, userId: string): Promise<Workout> {
    return firstValueFrom(
      this.svc.updateWorkout({ workout }, this.metadata(userId)),
    );
  }

  async deleteWorkout(id: string, userId: string): Promise<void> {
    await firstValueFrom(this.svc.deleteWorkout({ id }, this.metadata(userId)));
  }

  async listLogs(userId: string): Promise<LogEntry[]> {
    const res = await firstValueFrom(
      this.svc.listLogs({}, this.metadata(userId)),
    );
    return res.logs;
  }

  getLog(id: string, userId: string): Promise<LogEntry> {
    return firstValueFrom(this.svc.getLog({ id }, this.metadata(userId)));
  }

  createLog(log: LogEntry, userId: string): Promise<LogEntry> {
    return firstValueFrom(this.svc.createLog({ log }, this.metadata(userId)));
  }

  updateLog(log: LogEntry, userId: string): Promise<LogEntry> {
    return firstValueFrom(this.svc.updateLog({ log }, this.metadata(userId)));
  }

  async deleteLog(id: string, userId: string): Promise<void> {
    await firstValueFrom(this.svc.deleteLog({ id }, this.metadata(userId)));
  }

  // undefined when the log is its workout's first run.
  async getPreviousRun(
    logId: string,
    userId: string,
  ): Promise<LogEntry | undefined> {
    const res = await firstValueFrom(
      this.svc.getPreviousRun({ logId }, this.metadata(userId)),
    );
    // proto-loader decodes an unset message field as null.
    return res.log ?? undefined;
  }

  async getLastRuns(workoutIds: string[], userId: string): Promise<LastRun[]> {
    const res = await firstValueFrom(
      this.svc.getLastRuns({ workoutIds }, this.metadata(userId)),
    );
    return res.lastRuns;
  }
}
