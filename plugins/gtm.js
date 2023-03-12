export default function ({app}) {
  // eslint-disable-next-line no-undef
  if (process.client) {
    const site = app.i18n.locale?.toLowerCase() || 'ski dubai';
    const loweredCaseSiteName = site.toLowerCase();
    // eslint-disable-next-line no-undef
    const gtmID = loweredCaseSiteName.includes("oman") ? process.env.SNOW_OMAN.GTM_ID : loweredCaseSiteName.includes("dhabi") ? process.env.SNOW_ABD.GTM_ID : process.env.SKI_DUBAI.GTM_ID;

    (function (d) {
      const gtm = d.createElement("script");
      if (gtm) {
        gtm.setAttribute("src", `https://www.googletagmanager.com/gtm.js?id=${gtmID}`);
        (d?.head)?.appendChild(gtm);
      }
    })(document);
  }
}
