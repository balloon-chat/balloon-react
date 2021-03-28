import { DiffUtilCallback } from 'src/view/lib/diffUtilCallback';
import { MessageEntity } from 'src/view/types/message';

export class MessageEntityDiffUtil extends DiffUtilCallback<MessageEntity> {
  // eslint-disable-next-line class-methods-use-this
  areItemsTheSame(oldItem: MessageEntity, newItem: MessageEntity): boolean {
    return oldItem.id === newItem.id;
  }
}
