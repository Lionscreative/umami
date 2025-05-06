import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from 'components/layout/Layout';
import WebsiteDetails from 'components/pages/WebsiteDetails';
import useShareToken from 'hooks/useShareToken';
import useLocale from 'hooks/useLocale';

export default function SharePage() {
  const router = useRouter();
  const { id } = router.query;
  const shareId = id?.[0];
  const shareToken = useShareToken(shareId);

  const { saveLocale } = useLocale();

  const { lang } = router.query;

  useEffect(() => {
    if (lang) {
      if (lang === 'en') {
        saveLocale('en-US');
      } else if (lang === 'fr') {
        saveLocale('fr-FR');
      }
    }
  }, [lang]);

  if (!shareToken) {
    return null;
  }

  const { websiteId } = shareToken;

  return (
    <Layout header={false} footer={false}>
      <WebsiteDetails websiteId={websiteId} />
    </Layout>
  );
}
