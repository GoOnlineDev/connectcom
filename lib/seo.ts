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
    robots: noIndex
      ? {
          index: false,
          follow: false,
          googleBot: {
            index: false,
            follow: false,
          },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        },
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

/**
 * Generate Marketplace schema for homepage
 */
export function generateMarketplaceSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Marketplace',
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    potentialAction: {
      '@type': 'BuyAction',
      target: `${siteConfig.url}/shops`,
    },
  };
}

/**
 * Generate LocalBusiness schema for shop pages
 */
export function generateLocalBusinessSchema({
  shopName,
  description,
  shopImageUrl,
  shopLogoUrl,
  contactInfo,
  physicalLocation,
  operatingHours,
  categories,
  shopId,
  slug,
}: {
  shopName: string;
  description?: string;
  shopImageUrl?: string;
  shopLogoUrl?: string;
  contactInfo?: {
    email?: string;
    phone?: string;
    website?: string;
  };
  physicalLocation?: string | { city?: string; address?: string };
  operatingHours?: string;
  categories?: string[];
  shopId: string;
  slug: string;
}) {
  const baseUrl = siteConfig.url;
  const url = `${baseUrl}/shops/${shopId}/${slug}`;
  
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: shopName,
    url,
    description: description || `Shop from ${shopName} on ConnectCom`,
    image: shopImageUrl || shopLogoUrl || `${baseUrl}/logo.png`,
  };

  if (contactInfo?.email) {
    schema.email = contactInfo.email;
  }

  if (contactInfo?.phone) {
    schema.telephone = contactInfo.phone;
  }

  if (contactInfo?.website) {
    schema.sameAs = [contactInfo.website];
  }

  if (physicalLocation) {
    if (typeof physicalLocation === 'string') {
      schema.address = {
        '@type': 'PostalAddress',
        addressLocality: physicalLocation.split(',')[0] || 'Uganda',
        addressCountry: 'UG',
      };
    } else {
      schema.address = {
        '@type': 'PostalAddress',
        addressLocality: physicalLocation.city || 'Uganda',
        streetAddress: physicalLocation.address || '',
        addressCountry: 'UG',
      };
    }
  }

  if (operatingHours) {
    schema.openingHoursSpecification = {
      '@type': 'OpeningHoursSpecification',
      description: operatingHours,
    };
  }

  if (categories && categories.length > 0) {
    schema.category = categories;
  }

  return schema;
}

/**
 * Generate shop-specific metadata for SEO
 */
export function generateShopMetadata({
  shopName,
  description,
  shopImageUrl,
  shopLogoUrl,
  city,
  categories,
  shopId,
  slug,
}: {
  shopName: string;
  description?: string;
  shopImageUrl?: string;
  shopLogoUrl?: string;
  city?: string;
  categories?: string[];
  shopId: string;
  slug: string;
}): Metadata {
  const canonical = `${siteConfig.url}/shops/${shopId}/${slug}`;
  const metaDescription = description
    ? `${description.substring(0, 155)}${description.length > 155 ? '...' : ''}`
    : city
      ? `Shop products from ${shopName}. Located in ${city}. Delivered to your door.`
      : `Shop products from ${shopName}. Order online from ConnectCom Uganda.`;
  
  const title = `${shopName} - Order Online | ConnectCom Uganda`;
  const image = shopImageUrl || shopLogoUrl || siteConfig.ogImage;

  return constructMetadata({
    title,
    description: metaDescription,
    image,
    canonical,
    keywords: [
      shopName,
      ...(categories || []),
      'online shopping Uganda',
      'buy in Uganda',
      city || 'Uganda',
      'ConnectCom',
    ],
  });
}

