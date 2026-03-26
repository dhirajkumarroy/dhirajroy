// assets/js/analytics.js
(function() {
  // Google Analytics - dynamic loading
  const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // Replace with your actual GA4 ID
  if (window.location.hostname !== 'localhost' && GA_MEASUREMENT_ID !== 'G-XXXXXXXXXX') {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag(){ dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID);
    window.gtag = gtag;

    console.log('Analytics initialized');
  } else {
    console.log('Analytics disabled (localhost or missing ID)');
  }
})();