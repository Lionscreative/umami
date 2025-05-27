 'use client';

import SharePage from './SharePage';

export default async function ({ params , searchParams }: { params: Promise<{ shareId: string }>, searchParams: Promise<{ [key: string]: string } >}) {
  const { shareId } = await params;
  const {mode ,lang } = await searchParams ;
  
  return <SharePage lang={lang ||'en'} shareId={shareId[0]} contentOnly={shareId[1] && shareId[1] === 'iframe'} mode={mode || 'light'}/>;
}
