'use client';
import WebsiteDetailsPage from '../../(main)/websites/[websiteId]/WebsiteDetailsPage';
import { useLocale, useShareToken, useTheme } from '@/components/hooks';
import Page from '@/components/layout/Page';
import Header from './Header';
import Footer from './Footer';
import styles from './SharePage.module.css';
import { WebsiteProvider } from '@/app/(main)/websites/[websiteId]/WebsiteProvider';
import { useEffect } from 'react';

export default function SharePage({ shareId, contentOnly = false, mode, lang = 'fr' }) {
  const { shareToken, isLoading } = useShareToken(shareId);
  const { saveTheme } = useTheme();
  const { saveLocale } = useLocale();
  useEffect(() => {
    saveTheme(mode == 'dark' ? 'dark' : 'light');
  }, [mode]);

  useEffect(() => {
    if (lang) {
      if (lang === 'en') {
        saveLocale('en-US');
      } else if (lang === 'fr') {
        saveLocale('fr-FR');
      }
    }
  }, [lang]);
  if (isLoading || !shareToken) {
    return null;
  }

  return (
    <div className={styles.container}>
      <Page>
        {!contentOnly && <Header />}
        <WebsiteProvider websiteId={shareToken.websiteId}>
          <WebsiteDetailsPage websiteId={shareToken.websiteId} />
        </WebsiteProvider>
        {!contentOnly && <Footer />}
      </Page>
    </div>
  );
}
