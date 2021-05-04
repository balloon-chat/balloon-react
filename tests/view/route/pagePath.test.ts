import { isInnerPath } from 'src/view/route/pagePath';

describe('内部のパスかを確認する', () => {
  test('ホスト名を指定して確認', () => {
    const hostName = 'localhost';

    const tests: { input: string, expected: boolean }[] = [
      {
        input: `https://${hostName}`,
        expected: true,
      },
      {
        input: `https://www.${hostName}`,
        expected: true,
      },
      {
        input: `http://${hostName}`,
        expected: true,
      },
      {
        input: `http://www.${hostName}`,
        expected: true,
      },
      {
        input: `https://${hostName}/foo/bar`,
        expected: true,
      },
      {
        input: 'https://google.com',
        expected: false,
      },
      {
        input: 'https://www.google.com',
        expected: false,
      },
      {
        input: '/',
        expected: true,
      },
      {
        input: '/foo/bar',
        expected: true,
      },
      {
        input: 'www.google.com',
        expected: false,
      },
      {
        input: 'www.google.com/foo/bar',
        expected: false,
      },
    ];

    tests.forEach((data) => {
      if (isInnerPath(data.input, hostName) !== data.expected) console.log(data);
      expect(isInnerPath(data.input, hostName)).toBe(data.expected);
    });
  });

  test('ホスト名を指定しないで確認', () => {
    const tests: { input: string, expected: boolean }[] = [
      {
        input: 'https://google.com',
        expected: false,
      },
      {
        input: 'https://www.google.com',
        expected: false,
      },
      {
        input: '/',
        expected: true,
      },
      {
        input: '/foo/bar',
        expected: true,
      },
      {
        input: 'www.google.com',
        expected: false,
      },
      {
        input: 'www.google.com/foo/bar',
        expected: false,
      },
    ];

    tests.forEach((data) => {
      expect(isInnerPath(data.input, null)).toBe(data.expected);
    });
  });
});
