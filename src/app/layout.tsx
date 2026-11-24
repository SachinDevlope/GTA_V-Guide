import { GoogleAnalytics } from '@next/third-parties/google';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';
import { CategoryNav } from '@/features/catalog/components/CategoryNav';
import { getCountsByMode } from '@/features/catalog/lib/cards';
import { CATEGORY_META } from '@/features/catalog/registry';
import { getMapMissions } from '@/features/map/lib/missions';
import { ModeProvider } from '@/features/mode/ModeProvider';
import { SearchIndexProvider } from '@/features/search/SearchIndexProvider';
import { SiteFooter } from '@/shared/components/layout/SiteFooter';
import { SiteHeader } from '@/shared/components/layout/SiteHeader';
import { themeBootScript } from '@/shared/components/ThemeToggle';
import './globals.css';

const body = Inter({ subsets: ['latin'], variable: '--font-body' });

export const metadata: Metadata = {
  title: { default: 'LS Index — GTA V & GTA Online reference', template: '%s · LS Index' },
  description:
    'Unofficial searchable GTA V and GTA Online reference: missions, heists, businesses, vehicles, weapons, characters, cheats, skills, collectibles and a mission map.',
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: ReactNode }) {
  const mapCount = getMapMissions().filter((m) => m.geo.point).length;
  return (
    <html lang="en" className={body.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <GoogleAnalytics gaId="G-KWJMBRXBYP" />
      {/* Browser extensions (e.g. ColorZilla's cz-shortcut-listen) add attributes to <body> before React loads. */}
      <body suppressHydrationWarning>
        <ModeProvider>
          <SearchIndexProvider categories={CATEGORY_META} counts={getCountsByMode()}>
            <SiteHeader />
            <div className="shell layout">
              <aside className="sidebar">
                <CategoryNav mapCount={mapCount} />
              </aside>
              <main className="content">{children}</main>
            </div>
            <SiteFooter />
          </SearchIndexProvider>
        </ModeProvider>
      </body>
    </html>
  );
}
