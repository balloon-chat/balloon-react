import { InvitationCode } from 'src/domain/topic/models/invitation/invitationCode';

export const createInvitation = ({ title, currentPath, code }: {
  title: string,
  currentPath: string,
  code: number[]|null
}) => {
  const url = `${process.env.BASE_URL}${currentPath}`;
  let invitation = 'あなたを『おもちゃっと』に招待します！\n';
  invitation += `話題: ${title}\n\n`;
  invitation += `話題に参加する\n${url}\n`;
  if (code) invitation += `\n招待コード: ${new InvitationCode(code).formatCode}`;
  return invitation;
};
