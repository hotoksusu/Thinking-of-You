export default function PatientPreviewLayout({ children }: { children: React.ReactNode }) {
  return <><link rel="preload" as="image" href="/assets/characters/care-companion.webp" />{children}</>;
}
