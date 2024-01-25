export const BASE_URL = '/api' as const;

export const MOCK_SERVER_URL = 'http://localhost:3001' as const;

export const ROOT_URL = 'http://localhost:5173/';

export const ACCESS_TOKEN_KEY = 'refrigeKey' as const; // TODO: 임시 로컬스토리지 key 임으로 추후 합의 후 변경 필요

export const USER_STATUS_KEY = 'userState' as const;

export const USER_NICKNAME_KEY = 'nickName';

export const END_POINTS = {
  MEMBERS: 'members',
  RECIPES: 'recipes',
  TOKEN: 'token/refresh',
  JOIN: 'auth/email/join',
  LOGIN: 'auth/email/login',
  CONFIRM: 'auth/email/confirm',
  OAUTH: 'auth/oauth?provider=',
  REISSUE: 'auth/token/reissue',
  LEAVE: 'auth/leave',
  LOGOUT: 'auth/logout',
  MEMBER_INFO: 'members/info',
  NICKNAME: 'members/info/nickname',
  PASSWORD: 'members/info/password',
  MEMBER_COOK: 'members/cooks',
  MEMBER_RECIPE: 'members/recipes',
  BOOKMARK: 'members/bookmarks',
  NOTIFICATION: 'notifications',
  FRIDGE: 'fridge',
  INGREDIENT: 'fridge/ingredients',
  REVIEWS: 'reviews',
  REPORTS: 'reports',
  COOKS: 'cooks',
  SUGGEST: '/search/ingredient?keyword=',
  KEYWORD_SEARCH: '/search/recipe/keyword?keyword=',
  FRIGE_SEARCH: '/search/recipe/fridge',
  SUBSCRIBE: 'notifications/subscribe',
} as const;

export const HTTP_STATUS_CODE = {} as const;

export const ERROR_CODE = {} as const;

export const HTTP_ERROR_MESSAGE = {} as const;
