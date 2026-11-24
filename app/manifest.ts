import type { MetadataRoute } from 'next';
import { careBrand } from '@/lib/care-brand';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: careBrand.name, short_name: careBrand.shortName, description: careBrand.description,
    start_url: '/', scope: '/', display: 'standalone', lang: 'ko',
    background_color: careBrand.colors.white, theme_color: careBrand.colors.primary,
    icons: [
      { src: careBrand.icon192, sizes: '192x192', type: 'image/png' },
      { src: careBrand.icon512, sizes: '512x512', type: 'image/png' },
    ],
  };
}
