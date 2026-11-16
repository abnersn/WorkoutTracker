// How @grpc/proto-loader turns bytes into objects. Keep these in step
// with the ts-proto options in buf.gen.yaml (enums: String <-> stringEnums=true).
export const protoLoaderOptions = {
  keepCase: false, // default_reps arrives as defaultReps
  enums: String, // SetStage arrives as 'IDLE', 'COMPLETE', ..., not 0, 3
  longs: Number, // int64, such as Timestamp.seconds, as a number
  defaults: true, // skipped fields arrive as '', 0 or the zero enum
  arrays: true, // repeated fields always arrive as arrays
};
