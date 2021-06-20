import { ListAdapter } from 'src/view/lib/listAdapter';
import { MessageEntity } from 'src/view/types/message';
import { CharacterFactory } from 'src/view/matter/actors/character/characterFactory';
import { MatterController } from 'src/view/matter/controllers/matterController';
import { MessageEntityDiffUtil } from 'src/view/matter/lib/messageEntityDiffUtil';
import { mediaQuery } from 'src/components/constants/mediaQuery';

export class MatterListAdapter extends ListAdapter<MessageEntity> {
  constructor(private readonly controller: MatterController) {
    super(new MessageEntityDiffUtil());
  }

  private get maxCharacterSize() {
    const { width } = this.controller.canvas;
    if (width < mediaQuery.mobile.landscape) {
      return 5;
    } if (width < mediaQuery.tablet.portrait) {
      return 20;
    }
    return 30;
  }

  submit(list: MessageEntity[]) {
    if (list.length > this.maxCharacterSize) {
      const sortByDate = list.slice().sort((a, b) => b.createdAt - a.createdAt);

      // 古いものから削除していく
      const keepMessages = sortByDate.slice(
        0,
        this.maxCharacterSize,
      );
      super.submit(keepMessages);
    } else {
      super.submit(list);
    }
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
