export const NavLocations = {
  HOME: 'HOME',
  CREATE_TOPIC: 'CREATE_TOPIC',
  FIND_TOPIC: 'FIND_TOPIC',
  PROFILE: 'PROFILE',
  LOGIN: 'LOGIN',
};

export type NavLocation = typeof NavLocations[keyof typeof NavLocations];
