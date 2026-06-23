const baseKey = "today-anbu";

export const storageKeys = {
  base: baseKey,
  parentProfile: `${baseKey}:parent-profile`,
  schedules: `${baseKey}:care-schedules`,
  messageHistory: `${baseKey}:family-message-history`,
  checkinRecords: `${baseKey}:checkin-records`,
  trustedContacts: `${baseKey}:trusted-contacts`,
  isSample: `${baseKey}:is-sample`,
  selfMedicine: `${baseKey}:self-medicine`,
  selfCheckinCondition: `${baseKey}:self-checkin-condition`,
  selfCheckinMedicine: `${baseKey}:self-checkin-medicine`,
  selfCheckinSchedule: `${baseKey}:self-checkin-schedule`,
  selfCheckinMessage: `${baseKey}:self-checkin-message`,
  consumerSettings: `${baseKey}:consumer-settings`,
  consumerRoutine: `${baseKey}:consumer-routine`,
  consumerSchedules: `${baseKey}:consumer-schedules`,
  notificationSettings: `${baseKey}:notification-settings`,
  tasksForDate(date: string) {
    return `${baseKey}:care-tasks:${date}`;
  },
};
