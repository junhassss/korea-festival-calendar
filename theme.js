(function () {
  const systemTheme = matchMedia('(prefers-color-scheme: dark)');

  function resolvedTheme(preference) {
    return preference === 'system' ? (systemTheme.matches ? 'dark' : 'light') : preference;
  }

  function applyTheme(preference) {
    const resolved = resolvedTheme(preference);
    document.documentElement.dataset.theme = resolved;
    document.documentElement.dataset.themePreference = preference;
    document.documentElement.style.colorScheme = resolved;
    const select = document.getElementById('themeSelect');
    const icon = document.getElementById('themeIcon');
    if (!select || !icon) return;
    select.value = preference;
    icon.textContent = resolved === 'dark' ? '🌙' : '☀️';
    const label = `화면 테마 선택, 현재 ${preference === 'system' ? `시스템 설정 (${resolved === 'dark' ? '다크' : '라이트'})` : `${resolved === 'dark' ? '다크' : '라이트'} 모드`}`;
    select.setAttribute('aria-label', label);
    select.title = label;
  }

  function setThemePreference(preference) {
    localStorage.setItem('theme', preference);
    applyTheme(preference);
  }

  function initTheme() {
    const stored = localStorage.getItem('theme') || 'system';
    applyTheme(['light', 'dark', 'system'].includes(stored) ? stored : 'system');
    const onSystemChange = () => {
      if ((localStorage.getItem('theme') || 'system') === 'system') applyTheme('system');
    };
    systemTheme.addEventListener?.('change', onSystemChange);
    if (!systemTheme.addEventListener) systemTheme.addListener(onSystemChange);
  }

  window.setThemePreference = setThemePreference;
  window.initTheme = initTheme;
})();
