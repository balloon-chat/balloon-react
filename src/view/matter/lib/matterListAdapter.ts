import { ListAdapter } from 'src/view/lib/listAdapter';
import { MessageEntity } from 'src/view/types/message';
import { CharacterFactory } from 'src/view/matter/actors/character/characterFactory';
import { MatterController } from 'src/view/matter/controllers/matterController';
import { MessageEntityDiffUtil } from 'src/view/matter/lib/messageEntityDiffUtil';

export class MatterListAdapter extends ListAdapter<MessageEntity> {
  constructor(private readonly controller: MatterController) {
    super(new MessageEntityDiffUtil());
  }

  submit(list: MessageEntity[]) {
    new Promise(() => {
      // 日付を降順にソートし、最初の30個の要素だけ、取得する。
      // TODO: 画面サイズごとに要素数を変更する
      const sorted = list.slice().sort((a, b) => b.createdAt - a.createdAt);
      super.submit(sorted.slice(0, 30));
    }).then();
  }

  protected onAddItem(item: MessageEntity): void {
    const { p5 } = this.controller;
    if (!p5) return;
    const character = CharacterFactory.create(
      p5,
      this.controller.isMobile,
      this.controller.canvas,
      {
        id: item.id,
        message: item.body,
        senderId: item.senderId,
        sender: item.senderName,
      },
    );
    this.controller
      .character
      .add(this.controller.world, this.controller.canvas, character);
  }

  protected onDeleteItem(item: MessageEntity): void {
    const character = this.controller.character.findCharacterById(item.id);
    if (!character) return;
    this.controller
      .character
      .remove(this.controller.world, character);
  }
}
