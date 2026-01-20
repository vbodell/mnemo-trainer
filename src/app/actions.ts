"use server";

import { BigQuery } from "@google-cloud/bigquery";

interface GameResult {
  gameSlug: string;
  durationMs: number;
  score?: number;
  totalItems?: number;
  accuracy?: number;
  timestamp: string;
  metadata?: string;
}

const bigquery = new BigQuery();
const DATASET_ID = "mnemo_trainer_analytics"; // Ensure this dataset exists in BQ
const TABLE_ID = "game_events";

export async function submitGameResult(result: GameResult) {
  try {
    // In a real scenario, we might want to buffer these or handle errors more robustly
    // For now, we attempt a direct streaming insert.
    
    // Check if we have credentials (implicit in Cloud Run, but good to wrap)
    // and if the dataset/table config is correct.
    
    const row = {
      event_timestamp: result.timestamp,
      game_slug: result.gameSlug,
      duration_ms: result.durationMs,
      score: result.score,
      total_items: result.totalItems,
      accuracy: result.accuracy,
      metadata: result.metadata,
    };

    await bigquery
      .dataset(DATASET_ID)
      .table(TABLE_ID)
      .insert([row]);

    console.log(`Inserted game result for ${result.gameSlug}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to insert into BigQuery:", error);
    // We do NOT re-throw to the client to avoid crashing the UI for an analytics failure.
    // However, we return a failure status.
    return { success: false, error: "Failed to record stats" };
  }
}
