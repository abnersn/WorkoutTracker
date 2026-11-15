import { Test } from "@nestjs/testing";
import { type LogEntry, SetStage, type Workout } from "@workout-tracker/proto";
import { WorkoutsClient } from "./workouts.client";
import { WorkoutsService } from "./workouts.service";

const USER_ID = "64b000000000000000000001";
const date = { seconds: 1_767_225_600, nanos: 0 };

const saved: Workout = {
  id: "64b0000000000000000000aa",
  name: "Push day",
  date,
  duration: 0,
  isComplete: false,
  exercises: [
    {
      id: "64b0000000000000000000e1",
      name: "Bench",
      sets: [{ id: "64b0000000000000000000f1", stage: SetStage.IDLE }],
    },
  ],
};

const run: LogEntry = {
  ...saved,
  id: "64b0000000000000000000bb",
  workoutId: saved.id,
  duration: 1_200,
  isComplete: true,
  activeExerciseId: "64b0000000000000000000e1",
  activeSetId: "64b0000000000000000000f1",
};

describe("WorkoutsService", () => {
  let service: WorkoutsService;
  const client = {
    getWorkout: jest.fn(async () => saved),
    createWorkout: jest.fn(async (w: Workout, _userId: string) => ({
      ...w,
      id: saved.id,
    })),
    updateWorkout: jest.fn(async (w: Workout, _userId: string) => w),
    getLog: jest.fn(async () => run),
    getPreviousRun: jest.fn(
      async (_logId: string, _userId: string): Promise<LogEntry | undefined> =>
        run,
    ),
    updateLog: jest.fn(async (l: LogEntry, _userId: string) => l),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [
        WorkoutsService,
        { provide: WorkoutsClient, useValue: client },
      ],
    }).compile();
    service = moduleRef.get(WorkoutsService);
  });

  it("creates a not-started template with new ids for omitted ones", async () => {
    await service.createWorkout(
      { name: "Legs", exercises: [{ name: "Squat", sets: [{}] }] },
      USER_ID,
    );
    const [sent, userId] = client.createWorkout.mock.calls[0];
    expect(userId).toBe(USER_ID);
    expect(sent).toMatchObject({
      id: "",
      name: "Legs",
      duration: 0,
      isComplete: false,
      exercises: [
        { id: "", name: "Squat", sets: [{ id: "", stage: SetStage.IDLE }] },
      ],
    });
  });

  it("keeps a workout's omitted fields on update", async () => {
    const result = await service.updateWorkout(
      { id: saved.id, exercises: [] },
      USER_ID,
    );
    expect(client.updateWorkout).toHaveBeenCalledWith(
      { ...saved, exercises: [] },
      USER_ID,
    );
    expect(result.name).toBe("Push day");
  });

  it("keeps a log's omitted fields, including workoutId, on update", async () => {
    await service.updateLog({ id: run.id, name: "Rated" }, USER_ID);
    expect(client.updateLog).toHaveBeenCalledWith(
      { ...run, name: "Rated" },
      USER_ID,
    );
  });

  it("treats null as keep for required fields and clear for active ids", async () => {
    await service.updateLog(
      {
        id: run.id,
        name: null as unknown as undefined,
        activeExerciseId: null,
        activeSetId: null,
      },
      USER_ID,
    );
    const [sent] = client.updateLog.mock.calls[0];
    expect(sent.name).toBe(run.name);
    expect(sent.activeExerciseId).toBeUndefined();
    expect(sent.activeSetId).toBeUndefined();
  });

  it("never sends an empty active id", async () => {
    client.getLog.mockResolvedValueOnce({ ...run, activeSetId: "" });
    await service.updateLog({ id: run.id }, USER_ID);
    expect(client.updateLog.mock.calls[0][0].activeSetId).toBeUndefined();
  });

  it("maps a missing optional field to null", async () => {
    const workout = await service.getWorkout(saved.id, USER_ID);
    expect(workout.activeSetId).toBeNull();
    expect(workout.exercises[0].rpe).toBeNull();
    expect(workout.exercises[0].sets[0].defaultReps).toBeNull();
    expect(workout.date).toEqual(new Date("2026-01-01T00:00:00Z"));
  });

  it("refuses a stage this build doesn't know", async () => {
    client.getWorkout.mockResolvedValueOnce({
      ...saved,
      exercises: [
        {
          ...saved.exercises[0],
          sets: [{ id: "x", stage: SetStage.UNRECOGNIZED }],
        },
      ],
    });
    await expect(service.getWorkout(saved.id, USER_ID)).rejects.toThrow(
      /Unrecognized SetStage/,
    );
  });

  it("returns the previous run, or null for a first run", async () => {
    await expect(
      service.getPreviousRun(run.id, USER_ID),
    ).resolves.toMatchObject({ id: run.id, workoutId: saved.id });
    expect(client.getPreviousRun).toHaveBeenCalledWith(run.id, USER_ID);

    client.getPreviousRun.mockResolvedValueOnce(undefined);
    await expect(service.getPreviousRun(run.id, USER_ID)).resolves.toBeNull();
  });
});
