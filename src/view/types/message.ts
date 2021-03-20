import { Message } from 'src/domain/message/models/message';
import { LoginUser } from 'src/domain/user/models/user';

export type MessageEntity = {
  id: string,
  body: string,
  createdAt: number,
  senderId: string,
  senderName: string,
  senderPhotoUrl: string,
};

export class MessageEntityFactory {
  static create(message: Message, defaultSenderName: string, defaultSenderPhotoUrl: string): MessageEntity {
    const sender = message.sender;
    let senderName = defaultSenderName;
    let senderPhotoUrl = defaultSenderPhotoUrl;

    if (sender instanceof LoginUser) {
      if (sender.name) senderName = sender.name.value;
      if (sender.photoUrl) senderPhotoUrl = sender.photoUrl;
    }

    return {
      id: message.id.value,
      body: message.body.value,
      createdAt: message.createdAt,
      senderId: message.sender.id.value,
      senderName,
      senderPhotoUrl,
    } as const;
  }
}
