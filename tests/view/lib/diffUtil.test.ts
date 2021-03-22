import { DiffUtilCallback } from 'src/view/lib/diffUtilCallback';

type TestObject = {
  id: number,
  value: string,
};

type TestCase = {
  input: {
    old: TestObject[],
    new: TestObject[],
  },
  expected: {
    added: TestObject[],
    deleted: TestObject[],
  },
};

class TestObjectDiffUtil extends DiffUtilCallback<TestObject> {
  areItemsTheSame(oldItem: TestObject, newItem: TestObject): boolean {
    return oldItem.id === newItem.id;
  }
}

const diffUtil = new TestObjectDiffUtil();

test('オブジェクトのリストから増分を検出', () => {
  const tests: TestCase[] = [
    {
      input: {
        old: [],
        new: [{ id: 0, value: 'apple' }],
      },
      expected: {
        added: [{ id: 0, value: 'apple' }],
        deleted: [],
      },
    },
    {
      input: {
        old: [
          { id: 0, value: 'apple' },
        ],
        new: [
          { id: 1, value: 'banana' },
          { id: 0, value: 'apple' },
        ],
      },
      expected: {
        added: [{ id: 1, value: 'banana' }],
        deleted: [],
      },
    },
    {
      input: {
        old: [{ id: 0, value: 'apple' }, { id: 1, value: 'banana' }],
        new: [{ id: 2, value: 'apple' }, { id: 3, value: 'apple' }],
      },
      expected: {
        added: [{ id: 2, value: 'apple' }, { id: 3, value: 'apple' }],
        deleted: [{ id: 0, value: 'apple' }, { id: 1, value: 'banana' }],
      },
    },
  ];
  tests.forEach((test) => {
    const { added, deleted } = diffUtil.run(test.input.old, test.input.new);
    expect(added).toStrictEqual(added);
    expect(deleted).toStrictEqual(deleted);
  });
});

test('オブジェクトのリストから減分を検出', () => {
  const tests: TestCase[] = [
    {
      input: {
        old: [{ id: 0, value: 'apple' }],
        new: [],
      },
      expected: {
        added: [],
        deleted: [{ id: 0, value: 'apple' }],
      },
    },
    {
      input: {
        old: [
          { id: 1, value: 'banana' },
          { id: 0, value: 'apple' },
        ],
        new: [
          { id: 0, value: 'apple' },
        ],
      },
      expected: {
        added: [{ id: 1, value: 'banana' }],
        deleted: [],
      },
    },
  ];

  tests.forEach((test) => {
    const { added, deleted } = diffUtil.run(test.input.old, test.input.new);
    expect(added).toStrictEqual(added);
    expect(deleted).toStrictEqual(deleted);
  });
});
