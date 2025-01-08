import { getTranslations } from 'next-intl/server';

export async function generatePageMetadata({
  title: pageTitle,
  image: pageImage,
  description: pageDescription,
}) {
  const t = await getTranslations('metadata.default');

  const defaultTitle = t('title');
  const defaultImage = '/android-chrome-192x192.png';
  const defaultDescription = t('description');

  const title =
    pageTitle && pageTitle !== defaultTitle
      ? `${pageTitle} | ${defaultTitle}`
      : defaultTitle;
  const image = pageImage || defaultImage;
  const description = pageDescription || defaultDescription;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [image],
      type: 'website',
      siteName: defaultTitle,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    other: {
      'telegram-channel:image': image,
      'telegram-channel:title': title,
      'telegram-channel:description': description,
    },
  };
}
