(function () {
  function read(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value === null ? fallback : JSON.parse(value);
    } catch (error) {
      console.warn(`[storage] ${key} 값을 읽지 못했습니다.`, error);
      return fallback;
    }
  }

  function write(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn(`[storage] ${key} 값을 저장하지 못했습니다.`, error);
      return false;
    }
  }

  window.FestivalStorage = { read, write };
})();
