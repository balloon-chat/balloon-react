import { DiffUtilCallback } from 'src/view/lib/diffUtilCallback';

/**
 * データの差分検出を行い、コールバックにより実装クラスに通知する。
 */
export abstract class ListAdapter<T> {
  private previousList: T[] = [];

  // eslint-disable-next-line no-empty-function
  protected constructor(private readonly diffUtil: DiffUtilCallback<T>) {}

  /**
   * データを更新
   * @param list 更新する新しいデータ
   */
  submit(list: T[]) {
    const { added, deleted } = this.diffUtil.run(this.previousList, list);
    added.forEach((e) => this.onAddItem(e));
    if (added.length) console.info('Item Added:', added);

    deleted.forEach((e) => this.onDeleteItem(e));
    if (added.length) console.info('Item Deleted:', deleted);

    this.previousList = list;
  }

  protected abstract onAddItem(item: T): void;

  protected abstract onDeleteItem(item: T): void;
}
