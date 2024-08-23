// components/Meta.js
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const Meta = ({ title, description, keywords }) => {
  const router = useRouter();
  const [canonicalUrl, setCanonicalUrl] = useState('');

  useEffect(() => {
    const fullUrl = `${window.location.origin}${router.asPath}`;
    setCanonicalUrl(fullUrl);
  }, [router.asPath]);

  return (
    <Head>
      <title>{title}</title>
      <meta property="og:title" content={title} />
      <meta name="twitter:title" content={title} />
      <meta name="description" content={description} />
      <meta property="og:description" content={description} />
      <meta name="twitter:description" content={description} />
      <meta name="keywords" content={keywords} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
    </Head>
  );
};

export default Meta;
