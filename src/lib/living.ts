// How each title performs (Living titles). The same markup is used in the home list, on the piece itself,
// and in "Keep reading". Slugs without an entry just stay still. Scripts: src/scripts/living.ts.
// Each language has its own markup: the performance hangs on particular words (the sparkle, the two
// entities, the letters of "chemistry", the moon), so a translation has to place them again.
import type { Lang } from '../i18n';
const SPARK = 'M8 1c.5 3.2 1.8 5.5 7 7-5.2 1.5-6.5 3.8-7 7-.5-3.2-1.8-5.5-7-7 5.2-1.5 6.5-3.8 7-7z';
const words = (t: string) => t.split(' ').map((w) => '<span class="w">' + w + '</span>').join(' ');
const spark = `<span class="lspk"><svg viewBox="0 0 16 16"><path d="${SPARK}"/></svg><span class="guess"></span></span>`;
const chem = (w: string) => '<span class="chem">' + [...w].map((c) => '<span class="ch">' + c + '</span>').join('') + '</span>';
const LIVE: Record<Lang, Record<string, string>> = {
  en: {
    attention: words('Attention is the new bottleneck'),
    sparkle: `The ${spark} icon was a shrug`,
    'data-model': `The <span class="ent" data-e="a">use cases</span> are in the <span class="ent" data-e="b">data model</span>`,
    chemistry: `Team ${chem('chemistry')} is something you can design`,
    sola: `I built an AI chief-of-staff that talks <span class="once">once a day<span class="bub"></span></span>`,
    'this-site': `Paper, grain and a m<span class="mo" data-moon></span><span class="mo" data-moon></span>n`,
  },
  ko: {
    attention: words('이제 병목은 사람의 주의력이다'),
    sparkle: `${spark} 아이콘은 사실 ‘글쎄요’였다`,
    'data-model': `<span class="ent" data-e="a">유스케이스</span>는 <span class="ent" data-e="b">데이터 모델</span> 안에 있다`,
    chemistry: `팀 ${chem('케미스트리')}도 설계할 수 있다`,
    sola: `하루에 <span class="once">딱 한 번<span class="bub"></span></span> 말을 거는 AI 비서를 만들었다`,
    // no o's to fill in Korean: tonight's moon follows 달 instead
    'this-site': `한지, 결, 그리고 달<span class="mo end" data-moon></span>`,
  },
};
export const liveTitle = (slug: string, title: string, lang: Lang = 'en') => LIVE[lang][slug] ?? title;
