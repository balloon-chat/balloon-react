import React, { useEffect } from 'react';
import { ChatForm } from 'src/components/topic/chat/ChatForm';
import { NavBar } from 'src/components/navbar/NavBar';
import { ErrorPage } from 'src/components/common/ErrorPage';
import Head from 'next/head';
import { pageTitle } from 'src/view/route/pagePath';
import { GetServerSideProps, GetServerSidePropsResult } from 'next';
import { TopicEntity, TopicEntityFactory } from 'src/view/types/topic';
import { TopicService } from 'src/domain/topic/service/topicService';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { useUserSelector } from 'src/data/redux/user/selector';
import { UserId } from 'src/domain/user/models/userId';
import { observeStart, resetMessages } from 'src/data/redux/message/slice';
import { setUser } from 'src/data/redux/user/slice';
import { LoginStates } from 'src/data/redux/user/state';
import { CharacterCanvas } from 'src/components/topic/chat/CharacterCanvas';
import { ZIndex } from 'src/components/constants/z_index';
import {
  closeMessageLog,
  observeTopic,
  resetChatState,
  setBranch,
  setInvitation,
  setInvitationCode,
  setTopic,
  updateIsEditable,
} from 'src/data/redux/chat/slice';
import { createInvitation } from 'src/view/lib/invitation';
import { useRouter } from 'next/router';
import { ChatNotifications } from 'src/components/topic/notification/ChatNotifications';
import { useChatState } from 'src/data/redux/chat/selector';
import { DeriveTopicDialog } from 'src/components/topic/dialog/DeriveTopicDialog';
import { BranchTopicsDialog } from 'src/components/topic/dialog/BranchTopicsDialog';
import { MessageLog } from 'src/components/topic/log/MessageLog';

type Props = {
  topic: TopicEntity | null,
  code: number[] | null,
};

const TopicPage = ({ topic, code }: Props) => {
  const router = useRouter();
  const dispatcher = useDispatch();
  const { uid, loginState } = useUserSelector();
  const { topicId, branchTopicId, dialog } = useChatState();

  useEffect(() => {
    dispatcher(setInvitationCode({ code }));
    dispatcher(setTopic({ topic }));

    if (topic) {
      dispatcher(observeTopic({ topicId: topic.id }));

      // 招待メッセージを作成
      const invitation = createInvitation({
        title: topic.title,
        currentPath: router.asPath,
        code,
      });
      dispatcher(setInvitation({ invitation }));
    }

    return () => {
      // reset current state
      dispatcher(setInvitationCode({ code: null }));
      dispatcher(setTopic({ topic: null }));
      dispatcher(setBranch({ index: null }));
      dispatcher(resetChatState());
    };
  }, []);

  useEffect(() => {
    if (!topicId) return () => {};

    dispatcher(observeStart({ topicId: branchTopicId ?? topicId }));
    return () => {
      dispatcher(resetMessages({}));
    };
  }, [topicId, branchTopicId]);

  useEffect(() => {
    let branchIndex: number|null;
    const paramBranchIndex = router.query.branch;
    if (typeof paramBranchIndex === 'string') {
      const value = parseInt(paramBranchIndex, 10);
      branchIndex = !Number.isNaN(value) ? value : null;
    } else {
      branchIndex = null;
    }

    dispatcher(setBranch({ index: branchIndex }));
  }, [router.query.branch]);

  useEffect(() => {
    dispatcher(updateIsEditable({ isEditable: uid === topic?.createdBy }));

    return () => {
      dispatcher(updateIsEditable({ isEditable: false }));
    };
  }, [uid]);

  useEffect(() => {
    // ユーザーが未ログイン時は、一時的なIDを付与する
    if (!uid && loginState !== LoginStates.LOGGED_IN) {
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

  return (
    <Wrapper>
      <NavBar />
      {
        dialog.deriveTopicDialog && <DeriveTopicDialog />
      }
      <BranchTopicsDialog />
      <MessageLog
        isVisible={dialog.messageLog}
        onClose={() => dispatcher(closeMessageLog())}
      />
      {topic && (
        <>
          <Head>
            <title>{pageTitle.topics.topic(topic.title)}</title>
          </Head>
          <ChatNotifications />
          <CharacterCanvas />
          <MessageFieldContainer>
            <ChatForm />
          </MessageFieldContainer>
        </>
      )}
      {!topic && <ErrorPage message="話題が見つかりませんでした" />}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-items: stretch;
  height: 100vh;
`;

const MessageFieldContainer = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: ${ZIndex.messageField};
`;

export const getServerSideProps: GetServerSideProps<Props> = async (
  context,
) => {
  const emptyResult: GetServerSidePropsResult<Props> = {
    props: {
      topic: null,
      code: null,
    },
  };
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
