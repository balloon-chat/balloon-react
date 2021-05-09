import { NextApiRequest, NextApiResponse } from 'next';
import { rootPath } from 'src/view/route/pagePath';
import { AuthService } from 'src/domain/auth/service/AuthService';

export default async function logout(_: NextApiRequest, res: NextApiResponse) {
  const service = new AuthService();
  await service.logout();
  res.writeHead(302, { Location: rootPath.index }).end();
}
