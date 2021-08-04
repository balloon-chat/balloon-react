import React, { useState, useEffect } from 'react';
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
import { useChatNotification } from 'src/view/lib/useNotification';

type Props = {
  topic: TopicEntity | null,
  code: number[] | null,
};

const TopicPage = ({ topic, code }: Props) => {
  const router = useRouter();
  const dispatcher = useDispatch();
  const { uid, loginState } = useUserSelector();
  const { topicId, branchTopicId, dialog } = useChatState();
  const [flag, setFlag] = useState<boolean>(true);

  useChatNotification();

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
    if (!topicId) return () => { };

    dispatcher(observeStart({ topicId: branchTopicId ?? topicId }));
    return () => {
      dispatcher(resetMessages({}));
    };
  }, [topicId, branchTopicId]);

  useEffect(() => {
    let branchIndex: number | null;
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
    // デストラクタで、ログイン状況を見てユーザー情報をリセットすると、
    // 古い loginState を参照することになるので、正しくリセットできない。
    // リセットしなくても、別の話題に写ったときに、同じIDを使い回すことができ
    // ログイン後には上書きされるので、リセットは行わない。
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
            <Notification flag={flag}>
              <p>友達を招待しましょう!</p>
              <a href="https://www.google.com/">招待を開く</a>
              <CloseButton onClick={() => setFlag(false)} />
            </Notification>
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

// 新しく追加したもの
const Notification = styled.div<{ flag: boolean }>`
  position: absolute;
  right: 0;
  top: -100px;
  display: ${(props) => (props.flag ? 'flex' : 'none')};

  border: 1px solid black;
  border-radius: 10px;
  width: 400px;
  height: 50px;
  padding: 20px;
  flex-direction: column;
  p {
    margin: 0;
  }
  a {
    text-decoration: none;
    color: #289ac7;
  }

  a:hover {
    opacity: 0.3;
    transition: 0.2s;
  }
`;

// 新しく追加したもの
const CloseButton = styled.div`
  display: block;
  width: 25px;/*枠の大きさ*/
  height: 25px;/*枠の大きさ*/
  position: absolute;
  top: 2px;
  right: 2px;

  &::before, &::after {
    content: "";
    display: block;
    width: 100%;/*バツ線の長さ*/
    height: 2px;/*バツ線の太さ*/
    background: #289ac7;
    transform: rotate(45deg);
    transform-origin:0% 50%;
    position: absolute;
    top: calc(14% - 2px);
    left: 14%;
  }

  &::after {
    transform: rotate(-45deg);
    transform-origin:100% 50%;
    left: auto;
    right: 14%;
  }

  &:hover {
    opacity: 0.3;
    transition: 0.2s;
  }
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
