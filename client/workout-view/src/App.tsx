// Exposed by the federation plugin as 'workoutView/App'.
// Consumers render it lazily via `lazyProvider('workoutView', 'App')`.
export function App() {
  return (
    <section data-testid="workout-view">
      <h1>Hello from workout view</h1>
    </section>
  );
}

export default App;
