/* eslint-disable no-undef */
module.exports = {
  mode: 'jit',
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: [
      './components/**/*.{vue,js}',
      './layouts/**/*.vue',
      './pages/**/*.vue',
      './plugins/**/*.{js,ts}',
      './nuxt.config.{js,ts}'
    ]
  },
  theme: {
    textIndent: (theme, {negative}) => ({
      ...{
        '2.5': '0.625rem',
        '5': '1.25rem',
        '6': "1.313rem",
        '28': '7rem',
        '36': "9.188rem",
        '46': '11.313rem'
      },
      ...negative({}),
    }),
    extend: {
      fontFamily: {
        'druk-heavy-italic': "'Druk Heavy Italic', sans-serif",
        'druk-text-heavy-italic': "'Druk Text Heavy Italic', sans-serif",
        'druk-text-wide-super-italic': "'Druk Text Wide Super Italic', sans-serif",
        'druk-text-wide-bold': "'Druk Text Wide Bold', sans-serif",
        'druk-text-super-italic': "'Druk Text Super Italic', sans-serif",
        'druk-wide-heavy-italic': '"Druk Wide Heavy Italic", sans-serif',
        'inter-extra-bold': "'Inter ExtraBold', sans-serif",
        'inter-bold': "'Inter Bold', sans-serif",
        'inter-semi-bold': "'Inter Semi Bold', sans-serif",
        'inter-medium': "'Inter Medium', sans-serif",
        'inter-reguler': "'Inter Reguler', sans-serif",
        "caveat-bold": "'Caveat Bold', sans-serif",
        'druk-text-medium-italic': "'Druk Text Medium Italic', sans-serif",

        'marselis-pro-bold': "'MarselisPro Bold', sans-serif",
        'marselis-pro': "'MarselisPro', sans-serif",

        'roboto-regular': "'Roboto Regular',sans-serif",
        'roboto-bold': "'Roboto Bold',sans-serif",

        'noto-sans-arabic-extra-bold': "'NotoSansArabic ExtraBold', sans-serif",
        'noto-sans-arabic-bold': "'NotoSansArabic Bold', sans-serif",
        'noto-sans-arabic-semi-bold': "'NotoSansArabic Semi Bold', sans-serif",
        'noto-sans-arabic-medium': "'NotoSansArabic Medium', sans-serif",
        'noto-sans-arabic-reguler': "'NotoSansArabic Reguler', sans-serif",
        "bukra": "'Bukra', sans-serif",
        "adapter": "'Adapter', sans-serif",
      },
      fontSize: {
        '6xl': ['4rem', '3.5rem'],
        '7xl': ['5rem', '5.5rem'],
        '7.5xl': ['5.5rem', '5rem'],
        '9xl': ['7rem', '6rem'],

        'xxxl': '12.5rem',
        '10rem': '10rem',
        '7rem': '7rem',
        '17vw': '17vw',
        '4rem': ['4rem', '3.5rem'],
        '0.875rem': ['0.875rem', '1rem'],
        '12.5rem': ['12.5rem', '10rem'],
        '1.25rem': ['1.25rem', '1.5rem'],
        '2.375rem': ['2.375rem', '2.2rem'],
        '3.5rem': ['3.5rem', '3rem'],
        '1.5rem': ['1.5rem', '1.5rem'],
        '1rem': ['1rem', '0.875rem'],
        '0.25rem': '0.25rem',
        '0.5rem': '0.5rem'
      },
      screens: {
        'xs': {'min': '350px', 'max': '1023px'},
        'tsm': {'min': '360px', 'max': '767px'},
        '3xl': "1792px",
        '1xl': '1440px',
        "mobiles": {
          max: "600px"
        },
        'mobile': {'min': '200px', 'max': '1023px'},
        'mobile-tablet': {'min': '375px', 'max': '1023px'},
        'min-1120': '1120px',
        'min-300': '300px',
        'min-320': '320px',
        'min-360': '360px',
        'min-370': '370px',
        'mini-tablets': {'min': '500px', 'max': '767px'},
        'min-429': '429px',
        'small-laptop': {'min': '1024px', 'max': '1279px'},
        'tablet': {'min': '640px', 'max': '1023px'},
        'min-550': '550px',
        'min-700': '700px',
        'min-900': '900px',
        'min-910': '910px',
        'ski-dubai-content-max': '1096px',
        'min-1176': '1176px',
        'max-350': {'min': '1px', 'max': '350px'},
        'max-1176': {'min': '1px', 'max': '1176px'},
        'min-420': {'min': '420px'},
        'big-tablet': {'min': '768px', 'max': '1023px'},
        'sm-mobile-height': { 'raw': '(max-height: 811px)' },
      },
      spacing: {
        '1/5': "20%",
        '2.3': '0.5625rem',
      },
      borderWidth: {
        '1': '1px',
        '3': '3px',
      },
      margin: {
        '13': '3.25rem',
        '96.5': '24.125rem',
        '79': '19.5rem',
        '16.5': '4.4rem',
        '-21': '-5.25rem',
        '15.5': '3.625rem',
        '18': '4.25rem',
        '-18.5': '-4.625rem',
        '10.5': '2.625rem',
        '4.5': '1.125rem',
        '25': '6.125rem',
        '-9.5': '-2.375rem',
        '-5.5': '-1.375rem',
        '1.75': '0.4rem',
        '1.25': '0.35rem',
        '-10.5': '-2.625rem',
        '0.05': '0.05rem',
        '2.25': '0.55rem',
        '8.25': '2.1rem',
        '5.75': '1.45rem',
        '6.5': '1.7rem',
        '8.5': '2.125rem',
        '1.73': '0.43rem',
        '5.25': '1.3rem',
        '-1.2': '-0.3rem',
        '2.75': '0.7rem',
        '-2.8': '-0.8rem',
        '-58': '-14.5rem',
        '0.75': '0.188rem',
        '142': '35.5rem',
        '19': '4.75rem',
        '-47': '-11.75rem',
        '71': '17.75rem',
        '313': '0.313rem',
        '-13': '-3.25rem',
        '15': "3.75rem"
      },
      padding: {
        '10.75/100': '10.75%',
        '45.25': '11.25rem',
        '25.5': '6.375rem',
        '43': "10.75rem",
        '5.2': "1.375rem",
        '15': '3.75rem',
        '6.5': '1.625rem',
        '12.5': '3.125rem',
        '1.7': '0.4rem',
        '1.75': '0.45rem',
        '3.75': '0.95rem',
        '5.1': "1.3rem",
        '79': '19.875rem',
        '95': '23.8rem',
        '38': '9.5rem',
        '3px': '3px',
        '3.7': '0.938rem',
      },
      width: {
        '39.5/100': '39.5%',
        'hero-img-mobile': '375px',
        'hero-img-desktop': '464px',
        'passes-img-mobile': '343px',
        'passes-img-desktop': '352px',
        'ribbon-passes': '197px',
        '0.563rem': '0.563rem',
        '97.5/100': '97.5%',
        'fit': 'fit-content'
      },
      height: {
        '30': "7.5rem",
        '122': "30.625rem",
        '160': "40rem",
        'passes-img': '520px',
        'fit': "fit-content"
      },
      maxWidth: {
        'xs': '21rem',
        'lg': '33.5rem',
        'hero-img': '375px',
        '1xl': '1440px'
      },
      lineHeight: {
        '31': '7.75rem',
        '39': '9.75rem',
        '22': '5.375rem',
        '0.81': '0.81',
        '0.563rem': '0.563rem',
        '0.5rem': '0.5rem'
      },
      colors: {
        'dark-gray': '#1A1A1A',
        'light-gray': "#1a1a1a33",
        'light-green': '#09D704',
        'light-yellow': '#FAD903',
        'light-blue': '#0380C2',
        'lighter-gray': '#ECECEC',
        'dark-blue': '#122b6f',
        'lightest-grey': '#e1e1e1',
        'booking-bar-back-shadow': 'rgba(0, 0, 0, 0.7)',
        'booking-bar': 'rgba(217, 217, 217, 0.5)',
        'light-red': '#F11818',
        'dark-black': '#0A1432',
        'granite-gray': '#606060'
      },
      gap: {
        '1.75': '0.438rem'
      },
      zIndex: {
        '-1': '-1'
      },
      inset: {
        '47': '11.75rem',
        'unset': 'unset',
        '-19': '-4.75rem',
        '51': '12.75rem'
      },
      scale: {
        '85': '0.85'
      },
      backgroundImage: {
        'black-gradient': "linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 100%)",
        'gradient-light-blue-desktop': "url('~assets/images/Dubai/gradient-light-blue-desktop.webp')",
        'gradient-light-blue-mobile': "url('~assets/images/Dubai/gradient-light-blue-mobile.webp')",
        "gradient-light-blue-noise-desktop": "url('~assets/images/Dubai/gradient-light-blue-desktop.webp')",
        "gradient-light-blue-noise-moible": "url('~assets/images/Dubai/gradient-light-blue-mobile.webp')",
        "dark-blue-filtered": "url('~assets/images/AbuDhabi/dark-blue-filtered.png')",
        'gradient-dark-purple-desktop': "url('~assets/images/Oman/gradient-dark-purple-desktop.png')"
      },
      gridTemplateColumns: {
        'passes-card': 'repeat(auto-fill, 352px)',
      },
      borderOpacity: {
        '20': '0.2'
      },
      boxShadow: {
        'booking-bar-desktop': '0px 0px 8px rgba(0, 0, 0, 0.16)',
        'ribon': '0px 4px 4px rgba(0, 0, 0, 0.14)',
        'light-black': "0px 8px 12px rgba(0, 0, 0, 0.1)",
        'mid-black': "0px 12px 16px rgba(0, 0, 0, 0.16)",
        "dark-black": "0px 24px 32px -24px rgba(0, 0, 0, 0.24)",
        'heavy-dark-black': '0px 16px 48px rgba(0, 0, 0, 0.16)'
      },
      transitionProperty: {
        'position': 'position',
      },
      textColor: theme => ({
        ...theme('colors'),
      }),
      backgroundColor: theme => ({
        ...theme('colors'),
      })
    }
  },
  plugins: [
    require('tailwindcss-rtl'),
    require('tailwindcss-text-indent')(),
  ]
}
