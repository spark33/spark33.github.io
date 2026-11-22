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

// The photo in About. Drop the file in public/ (e.g. public/sean.jpg, ~4:5, at least 600px wide) and set src;
// until then About shows an empty frame where it goes.
export const PHOTO = { src: '', width: 600, height: 750 };

// Education, for the About section.
export const EDUCATION = 'I studied Information Systems and Human-Computer Interaction at Carnegie Mellon (2019), and TA’d programming courses there.';

// The one project shown in depth.
export const BAZE = {
  title: 'Baze',
  aka: 'formerly FactChat',
  role: 'Product & Frontend Lead',
  team: 'A small team I lead',
  timeline: 'Jan 2025–now',
  stack: 'Next.js · logician-ui',
  outcome: '750K users · 100+ universities',
  blurb: 'One account for 80+ AI models, plus agents for research, slides, images and video. We launched it for universities as FactChat in March 2025, then renamed it Baze in October 2026 and opened it to everyone from ₩5,900 a month.',
  tldr: 'Placeholder: the product, your role and the result, in two lines.',
  bet: 'Placeholder: the bet. Why one account for every model, and why universities first?',
  call: 'Placeholder: the hardest call. The rename is a candidate: FactChat for institutions becoming Baze for everyone at ₩5,900 a month.',
  result: 'From 28 universities in October 2025 to more than 100 a year later, and 600+ institutions in all. 750,000 people have used it. In September 2026 they ran about 48 times as many tokens as a year before, and every university that rolled it out campus-wide renewed.',
};

// sola's day: a real one (Fri 20 Nov 2026, from Slack), with names and two lines taken out.
export const SOLA_DAY = [
  { t: '07:46', who: 'sola · inbox', m: "Archived 44 promos, newsletters and notices. An old side project's database still lets anyone read it, and the alert came again. I can draft locked-down rules for you to review." },
  { t: '09:17', who: 'sola · morning', m: "Two friends fly home today. Nothing planned with you. Overdue: Wednesday's bookings block. Done, or move to Sat 09:30? Tomorrow 3pm: grandma's birthday lunch. Venue still TBD. Where should I put it on the calendar?" },
  { t: '20:43', who: 'sola · family', m: "Friday night, a quick call to your parents in Jeju would be nice. Even a short one counts. If they know about Grandma's birthday lunch tomorrow, it's an easy thing to bring up." },
];

// ── 한국어 (/ko/). The same facts, said in Korean. Names of roles and products stay as they are.
const EXPERIENCE_KO = [
  { ...EXPERIENCE[0], where: '서울', years: '2024–현재',
    did: '<a href="/ko/work/baze/" data-card="case" style="view-transition-name:baze-title">Baze</a> <span class="faint">(구 FactChat)</span>: UX, 제품 방향, 아키텍처, 프론트엔드. 대학 28곳이던 서비스를 100곳 이상, 사용자 75만 명까지 함께 키웠어요. PR 2,500개 이상.' },
  { ...EXPERIENCE[1], where: '뉴욕',
    did: 'MongoDB의 첫 재사용 AI 챗봇 UI 라이브러리를 설계부터 이끌었어요. Next.js 문서 사이트(Okta SSO, CMS 마이그레이션 두 번)의 아키텍처도 맡았어요.',
    line: 'MongoDB의 첫 재사용 AI 챗봇 UI 라이브러리(React)를 설계부터 이끌었어요.' },
  { ...EXPERIENCE[2], where: '시카고',
    did: '통신사와 교육 플랫폼 클라이언트 프로젝트에서 프론트엔드 아키텍트이자 리드 개발자로 일했어요. 개발자 여섯 명에게 React, TypeScript, Next.js를 멘토링했어요.',
    line: '클라이언트 프로젝트에서 프론트엔드 아키텍트이자 리드 개발자로 일하며 개발자 여섯 명을 멘토링했어요.' },
];
const EDUCATION_KO = '카네기멜런대학교에서 정보시스템과 HCI(인간-컴퓨터 상호작용)를 공부했어요(2019년 졸업). 재학 중에는 프로그래밍 수업 조교도 했어요.';
const BAZE_KO = {
  ...BAZE,
  aka: '구 FactChat',
  team: '제가 이끄는 작은 팀',
  timeline: '2025년 1월–현재',
  outcome: '사용자 75만 명 · 대학 100곳 이상',
  blurb: '계정 하나로 AI 모델 80여 개, 그리고 리서치·슬라이드·이미지·영상 에이전트까지 쓸 수 있는 서비스예요. 2025년 3월 대학용 FactChat으로 시작했고 2026년 10월 이름을 Baze로 바꾸면서 누구나 월 5,900원부터 쓸 수 있게 열었어요.',
  tldr: '작성 예정: 제품, 내 역할, 결과를 두 줄로.',
  bet: '작성 예정: 무엇에 걸었나. 왜 모든 모델을 계정 하나로, 그리고 왜 대학부터였나?',
  call: '작성 예정: 가장 어려웠던 결정. 유력한 후보는 기관용 FactChat을 누구나 월 5,900원에 쓰는 Baze로 바꾼 리브랜딩.',
  result: '2025년 10월 28곳이던 대학이 1년 만에 100곳을 넘었어요. 기관 전체로는 600곳이 넘어요. 지금까지 75만 명이 썼어요. 2026년 9월 토큰 사용량은 1년 전의 약 48배였고 캠퍼스 전체에 도입한 대학은 한 곳도 빠짐없이 재계약했어요.',
};
const SOLA_DAY_KO = [
  { t: '07:46', who: 'sola · 메일함', m: '프로모션, 뉴스레터, 공지 44통 보관했어요. 예전 사이드 프로젝트 DB가 아직 아무나 읽을 수 있게 열려 있다는 알림이 또 왔어요. 잠근 규칙을 초안으로 써 둘 테니 검토해 주세요.' },
  { t: '09:17', who: 'sola · 아침', m: '친구 둘이 오늘 귀국해요. 같이 잡힌 일정은 없어요. 밀린 일: 수요일 예약 블록. 끝났어요, 아니면 토요일 9시 30분으로 옮길까요? 내일 오후 3시 할머니 생신 점심, 장소는 아직 미정이에요. 캘린더에 어디로 적을까요?' },
  { t: '20:43', who: 'sola · 가족', m: '금요일 밤이니 제주 부모님께 잠깐 전화해 보면 좋겠어요. 짧아도 괜찮아요. 내일 할머니 생신 점심 얘기를 꺼내면 자연스러울 거예요.' },
];

/** Everything above that changes with the language. */
export const forLang = (lang: 'en' | 'ko') => lang === 'ko'
  ? { EXPERIENCE: EXPERIENCE_KO, EDUCATION: EDUCATION_KO, BAZE: BAZE_KO, SOLA_DAY: SOLA_DAY_KO }
  : { EXPERIENCE, EDUCATION, BAZE, SOLA_DAY };
/** Copy that's still to be written: shown faint. */
export const isPh = (s: string) => /^(Placeholder|\[|작성 예정)/.test(s);
