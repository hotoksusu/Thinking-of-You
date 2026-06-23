export function getTodayISO() {
  const now = new Date();
  return toISODate(now);
}

export function toISODate(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatKoreanDate(isoDate: string) {
  if (!isoDate) return "";
  const date = new Date(`${isoDate}T00:00:00`);
  return new Intl.DateTimeFormat("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "short",
  }).format(date);
}

export function formatShortDate(isoDate: string) {
  if (!isoDate) return "";
  const date = new Date(`${isoDate}T00:00:00`);
  return new Intl.DateTimeFormat("ko-KR", {
    month: "numeric",
    day: "numeric",
  }).format(date);
}

export function getWeekDates(endDate = new Date()) {
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(endDate);
    date.setDate(endDate.getDate() - (6 - index));
    return toISODate(date);
  });
}

export function isUpcoming(date: string) {
  return date >= getTodayISO();
}

