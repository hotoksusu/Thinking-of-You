"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Gift, MapPin } from "lucide-react";
import { BottomTabBar } from "@/components/bottom-tab-bar";
import { getFarmCrop, readFarm, saveFarm } from "@/lib/reassurance-farm";

const addressKey = "oneul-anbu-harvest-gift-address";

type GiftAddress = {
  recipient: string;
  phone: string;
  postalCode: string;
  address: string;
  detail: string;
};

const defaultAddress: GiftAddress = {
  recipient: "어머님",
  phone: "010-1234-5678",
  postalCode: "06236",
  address: "서울시 강남구 테헤란로 123",
  detail: "101동 1203호",
};

export default function HarvestGiftPage() {
  const [form, setForm] = useState(defaultAddress);
  const [cropName, setCropName] = useState("수확 작물");
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    const farm = readFarm();
    const crop = getFarmCrop(farm?.lastHarvestedCropId);
    if (crop) setCropName(crop.name);

    const saved = window.localStorage.getItem(addressKey);
    if (saved) {
      try {
        setForm(JSON.parse(saved) as GiftAddress);
      } catch {
        // Keep the friendly example address when saved data is malformed.
      }
    }
  }, []);

  function updateField(field: keyof GiftAddress, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    window.localStorage.setItem(addressKey, JSON.stringify(form));
    const farm = readFarm();
    if (farm) saveFarm({ ...farm, giftStatus: "address_confirmed" });
    setComplete(true);
  }

  return (
    <main className="app-frame has-bottom-nav bg-[#FFF8F1] px-5 pt-7 text-[#17223B] sm:px-8">
      <div className="mx-auto w-full max-w-[680px]">
        <Link href="/app?role=family" className="inline-flex min-h-11 items-center gap-2 rounded-2xl bg-white px-4 text-sm font-black shadow-sm">
          <ArrowLeft size={18} aria-hidden /> 가족 화면
        </Link>

        {complete ? (
          <section className="mt-8 rounded-[30px] bg-white p-7 text-center shadow-[0_24px_70px_rgba(80,52,32,0.10)] sm:p-9">
            <span className="mx-auto flex size-20 items-center justify-center rounded-[26px] bg-[#DCFCE7] text-[#15803D]"><Check size={38} aria-hidden /></span>
            <p className="mt-6 text-sm font-black text-[#15803D]">배송지 확인 완료</p>
            <h1 className="mt-3 text-3xl font-black leading-tight">{cropName} 수확 선물을<br />준비할게요.</h1>
            <p className="mt-4 font-semibold leading-7 text-[#5D6678]">부모님께 직접 입력을 부탁드리지 않아도 됩니다. 실제 주문·결제 연결은 다음 단계에서 제공할 예정이에요.</p>
            <Link href="/app?role=family" className="mt-7 flex min-h-14 items-center justify-center rounded-2xl bg-[#F97316] px-5 text-lg font-black text-white">가족 화면으로 돌아가기</Link>
          </section>
        ) : (
          <>
            <header className="mt-8">
              <p className="text-sm font-black text-[#F45D18]">가족이 확인하는 수확 선물</p>
              <h1 className="mt-3 text-[2.25rem] font-black leading-tight">수확 선물을 받을<br />주소를 확인해주세요.</h1>
              <p className="mt-4 text-lg font-semibold leading-8 text-[#5D6678]">부모님께 직접 입력을 부탁드리지 않아도 됩니다.</p>
            </header>

            <section className="mt-7 rounded-[28px] border border-[#BBF7D0] bg-[#F0FDF4] p-5">
              <div className="flex items-center gap-4">
                <span className="flex size-14 items-center justify-center rounded-2xl bg-white text-[#15803D]"><Gift size={27} aria-hidden /></span>
                <div><p className="text-sm font-black text-[#15803D]">90일 수확 완료</p><p className="mt-1 text-lg font-black">{cropName} 수확 선물</p></div>
              </div>
            </section>

            <form onSubmit={submit} className="mt-5 rounded-[28px] bg-white p-6 shadow-[0_18px_48px_rgba(80,52,32,0.08)]">
              <div className="mb-5 flex items-center gap-3"><MapPin className="text-[#F45D18]" aria-hidden /><h2 className="text-xl font-black">배송지</h2></div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="받는 분" value={form.recipient} onChange={(value) => updateField("recipient", value)} />
                <Field label="연락처" value={form.phone} onChange={(value) => updateField("phone", value)} inputMode="tel" />
              </div>
              <div className="mt-4 grid gap-4">
                <Field label="우편번호" value={form.postalCode} onChange={(value) => updateField("postalCode", value)} inputMode="numeric" />
                <Field label="주소" value={form.address} onChange={(value) => updateField("address", value)} />
                <Field label="상세 주소" value={form.detail} onChange={(value) => updateField("detail", value)} />
              </div>
              <button type="submit" className="mt-6 min-h-16 w-full rounded-2xl bg-[#F97316] px-5 text-xl font-black text-white shadow-[0_16px_34px_rgba(249,115,22,0.24)]">수확 선물 보내기</button>
              <p className="mt-3 text-center text-sm font-semibold text-[#7A8495]">현재는 배송지 확인을 체험하는 화면이며 실제 주문은 진행되지 않습니다.</p>
            </form>
          </>
        )}
      </div>
      <BottomTabBar active="farm" />
    </main>
  );
}

function Field({ label, value, onChange, inputMode }: { label: string; value: string; onChange: (value: string) => void; inputMode?: "text" | "tel" | "numeric" }) {
  return (
    <label className="block text-sm font-black text-[#4B5563]">
      {label}
      <input required value={value} onChange={(event) => onChange(event.target.value)} inputMode={inputMode} className="mt-2 min-h-14 w-full rounded-2xl border border-[#E5E7EB] bg-[#FCFCFC] px-4 text-base font-bold text-[#17223B] outline-none focus:border-[#F97316]" />
    </label>
  );
}
