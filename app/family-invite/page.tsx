"use client";

import { useState } from "react";
import { Copy, Link as LinkIcon, RefreshCcw, Share2 } from "lucide-react";
import { ConsumerShell } from "@/components/consumer-shell";
import { Button, Card, FieldLabel, inputClassName } from "@/components/ui";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import {
  defaultConsumerSettings,
  type ConsumerSettings,
} from "@/lib/mock-data";
import { relationshipOptions, shareLevelOptions } from "@/lib/share-options";
import { storageKeys } from "@/lib/storage-keys";
import type { Relationship, ShareLevel } from "@/types/care";

function createInviteCode() {
  return `ANBU-${Math.floor(1000 + Math.random() * 9000)}`;
}

export default function FamilyInvitePage() {
  const [settings] = useLocalStorage<ConsumerSettings>(
    storageKeys.consumerSettings,
    defaultConsumerSettings,
  );
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const [inviteCode, setInviteCode] = useState("ANBU-2458");
  const [relationship, setRelationship] = useState<Relationship>("sibling");
  const [shareLevel, setShareLevel] = useState<ShareLevel>("selected_only");

  const isFamilyMode = settings.mode === "family-care";
  const title = isFamilyMode
    ? "함께 챙길 사람 초대하기"
    : "안부를 나눌 사람 초대하기";
  const subtitle = isFamilyMode
    ? "형제자매, 친척, 가까운 가족과 부모님 안부를 함께 챙길 수 있어요."
    : "가족, 친구, 이웃처럼 믿을 수 있는 사람과 필요한 안부만 공유할 수 있어요.";

  async function copyCode() {
    await navigator.clipboard.writeText(inviteCode);
    setCopied(true);
  }

  async function shareInvite() {
    const inviteUrl = `https://oneul-anbu.yos1015.chatgpt.site/onboarding?role=parent&invited=1&code=${inviteCode}`;
    const nav = navigator as Navigator & {
      share?: (data: ShareData) => Promise<void>;
    };

    if (typeof nav.share === "function") {
      await nav.share({
        title: "오늘안부 초대 코드",
        text: `가족이 오늘안부에 초대했어요. 평소에는 기록하지 않고 필요한 날에만 질문 하나에 답하면 됩니다. 초대 코드: ${inviteCode}`,
        url: inviteUrl,
      });
    } else {
      await nav.clipboard.writeText(inviteUrl);
    }
    setShared(true);
  }

  return (
    <ConsumerShell title={title} subtitle={subtitle} active="invite">
      <div className="space-y-5">
        <Card>
          <h2 className="text-lg font-bold">함께하는 사람</h2>
          <p className="soft-copy mt-2 text-sm text-stone-600">
            가족, 친척, 친구처럼 믿고 안부를 나눌 사람을 초대할 수 있어요.
          </p>
          <p className="soft-copy mt-2 text-sm text-stone-600">
            초대받은 사람은 내 안부 루틴이나 일정 중 내가 선택한 내용만 함께 확인할 수 있어요.
          </p>
        </Card>

        <Card className="bg-brand-mint">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <LinkIcon size={24} aria-hidden />
              <div>
                <p className="text-sm font-bold text-stone-600">초대 코드</p>
                <p className="text-2xl font-bold tracking-wide">{inviteCode}</p>
              </div>
            </div>
            <button
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-brand-ink shadow-sm"
              onClick={() => {
                setInviteCode(createInviteCode());
                setCopied(false);
                setShared(false);
              }}
              aria-label="초대 코드 만들기"
            >
              <RefreshCcw size={17} aria-hidden />
            </button>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <Button tone="secondary" className="w-full" onClick={shareInvite}>
              <Share2 size={18} aria-hidden />
              {shared ? "공유 준비 완료" : "초대 코드 공유하기"}
            </Button>
            <Button tone="secondary" className="w-full" onClick={copyCode}>
              <Copy size={18} aria-hidden />
              {copied ? "복사했어요" : "코드 복사하기"}
            </Button>
          </div>
          <Button className="mt-3 w-full" onClick={() => setInviteCode(createInviteCode())}>
            초대 코드 만들기
          </Button>
        </Card>

        <Card className="space-y-4">
          <div className="grid gap-2">
            <FieldLabel>초대할 사람</FieldLabel>
            <input className={inputClassName} placeholder="이름 또는 연락처" />
          </div>
          <div className="grid gap-2">
            <FieldLabel>관계</FieldLabel>
            <select
              className={inputClassName}
              value={relationship}
              onChange={(event) => setRelationship(event.target.value as Relationship)}
            >
              {relationshipOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-2">
            <FieldLabel>공유 범위</FieldLabel>
            <select
              className={inputClassName}
              value={shareLevel}
              onChange={(event) => setShareLevel(event.target.value as ShareLevel)}
            >
              {shareLevelOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className="text-xs leading-5 text-stone-500">
              공유할 내용은 언제든지 바꿀 수 있어요.
            </p>
          </div>
        </Card>
      </div>
    </ConsumerShell>
  );
}
