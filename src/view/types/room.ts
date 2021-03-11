import { RoomData } from 'src/domain/room/usecases/types';

export type RoomEntity = {
  id: string,
  title: string,
  description?: string | null,
  createdAt: number,
  thumbnailUrl: string,
  commentCount: number,
  label?: {
    title: string,
    color: string,
  } | null,
};

export class RoomEntityFactory {
  static create(room: RoomData): RoomEntity {
    return {
      id: room.id.value,
      title: room.title.value,
      description: room.description?.value ?? null,
      createdAt: room.createdAt.valueOf(),
      thumbnailUrl: room.thumbnailUrl,
      commentCount: room.commentCount,
      label: null,
    };
  }
}
