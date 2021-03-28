/**
 * 2つのリストを比較し、差分を検出する。
 */
export abstract class DiffUtilCallback<T> {
  /**
   * 同じ要素であるかを判定する
   */
  abstract areItemsTheSame(oldItem: T, newItem: T): boolean;

  run(oldList: T[], newList: T[]) {
    const added = newList.filter(
      (newE) => !oldList.some((oldE) => this.areItemsTheSame(oldE, newE)),
    );
    // eslint-disable-next-line max-len
    const deleted = oldList.filter(
      (oldE) => !newList.some((newE) => this.areItemsTheSame(oldE, newE)),
    );

    return {
      added,
      deleted,
    } as const;
  }
}
