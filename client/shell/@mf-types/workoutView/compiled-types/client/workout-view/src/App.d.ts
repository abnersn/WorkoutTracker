import "./styles.css";
export interface AppProps {
    /** Key of the history entry to show. */
    id?: string;
    navigate?: (to: string) => void;
}
export declare function App({ id, navigate }: AppProps): import("react").JSX.Element;
export default App;
