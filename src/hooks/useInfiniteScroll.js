import { useRef, useCallback } from 'react';

export function useInfiniteScroll(callback, isFetching) {
    const observer = useRef();

    const lastElementRef = useCallback(node => {
        if (isFetching) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                callback();
            }
        });

        if (node) observer.current.observe(node);
    }, [isFetching, callback]);

    return lastElementRef;
}
