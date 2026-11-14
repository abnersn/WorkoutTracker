export interface AppProps {
    /** Saved workout to start, or the history entry to repeat when `fromLogs`. */
    id?: string;
    fromLogs?: boolean;
    navigate?: (to: string) => void;
}
export declare function App({ id, fromLogs, navigate }: AppProps): import("react").JSX.Element;
export default App;
