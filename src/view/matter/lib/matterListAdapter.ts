import { ListAdapter } from 'src/view/lib/listAdapter';
import { MessageEntity } from 'src/view/types/message';
import { CharacterFactory } from 'src/view/matter/actors/characterFactory';
import { MatterController } from 'src/view/matter/controllers/matterController';
import { MessageEntityDiffUtil } from 'src/view/matter/lib/messageEntityDiffUtil';

export class MatterListAdapter extends ListAdapter<MessageEntity> {
  constructor(private readonly controller: MatterController) {
    super(new MessageEntityDiffUtil());
  }

  protected onAddItem(item: MessageEntity): void {
    const { p5 } = this.controller;
    if (!p5) return;
    const character = CharacterFactory.create(
      p5,
      this.controller.canvas,
      {
        id: item.id,
        message: item.body,
        senderId: item.senderId,
      },
    );
    this.controller.addCharacter(character);
  }

  protected onDeleteItem(item: MessageEntity): void {
    const character = this.controller.characterController.getCharacter(item.id);
    if (!character) return;
    this.controller.removeCharacter(character);
  }
}
