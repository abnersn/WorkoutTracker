import { Module } from "@nestjs/common";
import { AppController } from "@workout-tracker/gateway/app/app.controller";
import { AppService } from "@workout-tracker/gateway/app/app.service";

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
