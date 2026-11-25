import type { CSSProperties } from 'react';
import type { Metadata, Viewport } from 'next';
import { Suspense } from 'react';
import { LegacyKakaoLoader } from '@/components/legacy-kakao-loader';
import { PwaRegister } from '@/components/pwa-register';
import { ReadabilityFrame } from '@/components/readability-frame';
import { careBrand, careDemo, isDanyeon } from '@/lib/care-brand';
import { careUrls } from '@/lib/care-urls';
import './globals.css';
import './onboarding.css';
import './readability.css';
import './danyeon.css';
import './danyeon-landing.css';
import './overview.css';

export const metadata: Metadata = {
  metadataBase: new URL(careUrls.origin),
  applicationName: careBrand.name,
  title: careBrand.name + ' | ' + careBrand.slogan,
  description: careBrand.description,
  openGraph: {
    url: careUrls.canonical,
    title: careBrand.name + ' · ' + careBrand.og.title,
    description: careBrand.og.description,
    images: [{ url: careBrand.og.image, width: 1200, height: 630, alt: careBrand.name + ' · ' + careBrand.og.title }],
  },
  manifest: careBrand.manifest,
  appleWebApp: { capable: true, title: careBrand.shortName, statusBarStyle: 'default' },
  icons: {
    shortcut: [{ url: careBrand.favicon }],
    icon: [{ url: careBrand.favicon }, { url: careBrand.icon192, sizes: '192x192', type: 'image/png' }, { url: careBrand.icon512, sizes: '512x512', type: 'image/png' }],
    apple: [{ url: careBrand.apple }],
  },
  robots: careDemo.available ? { index: false, follow: false } : undefined,
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: careBrand.colors.white };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const colors = careBrand.colors;
  const style = {
    '--ui-primary': colors.primary, '--ui-primary-hover': colors.navy, '--ui-focus': colors.navy,
    '--ui-bg': colors.soft, '--ui-text': colors.ink, '--ui-secondary': colors.muted,
    '--ui-surface': colors.white,
  } as CSSProperties;
  return <html lang="ko" data-care-brand={isDanyeon ? 'danyeon' : undefined} data-care-demo={careDemo.local ? 'local' : undefined} style={style}><body>
    <Suspense fallback={null}><LegacyKakaoLoader /></Suspense>
    {!careDemo.local && <PwaRegister />}
    <ReadabilityFrame>{careDemo.local && <p className="danyeon-demo-banner">{careBrand.name} 비공개 데모 · 합성 데이터</p>}{children}</ReadabilityFrame>
  </body></html>;
}
