export const topicPath = {
  index: '/topics',
  create: '/topics/create',
  topic: (id: string) => `/topics/${id}`,
  title: (title: string) => `${title} | ふうせんちゃっと`,
};

export const rootPath = {
  index: '/',
  login: '/login',
  logout: '/logout',
  topicPath,
};

/**
 * リダイレクト先のパスが内部リンクかを確認する。
 * @param path 確認する対象となるパス
 * @param hostName ベースとなるURL(example.com, example.com:3000)
 * @return {boolean} 内部リンクの場合trueを返す
 */
export const isOuterPath = (path: string): boolean => {
  const httpProtocolRegex = new RegExp(/^https*:+/).compile();
  return httpProtocolRegex.test(path);
};
