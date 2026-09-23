(function () {
  const allowedEvents = new Set([
    'festival_view', 'festival_favorite', 'festival_share', 'filter_apply',
    'search', 'map_marker_click', 'recommendation_view',
    'recommendation_click', 'official_site_click', 'affiliate_click',
    'top3_view', 'top3_click', 'compare_add', 'compare_remove', 'compare_open',
    'weekend_plan_add', 'weekend_plan_remove', 'today_pick_open', 'today_pick_click',
    'recommendation_reason_view'
  ]);

  function track(eventName, parameters = {}) {
    if (!allowedEvents.has(eventName)) return;
    const event = { event: eventName, ...parameters };
    window.dispatchEvent(new CustomEvent('festival:analytics', { detail: event }));
    if (Array.isArray(window.dataLayer)) window.dataLayer.push(event);
  }

  window.FestivalAnalytics = { track, allowedEvents: [...allowedEvents] };
})();
