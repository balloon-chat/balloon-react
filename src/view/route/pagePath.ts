export const topicPath = {
  index: '/topics',
  create: '/topics/create',
  topic: (id: string) => `/topics/${id}`,
};

export const usersPath = {
  user: (id: string) => `/users/${id}`,
};

export const rootPath = {
  fullPath: (path: string) => `${process.env.BASE_URL}${path[0] === '/' ? path : `/${path}`}`,
  index: '/',
  login: '/login',
  signIn: '/signin',
  logout: '/logout',
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
  topics: {
    index: getPageTitle('話題一覧'),
    create: getPageTitle('話題を作成'),
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
export const isInnerPath = (path: string, hostName?: string): boolean => {
  const pathRegex = new RegExp(/^\//);
  if (!hostName) return pathRegex.test(path);

  const protocolRegex = new RegExp(`^https?://.*.?${hostName}`);
  return protocolRegex.test(path) || pathRegex.test(path);
};
