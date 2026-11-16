import { Module } from "@nestjs/common";
import { UsersClientModule } from "./users-client.module";
import { UsersResolver } from "./users.resolver";

@Module({
  imports: [UsersClientModule],
  providers: [UsersResolver],
})
export class UsersModule {}
