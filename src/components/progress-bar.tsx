export function ProgressBar({ value }: { value: number }) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-stone-100">
      <div
        className="h-full rounded-full bg-[#2563EB] transition-all"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

