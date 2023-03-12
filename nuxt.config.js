/* eslint-disable no-undef */
import axios from "axios";

const path = require('path')
require('newrelic');

export default {
  ssr: true,
  // Global page headers: https://go.nuxtjs.dev/config-head
  env: {
    SHARED_ENVS: {
      WEB_BASE_URL: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : process.env.WEB_URL_DXB,
      MPASS: {
        APIGEE_DOMAIN: process.env.MPASS_APIGEE_DOMAIN.trim() // TODO: Remove the trim function when Yazeed removes extra spaces from this variable.
      },
      MAFPAY: {
        BASE_URL: process.env.MAF_PAY_BASE_URL
      },
      APIGEE_BASE_URL: process.env.APIGEE_BASE_URL,
      CUSTOM_BE_LAYER_BASE_URL: process.env.CUSTOM_BE_LAYER_BASE_URL,
      EXTRA_LAYER_AMAZON_BASE_URL: process.env.CUSTOM_BE_LAYER_BASE_URL,
      PAYMENT_ENVIRONMENT: process.env.NODE_ENV === 'prod' ? "production" : "sandbox"
    },
    SKI_DUBAI: {
      SITEFINITY_DOMAIN: process.env.SKI_DUBAI_SITEFINITY_URL,
      SITEFINITY_DOMAIN_BASE_URL: process.env.SKI_DUBAI_SITEFINITY_BASE_URL,
      MPASS_CLIENT_ID: process.env.MPASS_CLIENT_ID,
      SHARE: {
        SPONSOR_ID: process.env.SKI_DUBAI_SPONSOR_ID
      },
      MAFPAY: {
        MERCHANT_ID: process.env.MAF_PAY_MERCHANT_ID,
        GOOGLE_PAY_MERCHANT_ID: process.env.GOOGLE_PAY_MERCHANT_ID,
        APPLE_PAY_MERCHANT_ID: process.env.APPLE_DXB_MERCHANT_IDENTIFIER
      },
      GTM_ID: process.env.GTM_ID,
      CMS_ASSETS: '/docs/default-source/web-assets/'
    },
    SNOW_ABD: {
      SITEFINITY_DOMAIN: process.env.SNOW_AD_SITEFINITY_URL,
      SITEFINITY_DOMAIN_BASE_URL: process.env.SNOW_AD_SITEFINITY_BASE_URL,
      MPASS_CLIENT_ID: process.env.MPASS_SNOW_ABU_DHABI_CLIENT_ID || 'PHMuClHfB63W5HT3LwehK7jvhw7PXfWG',
      MAFPAY: {
        MERCHANT_ID: process.env.SNOW_AD_MAF_PAY_MERCHANT_ID || "SZTQRDCD587233",
        APPLE_PAY_MERCHANT_ID: process.env.APPLE_ABD_MERCHANT_IDENTIFIER
      },
      SHARE: {
        SPONSOR_ID: process.env.SNOW_AD_SPONSOR_ID
      },
      GTM_ID: process.env.SNOW_ABD_GTM_ID || 'GTM-N34VJGP',
      CMS_ASSETS: '/docs/snowabudhabilibraries/web-assets/'
    },
    SNOW_OMAN: {
      SITEFINITY_DOMAIN: process.env.SNOW_OMAN_SITEFINITY_URL,
      SITEFINITY_DOMAIN_BASE_URL: process.env.SNOW_OMAN_SITEFINITY_BASE_URL,
      MPASS_CLIENT_ID: process.env.MPASS_OMAN_CLIENT_ID,
      MAFPAY: {
        MERCHANT_ID: process.env.OMAN_MAF_PAY_MERCHANT_ID,
      },
      GTM_ID: process.env.SNOW_OMAN_GTM_ID || 'GTM-NS74PMW',
      CMS_ASSETS: '/docs/snowomanlibraries/web-assets/'
    },
    PRIVACY_CENTER_APP_ID: process.env.PRIVACY_CENTER_APP_ID,
    MIDDLEWARE_BASE_URL: process.env.MIDDLEWARE_BASE_URL,
    PRIVACY_CENTER_URL: process.env.PRIVACY_CENTER_URL
  },
  head: {
    title: 'Global Snow',
    htmlAttrs: {
      dir: "ltr"
    },
    meta: [
      {charset: 'utf-8'},
      {name: "viewport", content: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"},
      {
        hid: 'description',
        name: 'description',
        content: 'Global Snow'
      },
      {
        name: 'format-detection',
        content: 'telephone=no'
      },
      {name: "msapplication-config", content: "/browserconfig.xml"},
      {name: "msapplication-TileColor", content: "#008DC6"},
      {name: "theme-color", content: "#ffffff"}
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico'
      },
      {rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png'},
      {rel: 'icon', sizes: '32x32', href: '/favicon-32x32.png'},
      {rel: 'icon', sizes: '16x16', href: '/favicon-16x16.png'},
      {rel: 'manifest', href: '/site.webmanifest'}
    ]
  },
  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    {
      src: '~/assets/css/style.scss',
      rel: "preload",
    }
  ],
  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    {src: '~/plugins/server-common.js'},
    {src: '~/plugins/i18n.js'},
    {src: '~/plugins/axios.js'},
    {src: '~/plugins/api.js'},
    {src: '~/plugins/custom-plugin.js', mode: 'client', ssr: false},
    {src: '~/plugins/common.js', mode: 'client', ssr: false},
    {src: '~/plugins/filters.js', mode: 'client', ssr: false},
    {src: '~/plugins/directive.js', mode: 'client', ssr: false},
    {src: '~/plugins/helpers', mode: 'client', ssr: false},
    {src: '~/plugins/vee-validate.js', mode: 'client', ssr: false},
    {src: '~/plugins/vuex-persist', mode: 'client', ssr: false},
    {src: '~/plugins/shared-components', mode: 'client', ssr: false},
    {src: '~/plugins/booking-flow.js', mode: 'client', ssr: false},
    {src: '~/plugins/qualtrics-call.js', mode: 'client', ssr: false},
    {src: '~/plugins/gtm.js', mode: 'client', ssr: false},
  ],
  middleware: [
    '~/middleware/authenticated.js'
  ],
  serverMiddleware: [
    '~/middleware/redirects.js',
  ],
  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    'nuxt-compress',
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxt/postcss8',
  ],
  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    ['nuxt-i18n',
      {
        strategy: 'prefix',
        seo: false,
        langDir: 'lang/',
        lazy: true,
        locales: [
          {
            code: 'en-ae/ski-dubai',
            iso: 'en-ae',
            file: 'en.js',
            detectedLang: "en",
            dir: 'ltr'
          },
          {
            code: 'en-om/snow-oman',
            iso: 'en-om',
            file: 'en.js',
            detectedLang: "en",
            dir: 'ltr'
          },
          {
            code: 'en-ae/snow-abu-dhabi',
            iso: 'en-ae',
            file: 'en.js',
            detectedLang: "en",
            dir: 'ltr'
          },
          {
            code: 'ar-ae/ski-dubai',
            iso: 'ar-ae',
            file: 'ar.js',
            detectedLang: "ar",
            dir: 'rtl'
          },
          {
            code: 'ar-om/snow-oman',
            iso: 'ar-om',
            file: 'ar.js',
            detectedLang: "ar",
            dir: 'rtl'
          },
          {
            code: 'ar-ae/snow-abu-dhabi',
            iso: 'ar-ae',
            file: 'ar.js',
            detectedLang: "ar",
            dir: 'rtl'
          }
        ],
        defaultLocale: 'en-ae/ski-dubai',
        fallbackLocale: 'en-ae/ski-dubai',
        detectBrowserLanguage: {
          // If enabled, a cookie is set once a user has been redirected to his
          // preferred language to prevent subsequent redirections
          // Set to false to redirect every time
          useCookie: true,
          // Cookie name
          cookieKey: 'i18n_redirected',
          // Set to always redirect to value stored in the cookie, not just once
          alwaysRedirect: false,
          onlyOnRoot: false,
          onlyOnNoPrefix: true
        },
      }
    ],
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
    'cookie-universal-nuxt',
    '@nuxtjs/gtm',
    '@nuxtjs/robots',
    '@nuxtjs/sitemap',
    '@nuxtjs/recaptcha',
    '@nuxt/image',
  ],
  recaptcha: {
    siteKey: process.env.RECAPTCHA_SITE_KEY,
    version: process.env.RECAPTCHA_VERSION
  },
  axios: {
    baseURL: process.env.SKI_DUBAI_SITEFINITY_URL,
    timeout: 55000
  },
  auth: {
    token: {
      global: false
    },
    strategies: {
      auth0: {
        token: {
          global: false
        },
        domain: process.env.MPASS_DOMAIN.trim(), // TODO: Remove the trim function when Yazeed removes extra spaces from this variable.
        clientId: process.env.MPASS_CLIENT_ID,
        scope: "openid email profile offline_access",
        responseType: 'code',
        audience: 'mafid',
        grantType: 'authorization_code',
        codeChallengeMethod: 'S256',
        refreshToken: {
          property: 'refresh_token',
          data: 'refresh_token',
          tokenRequired: true,
          grantType: 'refresh_token',
          maxAge: 60 * 60 * 24 * 30 * 30
        },
      },
    },
    localStorage: false,
    fullPathRedirect: true,
    redirect: {
      login: '/callback',
      logout: '/',
      callback: '/callback',
      home: '/'
    },
    cookie: {
      options: {
        maxAge: 25920000 // 1 month
      }
    },
    plugins: ['@/plugins/auth.js']
  },
  gtm: {
    enabled: true,
    autoInit: false,
    scriptDefer: true,
  },
  router: {
    prefetchLinks: false,
    scrollBehavior(to, from, savedPosition) {
      return {x: 0, y: 0}
    },
  },
  sassOptions: {
    // eslint-disable-next-line no-undef
    includePaths: [path.join(__dirname, '@/assets/css')]
  },
  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: ['gsap', 'mafpay'],
    babel: {
      compact: true,
    },
    postcss: {
      plugins: {
        tailwindcss: {},
        autoprefixer: {},
      },
    },
  },
  robots: [
    {
      "User-agent": '*',
      Disallow: ['/'],
    },
    {
      "User-agent": 'OneTrustBot',
      Allow: '*',
    },
    {
      "User-agent": 'Screaming Frog SEO Spider',
      Allow: '*',
    },
  ],
  sitemap: [
    {
      path: '/ski-dubai-ar-sitemap.xml',
      hostname: process.env.WEB_URL_DXB,
      exclude: [
        '**/en/**',
        '**/en-ae/**',
        '**/booking/**',
        '**/accounts/**',
        '**/snow-oman/**',
        '**/snow-oman',
        '**/privacy-policy',
        '**/terms-conditions',
        '**/page-not-found',
        '**/anti-fraud-disclaimer',
        '**/booking-failed',
        '**/callback',
        '/callback',
        '**/unauthorized',
        '/unauthorized',
        '**/ice-rink',
      ],
      routes: async () => {
        try {
          const SITEFINITY_URL = process.env.SKI_DUBAI_SITEFINITY_BASE_URL;

          const {data: dubaiRes} = await axios.get(`${SITEFINITY_URL}/api/CardDetails/GetMappedCardDetailsIdentifiers?Lang=ar&TimeZone=Asia/Dubai`);
          const dubaiDetailsPage = dubaiRes.Result.map((page) => `/ar-ae/ski-dubai/${page.toLowerCase()}`);

          return dubaiDetailsPage;
        } catch (e) {
          return [];
        }
      }
    },
    {
      path: '/ski-dubai-en-sitemap.xml',
      hostname: process.env.WEB_URL_DXB,
      exclude: [
        '**/ar/**',
        '**/ar-ae/**',
        '**/booking/**',
        '**/accounts/**',
        '**/snow-oman/**',
        '**/snow-oman',
        '**/privacy-policy',
        '**/terms-conditions',
        '**/page-not-found',
        '**/anti-fraud-disclaimer',
        '**/booking-failed',
        '**/callback',
        '/callback',
        '**/unauthorized',
        '/unauthorized',
        '**/ice-rink',
      ],
      routes: async () => {
        try {
          const SITEFINITY_URL = process.env.SKI_DUBAI_SITEFINITY_BASE_URL;

          const {data: dubaiRes} = await axios.get(`${SITEFINITY_URL}/api/CardDetails/GetMappedCardDetailsIdentifiers?Lang=en&TimeZone=Asia/Dubai`);
          const dubaiDetailsPage = dubaiRes.Result.map((page) => `/en-ae/ski-dubai/${page.toLowerCase()}`);

          return dubaiDetailsPage;
        } catch (e) {
          return [];
        }
      }
    },
    {
      path: '/snow-oman-ar-sitemap.xml',
      hostname: process.env.WEB_URL_DXB,
      exclude: [
        '**/booking/**',
        '**/en/**',
        '**/en-om/**',
        '**/accounts/**',
        '**/ski-dubai/**',
        '**/ski-dubai',
        '**/privacy-policy',
        '**/terms-conditions',
        '**/page-not-found',
        '**/anti-fraud-disclaimer',
        '**/booking-failed',
        '**/callback',
        '/callback',
        '**/unauthorized',
        '/unauthorized',
        '**/ski-academy',
        '**/ski-lessons',
        '**/snowboard-lessons',
      ],
      routes: async () => {
        try {
          const SITEFINITY_OMAN_URL = process.env.SNOW_OMAN_SITEFINITY_BASE_URL;

          const {data: omanRes} = await axios.get(`${SITEFINITY_OMAN_URL}/api/CardDetails/GetMappedCardDetailsIdentifiers?Lang=ar&TimeZone=Asia/Muscat`);
          const omanDetailsPage = [];
          omanRes.Result.forEach((page) => {
            omanDetailsPage.push(`/ar-om/snow-oman/${page.toLowerCase()}`);
          })

          return omanDetailsPage;
        } catch (e) {
          return [];
        }
      }
    },
    {
      path: '/snow-oman-en-sitemap.xml',
      hostname: process.env.WEB_URL_DXB,
      exclude: [
        '**/booking/**',
        '**/ar/**',
        '**/ar-om/**',
        '**/accounts/**',
        '**/ski-dubai/**',
        '**/ski-dubai',
        '**/privacy-policy',
        '**/terms-conditions',
        '**/page-not-found',
        '**/anti-fraud-disclaimer',
        '**/booking-failed',
        '**/callback',
        '/callback',
        '**/unauthorized',
        '/unauthorized',
        '**/ski-academy',
        '**/ski-lessons',
        '**/snowboard-lessons',
      ],
      routes: async () => {
        try {
          const SITEFINITY_OMAN_URL = process.env.SNOW_OMAN_SITEFINITY_BASE_URL;

          const {data: omanRes} = await axios.get(`${SITEFINITY_OMAN_URL}/api/CardDetails/GetMappedCardDetailsIdentifiers?Lang=en&TimeZone=Asia/Muscat`);
          const omanDetailsPage = [];
          omanRes.Result.forEach((page) => {
            omanDetailsPage.push(`/en-om/snow-oman/${page.toLowerCase()}`);
          })

          return omanDetailsPage;
        } catch (e) {
          return [];
        }
      }
    }
  ],
  server: {
    host: "0.0.0.0"
  },
  webfontloader: {
    custom: {
      families: [
        'Druk Heavy Italic',
        'Druk Text Wide Super Italic',
        'Druk Text Wide Bold',
        'Druk Text Heavy Italic',
        'Druk Text Super Italic',
        'Druk Wide Heavy Italic',
        'Druk Text Medium Italic',
        'Inter Reguler',
        'Inter Medium',
        'Inter Semi Bold',
        'Inter Bold',
        'Inter ExtraBold',
        'Caveat Bold',
        'MarselisPro Bold',
        'MarselisPro',
        'Roboto Bold',
        'Roboto Regular',
        'NotoSansArabic Reguler',
        'NotoSansArabic Medium',
        'NotoSansArabic SemiBold',
        'NotoSansArabic Bold',
        'NotoSansArabic ExtraBold',
        'Bukra',
        'Adapter'
      ],
      urls: ['~/assets/fonts/fonts.scss']
    }
  }
}
