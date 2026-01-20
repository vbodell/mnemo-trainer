"use client";

import { useState, useRef, useCallback } from "react";
import { submitGameResult } from "../app/actions";

export interface GameTrackerConfig {
  gameSlug: string;
  mode: "manual_start" | "input_start";
}

export interface TrackResultParams {
  score?: number;
  totalItems?: number;
  metadata?: Record<string, any>;
}

export function useGameTracker({ gameSlug, mode }: GameTrackerConfig) {
  const [startTime, setStartTime] = useState<number | null>(null);
  const hasStartedRef = useRef(false);

  const startGame = useCallback(() => {
    if (!hasStartedRef.current) {
      setStartTime(Date.now());
      hasStartedRef.current = true;
      console.log(`[${gameSlug}] Game started at ${new Date().toISOString()}`);
    }
  }, [gameSlug]);

  const onInputStart = useCallback(() => {
    if (mode === "input_start") {
      startGame();
    }
  }, [mode, startGame]);

  const saveResult = useCallback(
    async (params: TrackResultParams) => {
      if (!startTime) {
        console.warn(`[${gameSlug}] Attempted to save result without start time.`);
        return;
      }

      const endTime = Date.now();
      const durationMs = endTime - startTime;
      
      const accuracy =
        params.score !== undefined && params.totalItems
          ? (params.score / params.totalItems) * 100
          : undefined;

      const payload = {
        gameSlug,
        durationMs,
        score: params.score,
        totalItems: params.totalItems,
        accuracy,
        timestamp: new Date(endTime).toISOString(),
        metadata: params.metadata ? JSON.stringify(params.metadata) : undefined,
      };

      console.log(`[${gameSlug}] Saving result:`, payload);

      // Call Server Action
      await submitGameResult(payload);
      
      // Reset for next round if needed (optional, depends on game flow)
      // For now we assume a full page reload or component unmount/remount usually resets state,
      // but we can expose a reset function if needed.
      hasStartedRef.current = false;
      setStartTime(null);
    },
    [gameSlug, startTime]
  );

  return {
    startGame, // Call this when the "Start" button is clicked (for manual_start)
    onInputStart, // Attach this to onChange or onFocus of the first input (for input_start)
    saveResult, // Call this when the game/list is submitted
    isTracking: !!startTime,
  };
}
