export const settingsPath = {
  profile: '/settings/profile',
};

export const topicPath = {
  index: '/topics',
  create: '/topics/create',
  topic: (id: string) => `/topics/${id}`,
  topicBranch: (id: string, branch: number) => `/topics/${id}?branch=${branch}`,
  edit: (id: string) => `/topics/edit/${id}`,
};

export const usersPath = {
  user: (id: string) => `/users/${id}`,
};

export const rootPath = {
  fullPath: (path: string) => `${process.env.BASE_URL}${path[0] === '/' ? path : `/${path}`}`,
  index: '/',
  login: '/login',
  signIn: '/signin',
  logout: '/api/logout',
  settings: settingsPath,
  topicPath,
  usersPath,
};

const getPageTitle = (subTitle?: string) => {
  if (subTitle) {
    return `${subTitle} - おもちゃっと`;
  }
  return 'おもちゃっと';
};

export const pageTitle = {
  index: getPageTitle(),
  login: getPageTitle('ログイン'),
  signIn: getPageTitle('アカウントを作成'),
  logout: getPageTitle('ログアウト'),
  settings: {
    profile: getPageTitle('プロフィールの設定'),
  },
  topics: {
    index: getPageTitle('話題一覧'),
    create: getPageTitle('話題を作成'),
    edit: getPageTitle('話題を編集'),
    topic: (topicTitle: string) => getPageTitle(topicTitle),
  },
  users: {
    profile: (name: string) => getPageTitle(name),
  },
};

/**
 * リダイレクト先のパスが内部リンクかを確認する。
 * @param path 確認する対象となるパス
 * @param hostName ベースとなるURL(example.com, example.com:3000)
 * @return {boolean} 内部リンクの場合trueを返す
 */
export const isInnerPath = (path: string, hostName: string|null): boolean => {
  const pathRegex = new RegExp(/^\//);
  if (!hostName) return pathRegex.test(path);

  const protocolRegex = new RegExp(`^https?://.*.?${hostName}`);
  return protocolRegex.test(path) || pathRegex.test(path);
};
