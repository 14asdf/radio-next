import { NextResponse } from 'next/server';
import Negotiator from 'negotiator';
import { match } from '@formatjs/intl-localematcher';

const COOKIE_LOCALE_NAME = 'NEXT_LOCALE';
const COOKIE_THEME_NAME = 'NEXT_THEME';
const defaultLocale = 'en';
const defaultTheme = 'system';
const locales = ['en', 'ru', 'es', 'de', 'fr'];
const themes = ['light', 'dark', 'system'];

function getAcceptLanguageLocale(requestHeaders, locales, defaultLocale) {
  let locale;
  const languages = new Negotiator({
    headers: {
      'accept-language': requestHeaders.get('accept-language') || undefined,
    },
  }).languages();

  try {
    locale = match(languages, locales, defaultLocale);
  } catch (e) {
    // Invalid language
  }
  return locale;
}

function resolveLocale(locales, defaultLocale, requestHeaders, requestCookies) {
  let locale;

  // Check cookie first
  if (requestCookies.has(COOKIE_LOCALE_NAME)) {
    const value = requestCookies.get(COOKIE_LOCALE_NAME)?.value;
    if (value && locales.includes(value)) {
      locale = value;
    }
  }

  // Fallback to accept-language header
  if (!locale) {
    locale = getAcceptLanguageLocale(requestHeaders, locales, defaultLocale);
  }

  // Final fallback to default
  return locale || defaultLocale;
}

function resolveTheme(requestCookies) {
  // Check cookie first
  if (requestCookies.has(COOKIE_THEME_NAME)) {
    const value = requestCookies.get(COOKIE_THEME_NAME)?.value;
    if (value && themes.includes(value)) {
      return value;
    }
  }

  // Fallback to system theme
  return defaultTheme;
}

export async function middleware(request) {
  const response = NextResponse.next();

  // Handle locale
  const locale = resolveLocale(
    locales,
    defaultLocale,
    request.headers,
    request.cookies
  );

  // Handle theme
  const theme = resolveTheme(request.cookies);

  // Update cookies if needed
  if (request.cookies.get(COOKIE_LOCALE_NAME)?.value !== locale) {
    response.cookies.set(COOKIE_LOCALE_NAME, locale, {
      sameSite: 'strict',
    });
  }

  if (request.cookies.get(COOKIE_THEME_NAME)?.value !== theme) {
    response.cookies.set(COOKIE_THEME_NAME, theme, {
      sameSite: 'strict',
    });
  }

  response.headers.set('x-next-intl-locale', locale);
  return response;
}

// Update matcher to catch more routes
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
