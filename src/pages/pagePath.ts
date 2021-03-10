export const topicPath = {
  index: '/topics',
  create: '/topics/create',
  topic: (id: string) => `/topics/${id}`,
  title: (title: string) => `${title} | ふうせんちゃっと`,
};

export const rootPath = {
  index: '/',
};
