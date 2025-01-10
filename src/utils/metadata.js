import { useTranslations } from 'next-intl';

export async function generatePageMetadata({
  title: pageTitle,
  image: pageImage,
  description: pageDescription,
  alternates,
}) {
  const t = useTranslations('metadata');
  const defaultImage = '/android-chrome-192x192.png';
  const image = pageImage || defaultImage;

  const title = pageTitle || t('default.title');
  const description = pageDescription || t('default.description');

  const metadata = {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [image],
      type: 'website',
      siteName: title || t('default.title'),
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

  if (alternates) {
    metadata.alternates = alternates;
  }

  return metadata;
}
