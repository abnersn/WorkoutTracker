// Exposed by the federation plugin as 'workoutHistory/App'.
// Consumers render it lazily via `lazyProvider('workoutHistory', 'App')`.
export function App() {
  return (
    <section data-testid="workout-history">
      <h1>Hello from workout history</h1>
    </section>
  );
}

export default App;
