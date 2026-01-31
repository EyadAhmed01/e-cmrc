import { createContext, useState } from "react";

export const CounterContext = createContext();

export default function CounterContextProvider({ children }) {
    const [counter, setCounter] = useState(0); // Fixed typo in 'setcounter' and added 'useState'

    return (
        <CounterContext.Provider value={{ counter, setCounter }}>
            {children}
        </CounterContext.Provider>
    );
}
