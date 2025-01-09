export function generatePageMetadata({
  title: pageTitle,
  image: pageImage,
  description: pageDescription,
  alternates,
}) {
  const defaultTitle = 'Radio cloud';
  const defaultImage = '/android-chrome-192x192.png';
  const defaultDescription =
    'Listen to your favorite radio stations live online - free streaming radio';

  const title = pageTitle ? `${pageTitle} | ${defaultTitle}` : defaultTitle;
  const image = pageImage || defaultImage;
  const description = pageDescription || defaultDescription;

  const metadata = {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [image],
      type: 'website',
      siteName: 'Radio cloud',
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
