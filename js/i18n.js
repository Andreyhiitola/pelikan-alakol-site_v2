(function () {
  const STORAGE_KEY = 'pelikan_lang';
  const LANGS = ['ru', 'kz', 'en'];
  let T = {};
  let lang = localStorage.getItem(STORAGE_KEY) || 'ru';

  function t(key) {
    if (lang === 'ru') return null;
    return (T[lang] || {})[key] ?? null;
  }

  function apply() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const v = t(el.dataset.i18n);
      if (v !== null) el.textContent = v;
    });
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const v = t(el.dataset.i18nHtml);
      if (v !== null) el.innerHTML = v;
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const v = t(el.dataset.i18nPlaceholder);
      if (v !== null) el.placeholder = v;
    });
    document.documentElement.lang = lang === 'kz' ? 'kk' : lang;
    document.querySelectorAll('.lang-btn').forEach(b =>
      b.classList.toggle('lang-btn--active', b.dataset.lang === lang)
    );
  }

  function setLang(l) {
    if (!LANGS.includes(l)) return;
    lang = l;
    localStorage.setItem(STORAGE_KEY, l);
    apply();
  }

  function renderSwitcher(container) {
    container.innerHTML = LANGS.map(l =>
      `<button class="lang-btn${l === lang ? ' lang-btn--active' : ''}" data-lang="${l}" onclick="i18n.setLang('${l}')">${l === 'kz' ? 'ҚАЗ' : l.toUpperCase()}</button>`
    ).join('');
  }

  async function init() {
    try {
      const base = document.querySelector('base')?.href || '';
      T = await fetch(base + 'i18n/translations.json').then(r => r.json());
    } catch (e) {
      console.warn('i18n: translations not loaded', e);
    }
    apply();
    document.querySelectorAll('.lang-switcher').forEach(renderSwitcher);
  }

  // tr(key, fallback) — for use in JS template strings
  function tr(key, fallback) {
    const v = t(key);
    return v !== null ? v : (fallback ?? key);
  }

  window.i18n = { setLang, apply, tr };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
