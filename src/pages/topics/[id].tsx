// tslint:disable-next-line:variable-name
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setRoomId } from 'src/data/redux/room/slice';
import { Chat } from 'src/components/chat/Chat';
import { MessageField } from 'src/components/chat/MessageField';
import { setUserId } from 'src/data/redux/user/slice';
import { UserService } from 'src/domain/user/service/userService';
import { NavBarSmall } from 'src/components/navbar/NavBar';
import { useRoomState } from 'src/data/redux/room/selector';
import { fetchRoom } from 'src/data/redux/room/action';
import { roomStates } from 'src/data/redux/room/state';
import { LoadTopicDialog } from 'src/components/topic/LoadTopicDialog';
import { TopicNotFound } from 'src/components/topic/TopicNotFound';
import Head from 'next/head';
import { topicPath } from 'src/pages/pagePath';

// tslint:disable-next-line:variable-name
const RoomPage = () => {
  const dispatcher = useDispatch();

  const router = useRouter();
  const { id } = router.query;
  const currentRoom = useRoomState().currentRoom;
  const state = useRoomState().state;
  const isLoading = !state && !currentRoom;
  const isRoomFound = state !== roomStates.NotFound;

  useEffect(() => {
    const service = new UserService();
    dispatcher(setUserId(service.getCurrentUserId().value));
  },        []);

  useEffect(() => {
    if (typeof id === 'string') {
      dispatcher(setRoomId({ roomId: id }));
      dispatcher(fetchRoom({ roomId: id }));
    } else if (id) {
      router.push('/room').then();
    }
  },        [id]);

  return (<div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyItems: 'stretch' }}>
    <NavBarSmall/>
    {currentRoom && (<>
          <Head>
            <title>{topicPath.title(currentRoom.title)}</title>
          </Head>
          <Chat/>
          <MessageField/>
        </>
    )}
    {isLoading && (<LoadTopicDialog/>)}
    {!isRoomFound && (<TopicNotFound/>)}
  </div>);
};

export default RoomPage;
