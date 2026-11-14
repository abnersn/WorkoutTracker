import { Module } from "@nestjs/common";
import { AppController } from "@workout-tracker/users-svc/app/app.controller";
import { AppService } from "@workout-tracker/users-svc/app/app.service";

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
