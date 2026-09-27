// Prefix internal links and images with the site's base path.
// On GitHub Pages the site lives under /<repository-name>/; on a custom
// domain (shivaswarodaya.com) the base is simply '/'.
const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export function u(path: string): string {
  if (!path.startsWith('/')) return path;
  return (base + path) || '/';
}

/** Current page path without the base, for highlighting the active menu item. */
export function stripBase(pathname: string): string {
  const p = base && pathname.startsWith(base) ? pathname.slice(base.length) : pathname;
  return p.replace(/\/$/, '') || '/';
}
