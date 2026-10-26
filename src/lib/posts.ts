// The pieces of writing, in a language. The English files hold the order, project, specimen and dates;
// a Korean file (src/content/writing-ko/<same slug>.md) supplies the words. With no Korean file, the
// Korean site shows the English piece (`fallback`, so the page can mark it lang="en").
import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n';

export type Piece = {
  id: string; // the slug, the same in both languages
  data: CollectionEntry<'writing'>['data'];
  entry: CollectionEntry<'writing'> | CollectionEntry<'writingKo'>; // what to render
  en: CollectionEntry<'writing'>;
  fallback: boolean;
};

export async function getPosts(lang: Lang): Promise<Piece[]> {
  const en = (await getCollection('writing')).sort((a, b) => a.data.order - b.data.order);
  const ko = lang === 'ko' ? await getCollection('writingKo') : [];
  return en.map((p) => {
    const k = ko.find((x) => x.id === p.id);
    return k
      ? { id: p.id, data: { ...p.data, ...k.data }, entry: k, en: p, fallback: false }
      : { id: p.id, data: p.data, entry: p, en: p, fallback: lang === 'ko' };
  });
}
