/** Runs before paint so light theme applies immediately (avoids OS dark-mode flash). */
export function ThemeScript() {
  const script = `
    (function () {
      try {
        if (!localStorage.getItem('kk-theme-migrated-v2')) {
          localStorage.setItem('kk-theme', 'light');
          localStorage.setItem('kk-theme-migrated-v2', '1');
        }
        var t = localStorage.getItem('kk-theme');
        document.documentElement.setAttribute('data-theme', t === 'dark' ? 'dark' : 'light');
      } catch (e) {
        document.documentElement.setAttribute('data-theme', 'light');
      }
    })();
  `;
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
