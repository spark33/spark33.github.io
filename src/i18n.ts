// Two languages: English at the root, Korean under /ko/. Every page exists in both, with the same
// structure, so the 한/EN switch in the rail lands on the same page and the same spot.
// Words the pages and scripts share live here; what the site says about Sean lives in data/site.ts.
// Plain TS (no astro: imports), so the browser scripts can use it too.

export type Lang = 'en' | 'ko';
export const LANGS: Lang[] = ['en', 'ko'];
export const other = (l: Lang): Lang => (l === 'ko' ? 'en' : 'ko');
/** Which language a path is in. */
export const langOf = (path: string): Lang => (/^\/ko(\/|$)/.test(path) ? 'ko' : 'en');
/** The path without its language prefix: /ko/work/baze/ → /work/baze/ */
export const strip = (path: string) => path.replace(/^\/ko(?=\/|$)/, '') || '/';
/** A site path in a language: ('/work/baze/', 'ko') → /ko/work/baze/ ; ('/#writing', 'ko') → /ko/#writing */
export const loc = (path: string, l: Lang) => (l === 'ko' ? '/ko' + path : path);
/** The same page in the other language. */
export const counterpart = (path: string) => loc(strip(path), other(langOf(path)));

const ext = (label: string, href: string) => `<a href="${href}" target="_blank" rel="noopener">${label} ↗</a>`;

export const UI = {
  en: {
    locale: 'en-US', ogLocale: 'en_US', name: 'Sean Park',
    title: 'Sean Park · Product lead at Mindlogic, Seoul',
    h1: 'Sean Park, product lead at Mindlogic in Seoul',
    intro: (ml: string) => `Product lead at ${ml}, Seoul.`,
    mindlogic: 'Mindlogic',
    toTop: 'Back to the top', theme: 'Switch theme', langNav: 'Language',
    switchTo: 'Read in English', // feedforward on the EN link (shown on Korean pages)
    built: (d: string) => `Built by hand in Seoul. Last updated ${d}.`,
    // home
    hi: '{greet} I lead product at {ml} in Seoul, where it\'s {now}.',
    // Greeting POC: the first sentence follows where the visit came from (Base.astro). {name} is from ?for=.
    greet: { default: "Hi, I'm Sean.", for: "Hi, {name} team. I'm Sean.", linkedin: "Hi, and welcome over from LinkedIn. I'm Sean.",
      hiring: "Hi, thanks for reading past the résumé. I'm Sean.", github: "Hi, and welcome over from GitHub. I'm Sean." },
    more1: 'I work on {baze}: one account for 80+ AI models, used at more than 100 universities. I own the UX and the direction, and still write a lot of the frontend.',
    more2: (a: string, b: string, c: string) => `I write about what I keep noticing. ${a}Start there</a>, see ${b}where I've worked</a>, or ${c}grab my email</button>.`,
    writing: ['Writing', 'What I keep noticing about building AI products. Six drafts so far.'],
    worked: ['Where I\'ve worked', 'Newest first: Seoul, New York, Chicago.'],
    th: ['Company', 'Role', 'What I did', 'Years'],
    now: ['What I\'m working on now', 'Baze. The case study has the bet, the call and the result.'],
    caseStudy: 'Case study',
    about: ['About', 'How I work, and the rest of me.'],
    aboutPh: 'Placeholder: how I work, in my own words.',
    songs: 'I also write songs.',
    // case study
    back: '← Back', backFF: 'Back to where you were',
    caseTitle: 'Baze (formerly FactChat): case study · Sean Park',
    formerly: 'Formerly FactChat.',
    dl: ['Role', 'Team', 'Timeline', 'Stack', 'Outcome', 'Links'],
    bet: 'The bet', call: 'The call', result: 'The result',
    moreIn: (links: string) => `More in ${links}.`, and: ' and ',
    figcap: 'The rename, performed: FactChat becomes Baze.',
    // real screens, from baze.co (public/work/baze/)
    shot: {
      picker: ['One account, every major model: the model picker in Baze.', 'Baze’s model picker: Super Agent at the top, then every model grouped by provider: OpenAI, Claude, Gemini, Grok, Perplexity, DeepSeek and more.'],
      agent: ['Super Agent: one request instead of four. It searches, makes the video and the deck, and picks the model for each step.'],
      oneRequest: 'Four separate requests (search, image, compare, PPT) beside one request that runs them all, for fewer credits.',
      oneAsk: 'One request, a trip to Sydney as a short video and a slide deck, fans out to web search, video and PPT, all done.',
      decks: ['Sample decks from the presentation agent, each from one conversation.', 'A row of slide decks in different styles: a travel budget, Field Notes, Space Form Light, Common Objects, a portfolio.'],
    },
    photo: 'A photo of me, coming soon',
    sources: 'Figures from Mindlogic\'s public releases, October 2026.',
    next: 'Next', theWriting: 'The writing',
    // posts
    backW: '← Writing', backWFF: 'Back to the writing',
    piece: (n: number, of: number, m: number) => `Piece ${n} of ${of} · ${m} min read`,
    mins: (m: number) => `${m} min read`, updated: (d: string) => `updated ${d}`,
    by: 'By', tried: 'Where I tried this:',
    disagree: (a: string) => `Disagree, or tried something like it? ${a}Write to me</a>. I read everything.`,
    re: 'Re: ', copyLink: 'Copy link', copyLinkFF: 'Copy a link to this piece', rssFF: 'The RSS feed, for new pieces',
    keep: ['Keep reading', 'The other pieces, starting with the next one.'],
    readDraft: 'Read the draft',
    // 404
    nf: 'Nothing here tonight.', nfBack: 'Back to the work',
  },
  ko: {
    locale: 'ko-KR', ogLocale: 'ko_KR', name: '박상현',
    title: '박상현 · 서울 마인드로직 프로덕트 리드',
    h1: '박상현, 서울 마인드로직의 프로덕트 리드',
    intro: (ml: string) => `서울 ${ml}의 프로덕트 리드.`,
    mindlogic: '마인드로직',
    toTop: '맨 위로', theme: '테마 바꾸기', langNav: '언어',
    switchTo: '한국어로 보기', // feedforward on the 한 link (shown on English pages)
    built: (d: string) => `서울에서 손수 만들었어요. 마지막 수정 ${d}.`,
    hi: '{greet} 서울 {ml}에서 프로덕트 리드로 일해요. 여기는 지금 {now}예요.',
    greet: { default: '안녕하세요, 박상현이에요.', for: '{name} 팀 여러분, 안녕하세요. 박상현이에요.', linkedin: '안녕하세요, 링크드인 보고 오셨군요. 박상현이에요.',
      hiring: '이력서만 보지 않고 여기까지 와 주셔서 고마워요. 박상현이에요.', github: '안녕하세요, 깃허브 보고 오셨군요. 박상현이에요.' },
    more1: '{baze}를 만들어요. 계정 하나로 AI 모델 80여 개를 쓰는 서비스인데 100곳 넘는 대학에서 써요. UX와 제품 방향을 맡고 있고 프론트엔드 코드도 아직 많이 직접 짜요.',
    more2: (a: string, b: string, c: string) => `일하면서 자꾸 눈에 걸리는 걸 글로 남겨요. ${a}글부터</a> 읽으셔도 되고 ${b}일해 온 곳</a>을 먼저 보셔도 돼요. ${c}이메일 주소</button>도 바로 복사할 수 있어요.`,
    writing: ['글', 'AI 제품을 만들면서 눈에 걸린 것들. 아직은 초고 여섯 편.'],
    worked: ['일해 온 곳', '최근 순. 서울, 뉴욕, 시카고.'],
    th: ['회사', '역할', '한 일', '기간'],
    now: ['지금 하는 일', 'Baze. 어디에 걸었고 무엇을 결정했고 결과가 어땠는지는 케이스 스터디에 있어요.'],
    caseStudy: '케이스 스터디',
    about: ['소개', '일하는 방식, 그리고 일 말고 다른 이야기.'],
    aboutPh: '작성 예정: 제가 어떻게 일하는지, 직접 쓴 글로.',
    songs: '노래도 만들어요.',
    back: '← 돌아가기', backFF: '보던 곳으로',
    caseTitle: 'Baze (구 FactChat): 케이스 스터디 · 박상현',
    formerly: '구 FactChat.',
    dl: ['역할', '팀', '기간', '스택', '성과', '링크'],
    bet: '무엇에 걸었나', call: '가장 어려웠던 결정', result: '결과',
    moreIn: (links: string) => `관련 글: ${links}.`, and: ', ',
    figcap: 'FactChat이 Baze로 바뀌는 과정을 다시 그려 봤어요.',
    shot: {
      picker: ['계정 하나에 주요 모델이 다 있어요. Baze의 모델 선택 메뉴예요.', 'Baze 모델 선택 메뉴. 맨 위에 Super Agent가 있고, 그 아래로 OpenAI, Claude, Gemini, Grok, Perplexity, DeepSeek 등 회사별 모델이 모여 있어요.'],
      agent: ['Super Agent는 요청 네 번을 한 번으로 줄여요. 검색하고 영상과 PPT를 만들면서 단계마다 맞는 모델을 알아서 골라요.'],
      oneRequest: '검색, 이미지, 비교, PPT를 네 번 따로 요청할 때와 한 번에 요청할 때를 나란히 놓은 화면. 한 번에 하면 크레딧도 덜 들어요.',
      oneAsk: '요청 하나가 웹 검색, 영상, PPT로 나뉘어 모두 끝난 화면.',
      decks: ['프레젠테이션 에이전트 샘플이에요. 모두 대화 한 번으로 만든 슬라이드예요.', '여러 스타일의 슬라이드: 여행 예산, Field Notes, Space Form Light, Common Objects, 포트폴리오.'],
    },
    photo: '사진은 곧 올릴게요',
    sources: '수치는 2026년 10월 마인드로직 공개 자료 기준이에요.',
    next: '다음', theWriting: '글',
    backW: '← 글', backWFF: '글 목록으로',
    piece: (n: number, of: number, m: number) => `${of}편 중 ${n}번째 · 읽는 데 ${m}분`,
    mins: (m: number) => `읽는 데 ${m}분`, updated: (d: string) => `${d} 수정`,
    by: '글쓴이', tried: '직접 적용해 본 곳:',
    disagree: (a: string) => `생각이 다르거나 비슷한 걸 해 보셨다면 ${a}메일 주세요</a>. 하나도 빠짐없이 읽어요.`,
    re: 'Re: ', copyLink: '링크 복사', copyLinkFF: '이 글의 링크 복사', rssFF: '새 글을 받아 보는 RSS 피드',
    keep: ['이어서 읽기', '다음 편부터 차례로.'],
    readDraft: '초고 읽기',
    nf: '오늘 밤 여기엔 아무것도 없네요.', nfBack: '처음으로',
  },
};

// What the browser scripts say: the rail, the footer, hover cards, copy buttons, living titles.
export const CLIENT = {
  en: {
    locale: 'en-US',
    phases: ['new moon', 'waxing crescent', 'first quarter', 'waxing gibbous', 'full moon', 'waning gibbous', 'last quarter', 'waning crescent'],
    read: (n: number) => `${n}% read`, finished: 'Finished',
    clock: (s: string, ny: string) => `Seoul ${s} · New York ${ny}`,
    copied: 'Copied', pressC: 'Press ⌘C', copy: 'Copy', copyCode: 'Copy the code',
    copySection: 'Copy a link to this section', copySectionAria: (t: string) => `Copy a link to “${t}”`,
    themeTo: (dark: boolean) => `Switch to ${dark ? 'dark' : 'light'} mode`,
    copyX: (x: string) => `Copy ${x}`,
    newTab: (host: string) => `${host} ↗ opens in a new tab`,
    jump: 'Jump to this section',
    guess: ['summarize?', 'translate?', 'rewrite?', 'explain?', '…anything?'],
    sola: (h: number, m: number) => `sola · 09:17 · next one in ${h}h ${m}m`,
    hasMany: 'has many',
    card: {
      talking: 'talking to',
      baze: (D: any) => `<p><b>Baze</b>, formerly FactChat. One account for 80+ AI models (GPT, Claude, Gemini, Grok, DeepSeek, Sora, Kling) plus agents for research, slides, images and video. Built for universities, open to everyone since October 2026 from ₩5,900 a month.</p>
      <p class="acts">${ext('baze.co', D.links.baze)}<a href="${D.base}/work/baze/">The case study →</a></p>`,
      caseText: '<p><b>The Baze case study.</b> The bet, the hardest call, and the result.</p>',
      chatQ: 'Can you explain this?',
      mindlogic: (D: any) => `<p><b>Mindlogic</b>. An AI company in Seoul, founded in 2019. It makes Baze, used by 100+ universities and 750K people, and Informe, an AI agent for customer service. I lead product there.</p>
      <p class="acts">${ext('mindlogic.ai', D.links.mindlogic)}</p>`,
      email: (D: any) => `<p><b>${D.email}</b></p><p>Email me, or copy the address.</p><p class="acts"><a href="mailto:${D.email}">Write an email</a><button data-copy="${D.email}">Copy address</button></p>`,
      writing: (n: number) => `<p><b>Writing.</b> ${n} pieces, all drafts for now.</p>`,
      work: '<p><b>Where I\'ve worked.</b> Newest first.</p>',
    },
  },
  ko: {
    locale: 'ko-KR',
    phases: ['삭', '초승달', '상현달', '차오르는 달', '보름달', '기우는 달', '하현달', '그믐달'],
    read: (n: number) => `${n}% 읽음`, finished: '다 읽음',
    clock: (s: string, ny: string) => `서울 ${s} · 뉴욕 ${ny}`,
    copied: '복사됨', pressC: '⌘C를 누르세요', copy: '복사', copyCode: '코드 복사',
    copySection: '이 섹션의 링크 복사', copySectionAria: (t: string) => `“${t}” 섹션의 링크 복사`,
    themeTo: (dark: boolean) => `${dark ? '다크' : '라이트'} 모드로 바꾸기`,
    copyX: (x: string) => `${x} 복사`,
    newTab: (host: string) => `${host} ↗ 새 탭에서 열려요`,
    jump: '이 섹션으로 이동',
    guess: ['요약?', '번역?', '다듬기?', '설명?', '…뭐든지?'],
    sola: (h: number, m: number) => `sola · 09:17 · 다음 메시지까지 ${h}시간 ${m}분`,
    hasMany: '1 : N',
    card: {
      talking: '지금 모델',
      baze: (D: any) => `<p><b>Baze</b>(구 FactChat). 계정 하나로 AI 모델 80여 개(GPT, Claude, Gemini, Grok, DeepSeek, Sora, Kling)와 리서치·슬라이드·이미지·영상 에이전트를 써요. 처음엔 대학용으로 만들었는데 2026년 10월부터는 누구나 월 5,900원에 쓸 수 있어요.</p>
      <p class="acts">${ext('baze.co', D.links.baze)}<a href="${D.base}/work/baze/">케이스 스터디 →</a></p>`,
      caseText: '<p><b>Baze 케이스 스터디.</b> 무엇에 걸었는지, 가장 어려웠던 결정, 그리고 결과.</p>',
      chatQ: '이거 설명해 줄래?',
      mindlogic: (D: any) => `<p><b>마인드로직</b>. 2019년 서울에서 시작한 AI 회사예요. 대학 100곳 이상에서 75만 명이 쓰는 Baze, 그리고 고객 상담 AI 에이전트 Informe를 만들어요. 저는 여기서 프로덕트 리드로 일해요.</p>
      <p class="acts">${ext('mindlogic.ai', D.links.mindlogic)}</p>`,
      email: (D: any) => `<p><b>${D.email}</b></p><p>메일을 바로 쓰거나 주소를 복사해 가세요.</p><p class="acts"><a href="mailto:${D.email}">메일 쓰기</a><button data-copy="${D.email}">주소 복사</button></p>`,
      writing: (n: number) => `<p><b>글.</b> 모두 ${n}편, 아직은 전부 초고예요.</p>`,
      work: '<p><b>일해 온 곳.</b> 최근 순으로.</p>',
    },
  },
};
export const client = (): typeof CLIENT.en => CLIENT[document.documentElement.lang === 'ko' ? 'ko' : 'en'];
