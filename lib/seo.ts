import { Metadata } from 'next';

export const siteConfig = {
  name: 'ConnectCom',
  description: 'Uganda\'s premier online marketplace connecting local businesses, shops, and services with customers nationwide',
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://connectcom.shop',
  ogImage: '/og-image.png',
  links: {
    twitter: 'https://twitter.com/connectcom',
    facebook: 'https://facebook.com/connectcom',
  },
};

export function constructMetadata({
  title = siteConfig.name,
  description = siteConfig.description,
  image = siteConfig.ogImage,
  icons = '/favicon.ico',
  noIndex = false,
  canonical,
  keywords,
}: {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
  noIndex?: boolean;
  canonical?: string;
  keywords?: string[];
} = {}): Metadata {
  return {
    title: {
      default: title,
      template: `%s | ${siteConfig.name}`,
    },
    description,
    keywords: keywords || [
      'Uganda marketplace',
      'online shopping Uganda',
      'local businesses Uganda',
      'buy products Uganda',
      'services Uganda',
      'e-commerce Uganda',
      'Kampala shops',
      'Uganda vendors',
      'African marketplace',
      'local shops online',
    ],
    authors: [
      {
        name: 'ConnectCom',
        url: siteConfig.url,
      },
    ],
    creator: 'ConnectCom',
    openGraph: {
      type: 'website',
      locale: 'en_UG',
      url: canonical || siteConfig.url,
      title,
      description,
      siteName: siteConfig.name,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: '@connectcom',
    },
    icons: {
      icon: icons,
      shortcut: icons,
      apple: '/favicon/apple-touch-icon.png',
    },
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: canonical || siteConfig.url,
    },
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}

export function generateStructuredData({
  type,
  data,
}: {
  type: 'Organization' | 'WebSite' | 'Product' | 'LocalBusiness';
  data: Record<string, any>;
}) {
  const baseStructure = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data,
  };

  return baseStructure;
}

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'ConnectCom',
  description: siteConfig.description,
  url: siteConfig.url,
  logo: `${siteConfig.url}/logo.png`,
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'Customer Service',
    email: 'support@connectcom.shop',
  },
  sameAs: [
    siteConfig.links.twitter,
    siteConfig.links.facebook,
  ],
};

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'ConnectCom',
  url: siteConfig.url,
  description: siteConfig.description,
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${siteConfig.url}/shops?search={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

