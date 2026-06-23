"use client";

import { getTodayISO } from "./dates";
import {
  consumerSchedules,
  defaultConsumerSettings,
  defaultNotificationSettings,
  defaultRoutineState,
} from "./mock-data";
import { createSampleSchedules, createSampleTasks, sampleParentProfile } from "./seed";
import { storageKeys } from "./storage-keys";
import { removeStorage, removeStorageByPrefix, writeStorage } from "./storage";

export function applySampleFamilyData() {
  const today = getTodayISO();
  writeStorage(storageKeys.isSample, true);
  writeStorage(storageKeys.parentProfile, sampleParentProfile);
  writeStorage(storageKeys.tasksForDate(today), createSampleTasks(sampleParentProfile, today));
  writeStorage(storageKeys.schedules, createSampleSchedules(sampleParentProfile));
  writeStorage(storageKeys.messageHistory, []);
  writeStorage(storageKeys.consumerSettings, defaultConsumerSettings);
  writeStorage(storageKeys.consumerRoutine, defaultRoutineState);
  writeStorage(storageKeys.consumerSchedules, consumerSchedules);
  writeStorage(storageKeys.notificationSettings, defaultNotificationSettings);
}

export function clearSampleFamilyData() {
  removeStorage(storageKeys.isSample);
  removeStorage(storageKeys.parentProfile);
  removeStorageByPrefix(`${storageKeys.base}:care-tasks:`);
  removeStorage(storageKeys.schedules);
  removeStorage(storageKeys.messageHistory);
  removeStorage(storageKeys.consumerSettings);
  removeStorage(storageKeys.consumerRoutine);
  removeStorage(storageKeys.consumerSchedules);
  removeStorage(storageKeys.notificationSettings);
}
