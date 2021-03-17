export const topicPath = {
  index: '/topics',
  create: '/topics/create',
  topic: (id: string) => `/topics/${id}`,
  title: (title: string) => `${title} | ふうせんちゃっと`,
};

export const rootPath = {
  index: '/',
  login: '/login',
  topicPath,
};

/**
 * リダイレクト先のパスが外部リンクかを確認する。
 */
export const isOuterPath = (path: string): boolean => {
  const httpProtocolRegex = new RegExp(/^https*:+/).compile();
  return httpProtocolRegex.test(path);
};
