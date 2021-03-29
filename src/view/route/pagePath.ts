export const topicPath = {
  index: '/topics',
  create: '/topics/create',
  topic: (id: string) => `/topics/${id}`,
  title: (title: string) => `${title} | ふうせんちゃっと`,
};

export const usersPath = {
  user: (id: string) => `/users/${id}`,
};

export const rootPath = {
  index: '/',
  login: '/login',
  logout: '/logout',
  topicPath,
  usersPath,
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
