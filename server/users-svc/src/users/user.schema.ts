import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export const normalizeEmail = (email: string) : string => email.trim().toLowerCase();

@Schema({
  collection: "users",
  timestamps: {
    createdAt: true,
    updatedAt: true,
  },
})
export class UserRecord {
  @Prop({ required: true, lowercase: true, trim: true })
  email!: string;

  @Prop({ required: true, select: false })
  passwordHash!: string;

  @Prop({ required: true, maxLength: 60, trim: true })
  displayName!: string;

  createdAt!: Date;
}

export const UserSchema = SchemaFactory.createForClass(UserRecord);
UserSchema.index({ email: 1 }, { unique: true });
