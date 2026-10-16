export type Theme = 'dark' | 'light';

export function getPreferredTheme(): Theme {
  try {
    const stored = localStorage.getItem('theme');
    if (stored === 'dark' || stored === 'light') return stored;
  } catch {
    // localStorage no disponible: se usa la preferencia del sistema.
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

export function applyTheme(theme: Theme, toggle?: HTMLButtonElement | null): void {
  const isDark = theme === 'dark';
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem('theme', theme);
  } catch {
    // Sin almacenamiento: el tema solo vive en el DOM.
  }
  toggle?.setAttribute(
    'aria-label',
    isDark ? 'Activar modo claro' : 'Activar modo oscuro',
  );
  toggle?.setAttribute('aria-pressed', isDark ? 'true' : 'false');
}

export function initThemeToggle(toggleId = 'themeToggle'): void {
  const toggle = document.getElementById(toggleId);
  if (!(toggle instanceof HTMLButtonElement)) return;
  applyTheme(document.documentElement.dataset.theme === 'dark' ? 'dark' : getPreferredTheme(), toggle);
  toggle.addEventListener('click', () => {
    const next: Theme =
      document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(next, toggle);
  });
}
