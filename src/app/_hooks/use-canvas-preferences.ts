"use client";

import { useSyncExternalStore } from "react";
import type { CanvasPreferences } from "@/app/_types/gym";

const PREFERENCES_STORAGE_KEY = "pokemon-gym:canvas-preferences:v2";
const PREFS_EVENT = "pokemon-gym:prefs-change";

export const DEFAULT_CANVAS_PREFERENCES: CanvasPreferences = {
  alwaysShowNames: true,
  edgeDetailMode: "node-badge",
  showRisk: true,
  allowNodeDrag: false,
  allowMultiSelect: false,
};

const DEFAULT_PREFS_JSON = JSON.stringify(DEFAULT_CANVAS_PREFERENCES);

function parseStoredPreferences(raw: string): CanvasPreferences {
  try {
    const parsed = JSON.parse(raw) as Partial<CanvasPreferences>;
    return {
      alwaysShowNames:
        typeof parsed.alwaysShowNames === "boolean"
          ? parsed.alwaysShowNames
          : DEFAULT_CANVAS_PREFERENCES.alwaysShowNames,
      edgeDetailMode:
        parsed.edgeDetailMode === "node-badge" ||
        parsed.edgeDetailMode === "edge-pill"
          ? parsed.edgeDetailMode
          : DEFAULT_CANVAS_PREFERENCES.edgeDetailMode,
      showRisk:
        typeof parsed.showRisk === "boolean"
          ? parsed.showRisk
          : DEFAULT_CANVAS_PREFERENCES.showRisk,
      allowNodeDrag:
        typeof parsed.allowNodeDrag === "boolean"
          ? parsed.allowNodeDrag
          : DEFAULT_CANVAS_PREFERENCES.allowNodeDrag,
      allowMultiSelect:
        typeof parsed.allowMultiSelect === "boolean"
          ? parsed.allowMultiSelect
          : DEFAULT_CANVAS_PREFERENCES.allowMultiSelect,
    };
  } catch {
    return DEFAULT_CANVAS_PREFERENCES;
  }
}

function subscribeStorage(onStoreChange: () => void): () => void {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(PREFS_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(PREFS_EVENT, onStoreChange);
  };
}

function writeStorage(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
    window.dispatchEvent(new Event(PREFS_EVENT));
  } catch {
    // Ignore storage quota / privacy mode errors
  }
}

export function useCanvasPreferences() {
  const rawPrefs = useSyncExternalStore(
    subscribeStorage,
    () => localStorage.getItem(PREFERENCES_STORAGE_KEY) ?? DEFAULT_PREFS_JSON,
    () => DEFAULT_PREFS_JSON,
  );

  const preferences = parseStoredPreferences(rawPrefs);

  const updatePreference = <K extends keyof CanvasPreferences>(
    key: K,
    value: CanvasPreferences[K],
  ) => {
    const next = { ...preferences, [key]: value };
    writeStorage(PREFERENCES_STORAGE_KEY, JSON.stringify(next));
  };

  const resetPreferences = () => {
    writeStorage(PREFERENCES_STORAGE_KEY, DEFAULT_PREFS_JSON);
  };

  return {
    preferences,
    updatePreference,
    resetPreferences,
  };
}
