import { useEffect, useRef } from "react";

export function createInterval(callback: () => void, delay: number | null) {
    const currentCallback = useRef(callback);

    useEffect(() => {
        currentCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        if (delay !== null) {
            const id = setInterval(() => currentCallback.current(), delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}
