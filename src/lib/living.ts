// How each title performs (Living titles). The same markup is used in the home list, on the piece itself,
// and in "Keep reading". Slugs without an entry just stay still. Scripts: src/scripts/living.ts.
const SPARK = 'M8 1c.5 3.2 1.8 5.5 7 7-5.2 1.5-6.5 3.8-7 7-.5-3.2-1.8-5.5-7-7 5.2-1.5 6.5-3.8 7-7z';
const words = (t: string) => t.split(' ').map((w) => '<span class="w">' + w + '</span>').join(' ');
const LIVE: Record<string, string> = {
  attention: words('Attention is the new bottleneck'),
  sparkle: `The <span class="lspk"><svg viewBox="0 0 16 16"><path d="${SPARK}"/></svg><span class="guess"></span></span> icon was a shrug`,
  'data-model': `The <span class="ent" data-e="a">use cases</span> are in the <span class="ent" data-e="b">data model</span>`,
  chemistry: 'Team <span class="chem">' + [...'chemistry'].map((c) => '<span class="ch">' + c + '</span>').join('') + '</span> is something you can design',
  sola: `I built an AI chief-of-staff that talks <span class="once">once a day<span class="bub"></span></span>`,
  'this-site': `Paper, grain and a m<span class="mo" data-moon></span><span class="mo" data-moon></span>n`,
};
export const liveTitle = (slug: string, title: string) => LIVE[slug] ?? title;
