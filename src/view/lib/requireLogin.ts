import { AuthService } from 'src/domain/auth/service/AuthService';
import { rootPath } from 'src/view/route/pagePath';
import { GetServerSidePropsContext } from 'next';

/**
 * ログインが必要なページのSSR時に、リダイレクトに必要なデータを生成する。
 * もし、ログインしている場合は、nullを返す。
 */
export const requireLogin = async (context: GetServerSidePropsContext, currentPath: string) => {
  const service = new AuthService();
  const currentUrl = rootPath.fullPath(currentPath);

  try {
    const result = await service.getUserProfile(context.req.headers.cookie);
    if (result !== null) {
      return {
        redirect: {
          permanent: false,
          destination: `${rootPath.login}?return_to=${currentUrl}`,
        },
      };
    }
  } catch (e) {
    // NOT LOGGED IN
  }

  return null;
};
