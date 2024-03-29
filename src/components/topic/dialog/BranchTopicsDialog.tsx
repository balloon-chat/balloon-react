import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { closeBranchTopicsDialog, notify, showDeriveTopicDialog } from 'src/data/redux/chat/slice';
import { SwipeInDialog } from 'src/components/common/SwipeInDialog';
import { useChatState } from 'src/data/redux/chat/selector';
import styled from 'styled-components';
import Link from 'next/link';
import { rootPath } from 'src/view/route/pagePath';
import { imagePath } from 'src/components/constants/imagePath';
import { TextButton } from 'src/components/common/Button';
import { ChatNotificationTypes } from 'src/data/redux/chat/state';
import { DialogDescription, DialogTitle } from 'src/components/common/DialogHeader';
import { mediaQuery } from 'src/components/constants/mediaQuery';

export const BranchTopicsDialog = () => {
  const dispatcher = useDispatch();
  const { topic, dialog, branchTopicId, topicId } = useChatState();
  const [activeTopic, setActiveTopic] = useState<string|null>();

  const isDerived = topic?.branchTopics && topic?.branchTopics.length !== 0;

  const handleClose = useCallback(() => {
    dispatcher(closeBranchTopicsDialog());
  }, []);

  const handleNavigate = useCallback(() => {
    dispatcher(closeBranchTopicsDialog());
    dispatcher(notify({
      type: ChatNotificationTypes.SIMPLE_MESSAGE,
      title: '話題を移動しました',
      message: null,
      payload: {},
    }));
  }, []);

  const handleDeriveTopic = useCallback(() => {
    dispatcher(closeBranchTopicsDialog());
    dispatcher(showDeriveTopicDialog());
  }, []);

  useEffect(() => {
    setActiveTopic(branchTopicId ?? topicId);
  }, [topicId, branchTopicId]);

  return (
    <SwipeInDialog onClose={handleClose} isVisible={dialog.branchTopicDialog}>
      <Container>
        {
          // 話題が派生している場合
          topic && isDerived && (
          <>
            <DialogHeader>
              <DialogTitle>派生した話題</DialogTitle>
              <DialogDescription>この話題はこれだけの広がりを見せています。</DialogDescription>
            </DialogHeader>
            <Link href={rootPath.topicPath.topic(topic.id)} passHref>
              <ItemContainer onClick={handleClose}>
                <BranchTopicTitle active={activeTopic === topic.id}>
                  {topic.title}
                </BranchTopicTitle>
              </ItemContainer>
            </Link>
            {
              topic.branchTopics.map((branch, i) => (
                <Link key={i} href={rootPath.topicPath.topicBranch(topic.id, i)} passHref>
                  <ItemContainer onClick={handleNavigate}>
                    <BranchTopicTitle active={activeTopic === branch.id}>
                      {branch.title}
                    </BranchTopicTitle>
                  </ItemContainer>
                </Link>
              ))
            }
          </>
          )
        }
        {
          // 派生した話題が無い場合
          !isDerived && (
            <EmptyBranchTopicContainer>
              <CharacterImage src={imagePath.character.blue} />
              <EmptyBranchTopicMessage>この話題はこれから盛り上がっていくようです。</EmptyBranchTopicMessage>
              <TextButton onClick={handleDeriveTopic}>話題を広げる</TextButton>
            </EmptyBranchTopicContainer>
          )
        }
      </Container>
    </SwipeInDialog>
  );
};

const DialogHeader = styled.div`
  margin-top: 16px;
  margin-left: 16px;

  @media screen and (min-width: ${mediaQuery.tablet.portrait}px) {
    margin-top: 0;
  }
`;

const Container = styled.div`
  box-sizing: border-box;
  padding-bottom: 16px;
  height: 100%;
`;

const ItemContainer = styled.a`
  box-sizing: border-box;
  cursor: pointer;
  display: block;
  padding: 16px;
  width: 100%;
  
  :hover {
    background-color: #e9f2f9;
  }
`;

const BranchTopicTitle = styled.div<{active: boolean}>`
  font-size: 20px;
  
  :before {
    content: '#';
    font-size: 1.5rem;
    margin-right: 16px;
    font-weight: ${(props) => (props.active ? 'bolder' : 'bold')};
    color: ${(props) => (props.active ? '#5b87fa' : 'rgba(0,0,0,.6)')};
  }
`;

const EmptyBranchTopicContainer = styled.div`
  align-items: center;
  align-content: center;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 16px;
  width: 100%;
  height: 100%;
`;

const CharacterImage = styled.img`
  width: 130px;
  height: 130px;
  object-fit: contain;
`;

const EmptyBranchTopicMessage = styled.div`
  text-align: center;
  margin-top: 16px;
`;
