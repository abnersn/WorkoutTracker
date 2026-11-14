import { Module } from "@nestjs/common";
import { AppController } from "@workout-tracker/workouts-svc/app/app.controller";
import { AppService } from "@workout-tracker/workouts-svc/app/app.service";

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
