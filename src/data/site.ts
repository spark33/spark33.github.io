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
export const CF_ANALYTICS_TOKEN = '9d066244898a47d5a697eb2073c60951';
// Google Analytics 4 measurement ID, e.g. 'G-XXXXXXXXXX'.
export const GA_ID = '';

export const EMAIL = 'seanpark1107@gmail.com';
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

// ── 한국어 (/ko/). The same facts, said in Korean. Names of roles and products stay as they are.
const EXPERIENCE_KO = [
  { ...EXPERIENCE[0], where: '서울', years: '2024–현재',
    did: '<a href="/ko/work/baze/" data-card="case" style="view-transition-name:baze-title">Baze</a> <span class="faint">(구 FactChat)</span>: UX, 제품 방향, 아키텍처, 프론트엔드. 대학 28곳에서 100곳 이상, 사용자 75만 명이 될 때까지 함께 키웠어요. PR 2,500개 이상.' },
  { ...EXPERIENCE[1], where: '뉴욕',
    did: 'MongoDB 최초의 재사용 가능한 AI 챗봇 UI 라이브러리와 Next.js 문서 사이트(Okta SSO, CMS 마이그레이션 두 번)의 아키텍처를 이끌었어요.',
    line: 'MongoDB 최초의 재사용 가능한 AI 챗봇 UI 라이브러리(React)의 아키텍처를 이끌었어요.' },
  { ...EXPERIENCE[2], where: '시카고',
    did: '통신사와 교육 플랫폼 클라이언트 프로젝트에서 프론트엔드 아키텍트이자 리드 개발자로 일했어요. 개발자 여섯 명에게 React, TypeScript, Next.js를 멘토링했어요.',
    line: '클라이언트 프로젝트의 프론트엔드 아키텍트이자 리드 개발자. 개발자 여섯 명을 멘토링했어요.' },
];
const EDUCATION_KO = '카네기멜런에서 정보시스템과 인간-컴퓨터 상호작용(HCI)을 공부했고(2019년 졸업), 그곳에서 프로그래밍 수업 조교도 했어요.';
const BAZE_KO = {
  ...BAZE,
  aka: '구 FactChat',
  team: '제가 이끄는 작은 팀',
  timeline: '2024년 3월–현재',
  outcome: '사용자 75만 명 · 대학 100곳 이상',
  blurb: '계정 하나로 AI 모델 80여 개, 그리고 리서치·슬라이드·이미지·영상 에이전트까지 쓸 수 있는 서비스예요. 2024년 3월 대학용 FactChat으로 시작해, 2026년 10월 이름을 Baze로 바꾸고 월 5,900원부터 누구나 쓸 수 있게 열었어요.',
  tldr: '작성 예정: 제품, 내 역할, 결과를 두 줄로.',
  bet: '작성 예정: 무엇에 걸었나. 왜 모든 모델을 계정 하나로, 그리고 왜 대학부터였나?',
  call: '작성 예정: 가장 어려웠던 결정. 후보는 리브랜딩: 기관용 FactChat을 월 5,900원짜리, 모두를 위한 Baze로 바꾼 일.',
  result: '2025년 10월 대학 28곳에서 1년 뒤 100곳 이상으로, 전체 기관은 600곳이 넘어요. 지금까지 75만 명이 썼어요. 2026년 9월 토큰 사용량은 1년 전의 약 48배였고, 캠퍼스 전체에 도입한 대학은 모두 재계약했어요.',
};
const SOLA_DAY_KO = [
  { t: '07:43', who: 'sola · inbox', m: '프로모션 23통 보관, 41통 라벨링. 답할 만한 리크루터 메일이 2통 있어요. 초안은 써 뒀고, 보낸 건 없어요.' },
  { t: '09:17', who: 'sola · morning', m: '4시까지 맑고, 그 뒤로 비. 오늘 밤 할 일은 하나: 20분짜리 통화. 카드를 준비해 두세요.' },
  { t: '13:02', who: '나', m: '지난달 같이 쓴 돈 나눠 줘', me: true },
  { t: '13:03', who: 'sola', m: '공유 시트에 38건 기록했어요. 모르는 가맹점 두 곳은 시트에 질문으로 남겨 뒀어요.' },
  { t: '19:53', who: 'sola · weekly', m: '다음 주는 빡빡해 보여요. 목요일에만 회의가 여섯 개예요. 개인 일은 두 개까지만 잡는 게 좋겠어요.' },
];

/** Everything above that changes with the language. */
export const forLang = (lang: 'en' | 'ko') => lang === 'ko'
  ? { EXPERIENCE: EXPERIENCE_KO, EDUCATION: EDUCATION_KO, BAZE: BAZE_KO, SOLA_DAY: SOLA_DAY_KO }
  : { EXPERIENCE, EDUCATION, BAZE, SOLA_DAY };
/** Copy that's still to be written: shown faint. */
export const isPh = (s: string) => /^(Placeholder|\[|작성 예정)/.test(s);
