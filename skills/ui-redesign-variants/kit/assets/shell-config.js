// The real shell, reproduced control for control. Read the app's layout/nav code first.
window.SHELL = {
  app: 'App name',
  logo: '◆',
  current: 'home',
  user: { name: '김민지', email: 'minji@example.com', role: 'admin' },
  nav: [
    { id: 'home', label: '홈', href: 'pages/home/a-example.html', icon: '⌂', roles: ['admin', 'member'] },
  ],
  controls: ['collapse', 'theme', 'fontSize', 'password', 'logout'],
};
