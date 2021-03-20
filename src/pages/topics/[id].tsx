// tslint:disable-next-line:variable-name
import React, { useEffect } from 'react';
import { MessageList } from 'src/components/chat/MessageList';
import { MessageField } from 'src/components/chat/MessageField';
import { UserService } from 'src/domain/user/service/userService';
import { NavBar } from 'src/components/navbar/NavBar';
import { TopicNotFound } from 'src/components/topic/TopicNotFound';
import Head from 'next/head';
import { topicPath } from 'src/pages/pagePath';
import { GetServerSideProps } from 'next';
import { TopicEntity, TopicEntityFactory } from 'src/view/types/topic';
import { TopicService } from 'src/domain/topic/service/topicService';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { setTopicId } from 'src/data/redux/topic/slice';
import { useUserSelector } from 'src/data/redux/user/selector';
import { UserId } from 'src/domain/user/models/userId';
import { setUserId } from 'src/data/redux/user/slice';

type Props = {
  topic: TopicEntity | null,
};

// tslint:disable-next-line:variable-name
const TopicPage = ({ topic }: Props) => {
  const dispatcher = useDispatch();
  const { isLoggedIn } = useUserSelector();

  useEffect(() => {
    dispatcher(setTopicId({ topicId: topic?.id ?? null }));

    // ユーザーが未ログイン時は、一時的なIDを付与する
    if (!isLoggedIn) dispatcher(setUserId(new UserId().value));

    return () => {
      dispatcher(setTopicId({ topicId: null }));
      if (!isLoggedIn) dispatcher(setUserId(null));
    };
  },        []);

  return (<Container>
    <NavBar/>
    {topic && (<>
          <Head>
            <title>{topicPath.title(topic.title)}</title>
          </Head>
          <MessageList/>
          <MessageField/>
        </>
    )}
    {!topic && (<TopicNotFound/>)}
  </Container>);
};

// tslint:disable-next-line:variable-name
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-items: stretch;
  height: 100%;
`;

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  new UserService().getCurrentUserId(); // TODO: remove this

  const { id } = context.query;
  if (typeof id !== 'string') return { props: { topic: null } };

  const service = new TopicService();
  const data = await service.fetchTopic(id);
  if (!data) return { props: { topic: null } };

  const topic = TopicEntityFactory.create(data);
  return {
    props: {
      topic,
    },
  };
};

export default TopicPage;
