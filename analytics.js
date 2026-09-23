(function () {
  const allowedEvents = new Set([
    'festival_view', 'festival_favorite', 'festival_share', 'filter_apply',
    'search', 'map_marker_click', 'recommendation_view',
    'recommendation_click', 'official_site_click', 'affiliate_click'
  ]);

  function track(eventName, parameters = {}) {
    if (!allowedEvents.has(eventName)) return;
    const event = { event: eventName, ...parameters };
    window.dispatchEvent(new CustomEvent('festival:analytics', { detail: event }));
    if (Array.isArray(window.dataLayer)) window.dataLayer.push(event);
  }

  window.FestivalAnalytics = { track, allowedEvents: [...allowedEvents] };
})();
