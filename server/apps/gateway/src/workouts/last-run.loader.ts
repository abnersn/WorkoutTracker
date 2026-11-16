import { Injectable } from "@nestjs/common";
import { toDate } from "@workout-tracker/proto";
import DataLoader from "dataloader";
import { WorkoutsClient } from "./workouts.client";

// workouts-svc refuses a GetLastRuns batch larger than this.
export const MAX_LAST_RUNS_BATCH = 100;

export type LastRunLoader = DataLoader<string, Date | null>;

/**
 * Hands out one lastRunAt DataLoader per GraphQL request, so every
 * Workout.lastRunAt in a response is answered by one GetLastRuns call (per
 * 100 ids), and nothing is cached across requests or users.
 *
 * Keyed on the request's context object rather than made REQUEST-scoped,
 * which would turn every resolver depending on it request-scoped too.
 */
@Injectable()
export class LastRunLoaders {
  private readonly loaders = new WeakMap<object, LastRunLoader>();

  constructor(private readonly client: WorkoutsClient) {}

  for(context: object, userId: string): LastRunLoader {
    let loader = this.loaders.get(context);
    if (!loader) {
      loader = this.create(userId);
      this.loaders.set(context, loader);
    }
    return loader;
  }

  private create(userId: string): LastRunLoader {
    return new DataLoader<string, Date | null>(
      async (workoutIds) => {
        const runs = await this.client.getLastRuns([...workoutIds], userId);
        const byId = new Map(
          runs.map((run) => [run.workoutId, toDate(run.lastRunAt)]),
        );
        // Never-run workouts are left out of the response.
        return workoutIds.map((id) => byId.get(id) ?? null);
      },
      { maxBatchSize: MAX_LAST_RUNS_BATCH },
    );
  }
}
