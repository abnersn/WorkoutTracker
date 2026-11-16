import { Module } from "@nestjs/common";
import { LastRunLoaders } from "./last-run.loader";
import { LogsResolver } from "./logs.resolver";
import { WorkoutsClientModule } from "./workouts-client.module";
import { WorkoutsResolver } from "./workouts.resolver";
import { WorkoutsService } from "./workouts.service";

@Module({
  imports: [WorkoutsClientModule],
  providers: [WorkoutsService, LastRunLoaders, WorkoutsResolver, LogsResolver],
})
export class WorkoutsModule {}
