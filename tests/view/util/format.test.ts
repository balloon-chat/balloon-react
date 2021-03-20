import { dateFormat } from 'src/view/util/format';

test('日付のフォーマット', () => {
  const tests: { input: Date, expected: string }[] = [
    {
      input: new Date(2000, 1 - 1, 1),
      expected: '2000/01/01',
    },
    {
      input: new Date(2000, 12 - 1, 25),
      expected: '2000/12/25',
    },
  ];

  tests.forEach((test) => {
    expect(dateFormat(test.input)).toBe(test.expected);
  });
});
