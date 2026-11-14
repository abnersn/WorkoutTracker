import "./styles.css";
export interface AppProps {
    navigate?: (to: string) => void;
}
export declare function App({ navigate }: AppProps): import("react").JSX.Element;
export default App;
