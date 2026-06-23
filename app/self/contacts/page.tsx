"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Home, Plus, Trash2 } from "lucide-react";
import { SelfShell } from "@/components/self-shell";
import { Button, Card, FieldLabel, inputClassName } from "@/components/ui";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { createId } from "@/lib/id";
import { getRelationshipLabel, relationshipOptions } from "@/lib/share-options";
import { storageKeys } from "@/lib/storage-keys";
import type { Relationship, TrustedContact } from "@/types/care";

type ContactMode = "known" | "care" | "solo" | null;

export default function SelfContactsPage() {
  const [mode, setMode] = useState<ContactMode>(null);
  const [savedSolo, setSavedSolo] = useState(false);
  const [contacts, setContacts] = useLocalStorage<TrustedContact[]>(
    storageKeys.trustedContacts,
    [],
  );
  const [form, setForm] = useState({
    name: "",
    relationship: "child" as Relationship,
    contact: "",
  });

  function chooseMode(nextMode: ContactMode) {
    setMode(nextMode);
    if (nextMode === "care") {
      setForm((current) => ({ ...current, relationship: "care_worker" }));
    }
    if (nextMode === "solo") {
      setSavedSolo(true);
    }
  }

  function addContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.name.trim()) return;
    setContacts((current) => [
      ...current,
      {
        id: createId("contact"),
        name: form.name.trim(),
        relationship: form.relationship,
        contact: form.contact.trim(),
        shareLevel: "selected_only",
        createdAt: new Date().toISOString(),
      },
    ]);
    setForm({ name: "", relationship: mode === "care" ? "care_worker" : "child", contact: "" });
    setMode(null);
  }

  return (
    <SelfShell
      title="함께 볼 사람 설정"
      subtitle="가족이나 지인이 없어도 괜찮아요. 혼자 사용하거나, 필요할 때 믿을 수 있는 사람이나 기관을 추가할 수 있어요."
    >
      {!mode ? (
        <div className="grid gap-3">
          <ChoiceButton
            icon="👤"
            title="가족이나 아는 사람 추가"
            onClick={() => chooseMode("known")}
          />
          <ChoiceButton
            icon="🏢"
            title="돌봄·복지 관계자 추가"
            onClick={() => chooseMode("care")}
          />
          <ChoiceButton
            icon="🌿"
            title="지금은 혼자 사용할게요"
            onClick={() => chooseMode("solo")}
          />
        </div>
      ) : null}

      {mode === "solo" ? (
        <Card className="bg-brand-mint">
          <div className="flex items-start gap-3">
            <CheckCircle2 size={34} className="shrink-0 text-brand-sage" aria-hidden />
            <div>
              <p className="text-2xl font-bold">혼자 사용해도 괜찮아요.</p>
              <p className="mt-2 text-lg leading-7 text-stone-700">
                나중에 필요할 때 함께 볼 사람을 추가할 수 있어요.
              </p>
            </div>
          </div>
        </Card>
      ) : null}

      {mode === "known" || mode === "care" ? (
        <form onSubmit={addContact}>
          <Card className="space-y-4">
            <div>
              <p className="text-xl font-bold">
                {mode === "care" ? "돌봄·복지 관계자" : "가족이나 아는 사람"}
              </p>
              <p className="mt-1 text-base leading-7 text-stone-600">
                필요한 안부만 함께 볼 수 있게 설정돼요.
              </p>
            </div>

            <div className="grid gap-2">
              <FieldLabel>이름</FieldLabel>
              <input
                className={`${inputClassName} text-xl`}
                value={form.name}
                onChange={(event) =>
                  setForm((current) => ({ ...current, name: event.target.value }))
                }
                placeholder={mode === "care" ? "예: 복지관 담당자" : "예: 첫째"}
              />
            </div>

            <div className="grid gap-2">
              <FieldLabel>관계</FieldLabel>
              <select
                className={`${inputClassName} text-xl`}
                value={form.relationship}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    relationship: event.target.value as Relationship,
                  }))
                }
              >
                {relationshipOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-2">
              <FieldLabel>연락처</FieldLabel>
              <input
                className={`${inputClassName} text-xl`}
                value={form.contact}
                onChange={(event) =>
                  setForm((current) => ({ ...current, contact: event.target.value }))
                }
                placeholder="전화번호"
                inputMode="tel"
              />
            </div>

            <Button className="w-full text-lg">
              <Plus size={22} aria-hidden />
              추가하기
            </Button>
          </Card>
        </form>
      ) : null}

      {contacts.length ? (
        <div className="space-y-3">
          {contacts.map((contact) => (
            <Card key={contact.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-2xl font-bold">{contact.name}</p>
                  <p className="mt-1 text-lg text-stone-600">
                    {getRelationshipLabel(contact.relationship)}
                    {contact.contact ? ` · ${contact.contact}` : ""}
                  </p>
                </div>
                <button
                  className="flex size-12 shrink-0 items-center justify-center rounded-full border border-brand-line bg-white text-stone-500"
                  onClick={() =>
                    setContacts((current) => current.filter((item) => item.id !== contact.id))
                  }
                  aria-label="함께 볼 사람 삭제"
                >
                  <Trash2 size={22} aria-hidden />
                </button>
              </div>
            </Card>
          ))}
        </div>
      ) : null}

      <Link
        href="/self"
        className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-white px-5 text-xl font-bold text-brand-ink shadow-sm"
      >
        <Home size={22} aria-hidden />
        홈으로 돌아가기
      </Link>
    </SelfShell>
  );
}

function ChoiceButton({
  icon,
  title,
  onClick,
}: {
  icon: string;
  title: string;
  onClick: () => void;
}) {
  return (
    <button
      className="flex min-h-24 items-center gap-4 rounded-2xl border border-brand-line bg-white p-5 text-left shadow-sm"
      onClick={onClick}
    >
      <span className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-brand-apricot text-4xl">
        {icon}
      </span>
      <span className="text-2xl font-bold">{title}</span>
    </button>
  );
}
