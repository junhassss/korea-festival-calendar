(function () {
  const REQUIRED_FIELDS = ['id', 'title', 'startDate', 'endDate'];
  const FALLBACK_IMAGE = null;

  function cleanText(value) {
    return typeof value === 'string' ? value.trim() : '';
  }

  function normalizeFestival(raw) {
    return {
      id: cleanText(raw.id),
      slug: cleanText(raw.slug) || cleanText(raw.id),
      title: cleanText(raw.title),
      description: cleanText(raw.description),
      region: cleanText(raw.region),
      city: cleanText(raw.city),
      address: cleanText(raw.address),
      venue: cleanText(raw.venue),
      latitude: raw.latitude !== null && raw.latitude !== '' && Number.isFinite(Number(raw.latitude)) ? Number(raw.latitude) : null,
      longitude: raw.longitude !== null && raw.longitude !== '' && Number.isFinite(Number(raw.longitude)) ? Number(raw.longitude) : null,
      startDate: cleanText(raw.startDate),
      endDate: cleanText(raw.endDate),
      category: cleanText(raw.category),
      tags: Array.isArray(raw.tags) ? [...new Set(raw.tags.filter(tag => typeof tag === 'string' && tag.trim()).map(tag => tag.trim()))] : [],
      free: typeof raw.free === 'boolean' ? raw.free : null,
      price: cleanText(raw.price) || null,
      night: typeof raw.night === 'boolean' ? raw.night : null,
      parking: typeof raw.parking === 'boolean' ? raw.parking : null,
      phone: cleanText(raw.phone) || null,
      image: cleanText(raw.image) || FALLBACK_IMAGE,
      source: cleanText(raw.source) || null,
      sourceUrl: cleanText(raw.sourceUrl) || null,
      updatedAt: cleanText(raw.updatedAt) || null,
      promoted: raw.promoted === true,
      promotionPriority: Number(raw.promotionPriority) || 0,
      promotionStartDate: cleanText(raw.promotionStartDate) || null,
      promotionEndDate: cleanText(raw.promotionEndDate) || null
    };
  }

  function validateFestival(festival) {
    const missing = REQUIRED_FIELDS.filter(field => !festival[field]);
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!datePattern.test(festival.startDate) || !datePattern.test(festival.endDate)) missing.push('validDate');
    if (festival.startDate && festival.endDate && festival.startDate > festival.endDate) missing.push('dateOrder');
    if (missing.length) {
      console.warn('[festival-data] 잘못된 축제 데이터를 제외합니다.', { id: festival.id || '(unknown)', missing });
      return false;
    }
    return true;
  }

  class LocalFestivalAdapter {
    adapt(record) { return normalizeFestival(record); }
  }

  class TourAPIAdapter {
    adapt(record) {
      return normalizeFestival({
        id: record.contentid,
        slug: record.slug || record.contentid,
        title: record.title,
        description: record.overview,
        region: record.region,
        city: record.city,
        address: record.addr1,
        venue: record.eventplace,
        latitude: record.mapy,
        longitude: record.mapx,
        startDate: record.eventstartdate,
        endDate: record.eventenddate,
        image: record.firstimage,
        phone: record.tel,
        source: record.source,
        sourceUrl: record.sourceUrl,
        updatedAt: record.modifiedtime
      });
    }
  }

  async function loadFestivals() {
    const response = await fetch('./festivals.json', { cache: 'no-cache' });
    if (!response.ok) throw new Error(`Festival data request failed: ${response.status}`);
    const payload = await response.json();
    const adapter = new LocalFestivalAdapter();
    const items = (Array.isArray(payload.items) ? payload.items : [])
      .map(item => adapter.adapt(item))
      .filter(validateFestival);
    return { items, updatedAt: cleanText(payload.updatedAt) || null };
  }

  window.FestivalData = {
    loadFestivals,
    normalizeFestival,
    validateFestival,
    LocalFestivalAdapter,
    TourAPIAdapter
  };
})();
