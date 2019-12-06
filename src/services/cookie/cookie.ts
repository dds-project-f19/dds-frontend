import { Role } from 'shared/types/models';

export default class CookieParser {
  /**
   * https://learn.javascript.ru/cookie#getcookie-name
   * @param key Cookie name
   */
  private static getCookie(key: string) {
    let matches = document.cookie.match(new RegExp(
        // eslint-disable-next-line
        '(?:^|; )' + key.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') +
        '=([^;]*)'));
    return matches ? decodeURIComponent(matches[1]) : undefined;
  }

  public static getRole(): Role {
    const role = CookieParser.getCookie('dds-auth-claim');

    switch (role) {
    case 'worker':
    case 'manager':
    case 'admin': {
      return role;
    }
    default: { return 'unknown'; }
    }
  }

  public static getWorkspace(): string {
    return CookieParser.getCookie('dds-auth-gametype') || '';
  }
}
