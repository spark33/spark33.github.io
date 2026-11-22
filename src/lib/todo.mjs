// Markdown → the page, for writing: a paragraph that starts with "[Sean:" is a note to myself about what's still
// to write. It shows as a dashed "To write" box in the preview, so the gap is visible in place, and
// src/lib/launch.ts refuses to build the live site while any are left.
const walk = (node, f) => { f(node); (node.children || []).forEach((c) => walk(c, f)); };
const first = (node) => (node.type === 'text' ? node.value : node.children?.length ? first(node.children[0]) : '');

export default function todo() {
  return (tree) => walk(tree, (node) => {
    if (node.type !== 'element' || node.tagName !== 'p' || !/^\s*\[Sean:/.test(first(node))) return;
    node.properties = { ...node.properties, className: ['todo'] };
  });
}
