export type AppointmentState = "upcoming" | "today" | "past" | "noAppointment";
export function patientAppointment(value?: string, now = new Date()): { state: AppointmentState; label?: string; days?: number } {
  if (!value) return { state: "noAppointment" };
  const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(value);
  const parsed = new Date(dateOnly ? `${value}T00:00:00+09:00` : value);
  if (!Number.isFinite(parsed.getTime())) return { state: "noAppointment" };
  const day = (date: Date) => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
  const dateKey = day(parsed);
  if (dateOnly && dateKey !== value) return { state: "noAppointment" };
  const days = Math.round((Date.parse(dateKey)-Date.parse(day(now)))/86400000);
  const label = new Intl.DateTimeFormat("ko-KR", { timeZone: "Asia/Seoul", year:"numeric", month:"long", day:"numeric", weekday:"long", ...(!dateOnly ? {hour:"numeric",minute:"2-digit",hour12:true} : {}) }).format(parsed);
  return { state: days < 0 ? "past" : days === 0 ? "today" : "upcoming", label, days };
}
