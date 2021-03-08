// tslint:disable-next-line:variable-name
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setRoomId } from 'src/data/redux/room/slice';
import { Chat } from 'src/components/chat/Chat';
import { MessageField } from 'src/components/chat/MessageField';
import { setUserId } from 'src/data/redux/user/slice';
import { UserService } from 'src/domain/user/service/userService';

// tslint:disable-next-line:variable-name
const RoomPage = () => {
  const dispatcher = useDispatch();

  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const service = new UserService();
    dispatcher(setUserId(service.getCurrentUserId().value));
  },        []);

  useEffect(() => {
    if (typeof id === 'string') {
      dispatcher(setRoomId({ roomId: id }));
    } else if (id) {
      router.push('/room').then();
    }
  },        [id]);

  return (<div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyItems: 'stretch' }}>
    <Chat/>
    <MessageField/>
  </div>);
};

export default RoomPage;
