import { InvitationCode } from 'src/domain/topic/models/invitationCode';

test('招待コードのフォーマット', () => {
  const tests: {code: number[], expected: string}[] = [
    {
      code: [1, 2, 3, 4, 5, 6, 7, 8],
      expected: '1234-5678',
    },
    {
      code: [1, 2, 3],
      expected: '12-3',
    },
  ];

  tests.forEach((t) => {
    const invitationCode = new InvitationCode(t.code);
    expect(invitationCode.formatCode).toEqual(t.expected);
  });
});
