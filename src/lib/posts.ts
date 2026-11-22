// The pieces of writing, in a language. The English files hold the order, project, specimen, stage and dates;
// a Korean file (src/content/writing-ko/<same slug>.md) supplies the words. With no Korean file, the
// Korean site shows the English piece (`fallback`, so the page can mark it lang="en").
// Lists (home, keep reading, hover cards, the case study) only get essays and notes: an `idea` has no
// body yet, so it's left off until it's written. Its page still builds (`all`) for the preview.
import { getCollection, type CollectionEntry } from 'astro:content';
import { UI, type Lang } from '../i18n';

export type Piece = {
  id: string; // the slug, the same in both languages
  data: CollectionEntry<'writing'>['data'];
  entry: CollectionEntry<'writing'> | CollectionEntry<'writingKo'>; // what to render
  en: CollectionEntry<'writing'>;
  fallback: boolean;
};

export const listed = (p: { data: { stage: string } }) => p.data.stage !== 'idea';

export async function getPosts(lang: Lang, { all = false } = {}): Promise<Piece[]> {
  const en = (await getCollection('writing')).filter((p) => all || listed(p)).sort((a, b) => a.data.order - b.data.order);
  const ko = lang === 'ko' ? await getCollection('writingKo') : [];
  return en.map((p) => {
    const k = ko.find((x) => x.id === p.id);
    return k
      ? { id: p.id, data: { ...p.data, ...k.data }, entry: k, en: p, fallback: false }
      : { id: p.id, data: p.data, entry: p, en: p, fallback: lang === 'ko' };
  });
}

/** The short label beside a piece: lens, "Note" for notes, then the month it came out (or "Draft · <month>" before that). */
export function pieceMeta(d: Piece['data'], lang: Lang): string {
  const t = UI[lang];
  const month = (x: Date) => x.toLocaleDateString(t.locale, { month: 'short', year: 'numeric', timeZone: 'UTC' });
  const when = d.published ? month(d.published) : d.updated ? `${d.status} · ${month(d.updated)}` : d.status;
  return [d.lens, d.stage === 'note' ? t.note : '', when].filter(Boolean).join(' · ');
}
