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
const EMAIL_IS_REAL = !EMAIL.endsWith('@example.com');

// Who this site is about, for search engines and AI answer engines (JSON-LD, llms.txt, feeds).
// "Sean Park" is a common name: the alternate names, employer and sameAs links are what tell
// Google/ChatGPT/Perplexity which Sean Park this is. Only put facts here that are public.
export const PERSON = {
  name: 'Sean Park',
  alternateName: ['Sanghyun Park', '박상현'],
  jobTitle: 'Product & Frontend Lead',
  employer: { name: 'Mindlogic', url: 'https://mindlogic.ai' },
  city: 'Seoul', country: 'KR',
  alumniOf: { name: 'Carnegie Mellon University', url: 'https://www.cmu.edu' },
  languages: ['English', 'Korean'],
  description: 'Sean Park is a product lead at Mindlogic in Seoul, leading Baze (formerly FactChat), one account for 80+ AI models. Sean owns the UX and product direction, still writes much of the frontend, and writes about building AI products.',
  knowsAbout: ['AI product management', 'Product design', 'UX design', 'Human-computer interaction', 'Frontend engineering', 'Design systems', 'React', 'Next.js', 'LLM products', 'Multi-model AI platforms'],
  // Profiles that are definitely Sean's (add any others here).
  sameAs: ['https://www.linkedin.com/in/spark6/', 'https://github.com/spark33'],
  email: EMAIL_IS_REAL ? EMAIL : undefined,
};
export const SITE_DESCRIPTION = 'Sean Park leads product for Baze at Mindlogic in Seoul, and writes about building AI products: attention, trust, data models and teams.';

export const LINKS = {
  mindlogic: 'https://mindlogic.ai',
  baze: 'https://baze.co',
};

// Where I've worked, newest first. Roles and years from Sean's LinkedIn (2026-10-26). `line` is the short version for the hover card.
export const EXPERIENCE = [
  { company: 'Mindlogic', url: LINKS.mindlogic, card: 'mindlogic', where: 'Seoul', role: 'Product & Frontend Lead', years: '2024–now',
    did: '<a href="/work/baze/" data-card="case" style="view-transition-name:baze-title">Baze</a> <span class="faint">(formerly FactChat)</span>: UX, direction, architecture, frontend. Grew with it from 28 to 100+ universities and 750K users; 2,500+ PRs.' },
  { company: 'MongoDB', url: 'https://www.mongodb.com', card: 'mongodb', where: 'New York', role: 'UI Engineer', years: '2022–2024',
    did: 'Led the architecture of MongoDB’s first reusable AI chatbot UI library, and of the Next.js docs site (Okta SSO, two CMS migrations).',
    line: 'Led the architecture of MongoDB’s first reusable AI chatbot UI library, in React.' },
  { company: 'Deloitte Digital', url: 'https://www.deloittedigital.com', card: 'deloitte', where: 'Chicago', role: 'Frontend Engineer', years: '2019–2022',
    did: 'Front-end architect and lead developer on client builds for a telecom and a training platform. Mentored six developers in React, TypeScript and Next.js.',
    line: 'Front-end architect and lead developer on client builds. Mentored six developers.' },
];

// Education, for the About section.
export const EDUCATION = 'I studied Information Systems and Human-Computer Interaction at Carnegie Mellon (2019), and TA’d programming courses there.';

// The one project shown in depth.
export const BAZE = {
  title: 'Baze',
  aka: 'formerly FactChat',
  role: 'Product & Frontend Lead',
  team: 'A small team I lead',
  timeline: 'Mar 2024–now',
  stack: 'Next.js · logician-ui',
  outcome: '750K users · 100+ universities',
  blurb: 'One account for 80+ AI models, plus agents for research, slides, images and video. We launched it for universities as FactChat in March 2024, then renamed it Baze in October 2026 and opened it to everyone from ₩5,900 a month.',
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
