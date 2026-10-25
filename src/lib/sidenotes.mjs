// Markdown → the page, for writing. Two jobs, done at build time so the HTML is already right:
// 1. Footnotes ([^1] in markdown) become margin notes beside the line that cites them. On narrow
//    screens the number is a toggle that opens the note in place (no script). The list at the bottom goes.
// 2. Links that leave the site open in a new tab, so their hover card can say so.
const SITE = 'seanpark.page';
const el = (tagName, properties = {}, children = []) => ({ type: 'element', tagName, properties, children });
const text = (value) => ({ type: 'text', value });
const walk = (node, f, parent = null) => { f(node, parent); (node.children || []).forEach((c) => walk(c, f, node)); };

export default function sidenotes() {
  return (tree) => {
    // collect the notes, and drop the footnotes section
    const notes = new Map();
    walk(tree, (node, parent) => {
      if (node.tagName !== 'section' || node.properties?.dataFootnotes === undefined) return;
      walk(node, (li) => {
        if (li.tagName !== 'li' || !li.properties?.id) return;
        const body = [];
        li.children.filter((c) => c.type === 'element').forEach((p, i) => {
          if (i) body.push(text(' '));
          body.push(...(p.tagName === 'p' ? p.children : [p]));
        });
        const clean = body.filter((c) => !(c.tagName === 'a' && c.properties?.dataFootnoteBackref !== undefined));
        while (clean.length && clean.at(-1).type === 'text' && !clean.at(-1).value.trim()) clean.pop();
        notes.set('#' + li.properties.id, clean);
      });
      parent.children = parent.children.filter((c) => c !== node);
    });
    // swap each reference for: number (a toggle on phones) + the note itself
    walk(tree, (node) => {
      if (!node.children) return;
      node.children = node.children.flatMap((c) => {
        const a = c.tagName === 'sup' && c.children?.find((x) => x.tagName === 'a' && x.properties?.dataFootnoteRef !== undefined);
        if (!a || !notes.has(a.properties.href)) return [c];
        const n = a.children.map((x) => x.value || '').join(''), id = 'sn-' + n;
        return [
          el('label', { htmlFor: id, className: ['snref'], ariaLabel: `Note ${n}` }, [el('sup', {}, [text(n)])]),
          el('input', { type: 'checkbox', id, className: ['sntoggle'], ariaHidden: 'true', tabIndex: -1 }),
          el('span', { className: ['sn'], role: 'note' }, [el('sup', {}, [text(n)]), text(' '), ...notes.get(a.properties.href)]),
        ];
      });
    });
    walk(tree, (node) => {
      if (node.tagName !== 'a' || typeof node.properties?.href !== 'string') return;
      try { const u = new URL(node.properties.href); if (/^https?:$/.test(u.protocol) && !u.hostname.endsWith(SITE)) { node.properties.target = '_blank'; node.properties.rel = ['noopener']; } } catch (e) {}
    });
  };
}
