import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { createInterval } from './intervals'; // Ajuste le chemin

describe('createInterval Hook', () => {
    beforeEach(() => {
        // Enable fake timers before each tests
        vi.useFakeTimers();
    });

    afterEach(() => {
        // Disable fake timers after each tests
        vi.useRealTimers();
    });

    it('no delay', () => {
        // 1. Setup
        const callbackSpy = vi.fn();

        // 2. Action :
        renderHook(() => createInterval(callbackSpy, null));

        vi.advanceTimersByTime(1000);

        // 3. Assert
        expect(callbackSpy).not.toHaveBeenCalled();
    });

    it('callback call', () => {
        // 1. Setup
        const callbackSpy = vi.fn();

        // 2. Action
        renderHook(() => createInterval(callbackSpy, 1000));

        // 3. Assert
        expect(callbackSpy).not.toHaveBeenCalled();

        vi.advanceTimersByTime(1000);
        expect(callbackSpy).toHaveBeenCalledTimes(1);

        vi.advanceTimersByTime(3000);
        expect(callbackSpy).toHaveBeenCalledTimes(4);
    });

    it('update delay', () => {
        // 1. Setup
        const callback1 = vi.fn();
        const callback2 = vi.fn();

        const { rerender } = renderHook(
            ({ cb, delay }) => createInterval(cb, delay),
            { initialProps: { cb: callback1, delay: 1000 } }
        );

        vi.advanceTimersByTime(1000);
        expect(callback1).toHaveBeenCalledTimes(1);
        expect(callback2).not.toHaveBeenCalled();

        // 2. Action
        rerender({ cb: callback2, delay: 1000 });

        vi.advanceTimersByTime(1000);

        // 3. Assert
        expect(callback1).toHaveBeenCalledTimes(1);
        expect(callback2).toHaveBeenCalledTimes(1);
    });

    it('stop interval', () => {
        // 1. Setup
        const callbackSpy = vi.fn();

        const { unmount } = renderHook(() => createInterval(callbackSpy, 1000));

        vi.advanceTimersByTime(1000);
        expect(callbackSpy).toHaveBeenCalledTimes(1);

        // 2. Action
        unmount();

        // 3. Assert
        vi.advanceTimersByTime(2000);
        expect(callbackSpy).toHaveBeenCalledTimes(1);
    });
});
