import { rootPath, topicPath } from 'src/view/route/pagePath';

export const NavLocations = {
  HOME: 'HOME',
  CREATE_TOPIC: 'CREATE_TOPIC',
  FIND_TOPIC: 'FIND_TOPIC',
  PROFILE: 'PROFILE',
  LOGIN: 'LOGIN',
};

type NavLocation = typeof NavLocations[keyof typeof NavLocations];

export const getCurrentLocation = (path: string, uid: string|null): NavLocation|null => {
  // クエリ部分を削除
  const simplePath = path.replace(/\?.*/g, '');
  switch (simplePath) {
    case rootPath.index:
      return NavLocations.HOME;
    case rootPath.login:
      return NavLocations.LOGIN;
    case rootPath.usersPath.user(uid || ''):
      return NavLocations.PROFILE;
    case topicPath.create:
      return NavLocations.CREATE_TOPIC;
    case topicPath.index:
      return NavLocations.FIND_TOPIC;
    default:
      return null;
  }
};
