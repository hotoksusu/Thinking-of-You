"use client";

import { useState } from "react";
import { FamilyManagerShell } from "@/components/desktop-shells";
import { Button, Card, inputClassName } from "@/components/ui";
import { familyMembers } from "@/lib/mock-data";
import { getRelationshipLabel, relationshipOptions } from "@/lib/share-options";

export default function FamilyMembersPage() {
  const [invited, setInvited] = useState(false);

  return (
    <FamilyManagerShell
      title="함께하는 사람 관리"
      description="가족, 친척, 친구처럼 믿고 안부를 나눌 사람을 초대하고 권한을 설정합니다."
      active="/family/members"
    >
      <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <h2 className="text-lg font-bold">함께할 사람 초대</h2>
          <input className={`${inputClassName} mt-4`} placeholder="이름 또는 연락처" />
          <select className={`${inputClassName} mt-3`} defaultValue="sibling">
            {relationshipOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <select className={`${inputClassName} mt-3`}>
            <option>보기만 가능</option>
            <option>일정 수정 가능</option>
            <option>대표 관리자</option>
          </select>
          <Button className="mt-4 w-full" onClick={() => setInvited(true)}>
            초대 보내기
          </Button>
          {invited ? <p className="mt-3 text-sm font-bold text-brand-sage">초대 상태: 발송 완료</p> : null}
        </Card>
        <Card>
          <h2 className="text-lg font-bold">함께하는 사람 목록</h2>
          <div className="mt-4 space-y-3">
            {familyMembers.map((member) => (
              <div key={member.id} className="rounded-lg bg-brand-cream p-4">
                <p className="font-bold">{member.name}</p>
                <p className="mt-1 text-sm text-stone-600">{getRelationshipLabel(member.relationship)}</p>
                <p className="mt-1 text-xs font-bold text-brand-sage">{member.contact}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </FamilyManagerShell>
  );
}
