"use client";

import { ConsumerShell } from "@/components/consumer-shell";
import { Card, FieldLabel, inputClassName } from "@/components/ui";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import {
  defaultNotificationSettings,
  type NotificationSettings,
} from "@/lib/mock-data";
import { storageKeys } from "@/lib/storage-keys";

const toggles: Array<[keyof Omit<NotificationSettings, "checkinTime">, string]> = [
  ["medicine", "약 복용 알림"],
  ["hospital", "병원 일정 알림"],
  ["familyShare", "함께하는 사람 공유 알림"],
];

export default function NotificationSettingsPage() {
  const [settings, setSettings] = useLocalStorage<NotificationSettings>(
    storageKeys.notificationSettings,
    defaultNotificationSettings,
  );

  return (
    <ConsumerShell title="알림 설정" subtitle="실제 푸시는 없지만 알림 흐름을 미리 설정해볼 수 있어요." active="settings">
      <div className="space-y-4">
        <Card>
          <FieldLabel>안부 알림 시간</FieldLabel>
          <input
            className={`${inputClassName} mt-2`}
            type="time"
            value={settings.checkinTime}
            onChange={(event) => setSettings((current) => ({ ...current, checkinTime: event.target.value }))}
          />
        </Card>
        {toggles.map(([key, label]) => (
          <button
            key={key}
            className={`flex min-h-14 w-full items-center justify-between rounded-xl border px-4 text-left font-bold ${
              settings[key] ? "border-brand-sage bg-brand-mint" : "border-brand-line bg-white"
            }`}
            onClick={() => setSettings((current) => ({ ...current, [key]: !current[key] }))}
          >
            {label}
            <span>{settings[key] ? "켜짐" : "꺼짐"}</span>
          </button>
        ))}
      </div>
    </ConsumerShell>
  );
}
