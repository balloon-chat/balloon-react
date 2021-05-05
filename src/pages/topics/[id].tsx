import React, { useEffect } from 'react';
import { MessageField } from 'src/components/chat/MessageField';
import { NavBar } from 'src/components/navbar/NavBar';
import { TopicNotFound } from 'src/components/topic/TopicNotFound';
import Head from 'next/head';
import { pageTitle } from 'src/view/route/pagePath';
import { GetServerSideProps } from 'next';
import { TopicEntity, TopicEntityFactory } from 'src/view/types/topic';
import { TopicService } from 'src/domain/topic/service/topicService';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { setCurrentTopic, setInvitationCode, setTopicId } from 'src/data/redux/topic/slice';
import { useUserSelector } from 'src/data/redux/user/selector';
import { UserId } from 'src/domain/user/models/userId';
import { observeStart } from 'src/data/redux/message/slice';
import { useTopicState } from 'src/data/redux/topic/selector';
import { setUser } from 'src/data/redux/user/slice';
import { LoginStates } from 'src/data/redux/user/state';
import { MessageList } from 'src/components/chat/MessageList';

type Props = {
  topic: TopicEntity | null,
  code: number[] | null,
};

const TopicPage = ({ topic, code }: Props) => {
  const dispatcher = useDispatch();
  const { uid, loginState } = useUserSelector();
  const { topicId } = useTopicState();

  useEffect(() => {
    dispatcher(setTopicId({ topicId: topic?.id ?? null }));
    dispatcher(setInvitationCode({ code }));
    dispatcher(setCurrentTopic({ topic }));

    return () => {
      // reset current state
      dispatcher(setTopicId({ topicId: null }));
      dispatcher(setInvitationCode({ code: null }));
      dispatcher(setCurrentTopic({ topic: null }));
    };
  }, [loginState]);

  useEffect(() => {
    // ユーザーが未ログイン時は、一時的なIDを付与する
    if (!uid && loginState === LoginStates.NOT_LOGGED_IN) {
      dispatcher(setUser({
        uid: new UserId().value,
        photoUrl: null,
        name: null,
      }));
    }

    return () => {
      // useEffectのデストラクタは、最後にuseEffectが呼ばれたときの変数の状態を参照するので、
      // loginStateを依存関係に指定した状態で呼び出さないと、適切に処理がされない。
      if (loginState === LoginStates.NOT_LOGGED_IN) {
        dispatcher(setUser({
          uid: null,
          photoUrl: null,
          name: null,
        }));
      }
    };
  }, [loginState]);

  useEffect(() => {
    if (topicId) dispatcher(observeStart({ topicId }));
  }, [topicId]);

  return (
    <Container>
      <NavBar />
      {topic && (
        <>
          <Head>
            <title>{pageTitle.topics.topic(topic.title)}</title>
          </Head>
          <MessageList />
          <MessageField />
        </>
      )}
      {!topic && <TopicNotFound />}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-items: stretch;
  height: 100%;
`;

export const getServerSideProps: GetServerSideProps<Props> = async (
  context,
) => {
  const emptyResult = { props: { topic: null, code: null } };
  const { id } = context.query;
  if (typeof id !== 'string') return emptyResult;

  const service = new TopicService();
  const topicData = await service.fetchTopic(id);
  if (!topicData) return emptyResult;

  const code = await service.fetchInvitationCode(id);

  const topic = TopicEntityFactory.create(topicData);
  return {
    props: {
      topic,
      code,
    },
  };
};

export default TopicPage;
