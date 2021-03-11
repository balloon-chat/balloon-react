// tslint:disable-next-line:variable-name
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setTopicId } from 'src/data/redux/topic/slice';
import { Chat } from 'src/components/chat/Chat';
import { MessageField } from 'src/components/chat/MessageField';
import { setUserId } from 'src/data/redux/user/slice';
import { UserService } from 'src/domain/user/service/userService';
import { NavBarSmall } from 'src/components/navbar/NavBar';
import { useTopicState } from 'src/data/redux/topic/selector';
import { fetchTopic } from 'src/data/redux/topic/action';
import { topicStates } from 'src/data/redux/topic/state';
import { LoadTopicDialog } from 'src/components/topic/LoadTopicDialog';
import { TopicNotFound } from 'src/components/topic/TopicNotFound';
import Head from 'next/head';
import { topicPath } from 'src/pages/pagePath';

// tslint:disable-next-line:variable-name
const TopicPage = () => {
  const dispatcher = useDispatch();

  const router = useRouter();
  const { id } = router.query;
  const currentTopic = useTopicState().currentTopic;
  const state = useTopicState().state;
  const isLoading = !state && !currentTopic;
  const isTopicFound = state !== topicStates.NotFound;

  useEffect(() => {
    const service = new UserService();
    dispatcher(setUserId(service.getCurrentUserId().value));
  },        []);

  useEffect(() => {
    if (typeof id === 'string') {
      dispatcher(setTopicId({ topicId: id }));
      dispatcher(fetchTopic({ topicId: id }));
    } else if (id) {
      router.push(topicPath.index).then();
    }
  },        [id]);

  return (<div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyItems: 'stretch' }}>
    <NavBarSmall/>
    {currentTopic && (<>
          <Head>
            <title>{topicPath.title(currentTopic.title)}</title>
          </Head>
          <Chat/>
          <MessageField/>
        </>
    )}
    {isLoading && (<LoadTopicDialog/>)}
    {!isTopicFound && (<TopicNotFound/>)}
  </div>);
};

export default TopicPage;
