import areIntlLocalesSupported from 'intl-locales-supported';
import IntlPolyfill from 'intl';

const supportedLocales = [
  'en-AU',
];

if ( global.Intl ) {
    // Determine if the built-in `Intl` has the locale data we need.
  if ( !areIntlLocalesSupported( supportedLocales )) {
    Intl.NumberFormat   = IntlPolyfill.NumberFormat;
    Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat;
  }
} else {
  global.Intl = IntlPolyfill;
}
