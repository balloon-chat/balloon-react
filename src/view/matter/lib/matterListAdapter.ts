import { ListAdapter } from 'src/view/lib/listAdapter';
import { MessageEntity } from 'src/view/types/message';
import { CharacterFactory } from 'src/view/matter/actors/character/characterFactory';
import { MessageEntityDiffUtil } from 'src/view/matter/lib/messageEntityDiffUtil';
import { mediaQuery } from 'src/components/constants/mediaQuery';
import { World } from 'src/view/matter/types/world';

export class MatterListAdapter extends ListAdapter<MessageEntity> {
  constructor(
    private readonly world: World,

    // 画面生成直後かを判別するためのパラメータ
    // private readonly createdAt: number = Date.now(),
  ) {
    super(new MessageEntityDiffUtil());
  }

  private get maxCharacterSize() {
    const { width } = this.world.canvas;
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
    const { p5 } = this.world;
    if (!p5) return;
    const character = CharacterFactory.create(
      p5,
      this.world.canvas.isMobile,
      this.world.canvas,
      {
        id: item.id,
        message: item.body,
        senderId: item.senderId,
        sender: item.senderName,
      },
    );
    this.world.addActor(p5, character);
  }

  protected onDeleteItem(item: MessageEntity): void {
    const character = this.world.findById(item.id);
    if (!character) return;
    this.world.removeActor(character);
  }
}
