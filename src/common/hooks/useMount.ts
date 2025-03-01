import { useEffect, useRef } from 'react';

export default function useMount(fn: () => void) {
    const mounted = useRef(false);

    useEffect(() => {
        if (!mounted.current) {
            fn();
            mounted.current = true;
        }
    }, []);
}
