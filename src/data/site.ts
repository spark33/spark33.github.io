// Everything the pages share. Edit here, not in the markup.

// Under construction: every page except /under-construction/ is hidden behind a
// preview gate (see Base.astro). Flip to false to publish.
export const UNDER_CONSTRUCTION = true;
// SHA-256 of Sean's preview key. The key itself is never committed: open any page
// with ?preview=<key> once and the browser remembers it (?preview=off forgets).
// This is a curtain, not a lock: the built HTML is public, so don't put secrets in drafts.
export const PREVIEW_HASH = 'bed2d1ba849b13e933561c18ab689a0823f9a87e1c551fa4f67c4f66f528a653';

// Analytics. Paste one (or both) and push; empty means no script is loaded.
// Cloudflare Web Analytics token (cookieless, no consent banner): dash.cloudflare.com → Web Analytics → Add a site.
export const CF_ANALYTICS_TOKEN = '';
// Google Analytics 4 measurement ID, e.g. 'G-XXXXXXXXXX'.
export const GA_ID = '';

export const EMAIL = 'hello@example.com'; // TODO(Sean): real address

export const LINKS = {
  mindlogic: 'https://mindlogic.ai',
  baze: 'https://baze.co',
};

// Where I've worked, newest first. TODO(Sean): roles, years, one line each.
export const EXPERIENCE = [
  { company: 'Mindlogic', url: LINKS.mindlogic, card: 'mindlogic', where: 'Seoul', role: 'Product lead', years: '2024–now',
    did: '<a href="/work/baze/" data-card="case" style="view-transition-name:baze-title">Baze</a> <span class="faint">(formerly FactChat)</span>: UX, direction, architecture, frontend. Grew with it from 28 to 100+ universities and 750K users; 2,500+ PRs.' },
  { company: 'MongoDB', url: 'https://www.mongodb.com', card: 'mongodb', where: 'New York', role: '[role]', years: '[years]', did: '<span class="ph">[One line: what you did there]</span>' },
  { company: 'Deloitte Digital', url: 'https://www.deloittedigital.com', card: 'deloitte', where: 'New York', role: '[role]', years: '[years]', did: '<span class="ph">[One line: what you did there]</span>' },
];

// The one project shown in depth.
export const BAZE = {
  title: 'Baze',
  aka: 'formerly FactChat',
  role: 'Product lead',
  team: 'Placeholder',
  timeline: '2024–',
  stack: 'Next.js · logician-ui',
  outcome: '750K users · 100+ universities',
  blurb: 'One account for 80+ AI models, plus agents for research, slides, images and video. We built it for universities as FactChat, then renamed it Baze in October 2026 and opened it to everyone from ₩5,900 a month.',
  tldr: 'Placeholder: the product, your role and the result, in two lines.',
  bet: 'Placeholder: the bet. Why one account for every model, and why universities first?',
  call: 'Placeholder: the hardest call. The rename is a candidate: FactChat for institutions becoming Baze for everyone at ₩5,900 a month.',
  result: 'From 28 universities in October 2025 to more than 100 a year later, and 600+ institutions in all. 750,000 people have used it. In September 2026 they ran about 48 times as many tokens as a year before, and every university that rolled it out campus-wide renewed.',
};

// sola's illustrative day (the agent piece). Replace with a real, redacted one before publishing.
export const SOLA_DAY = [
  { t: '07:43', who: 'sola · inbox', m: 'Archived 23 promos, labelled 41. Two recruiter emails worth answering. Drafts are ready; nothing sent.' },
  { t: '09:17', who: 'sola · morning', m: "Clear until 4, rain after. Tonight's one task: a 20-minute call. Have your card ready." },
  { t: '13:02', who: 'me', m: "split last month's shared expenses", me: true },
  { t: '13:03', who: 'sola', m: "Logged 38 rows to the shared sheet. Two merchants I didn't recognise; I asked about them in the sheet." },
  { t: '19:53', who: 'sola · weekly', m: "Next week looks heavy: Thursday has six meetings. I'd keep it to two personal tasks." },
];
