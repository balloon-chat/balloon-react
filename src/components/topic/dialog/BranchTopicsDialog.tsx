import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { closeBranchTopicsDialog, showDeriveTopicDialog } from 'src/data/redux/chat/slice';
import { SwipeInDialog } from 'src/components/topic/dialog/SwipeInDialog';
import { useChatState } from 'src/data/redux/chat/selector';
import styled from 'styled-components';
import Link from 'next/link';
import Image from 'next/image';
import { rootPath } from 'src/view/route/pagePath';
import { imagePath } from 'src/components/constants/imagePath';
import { TextButton } from 'src/components/common/Button';

export const BranchTopicsDialog = () => {
  const dispatcher = useDispatch();
  const { topic, dialog } = useChatState();

  const handleClose = useCallback(() => {
    dispatcher(closeBranchTopicsDialog());
  }, []);

  const handleDeriveTopic = useCallback(() => {
    dispatcher(closeBranchTopicsDialog());
    dispatcher(showDeriveTopicDialog());
  }, []);

  return (
    <SwipeInDialog onClose={handleClose} isVisible={dialog.branchTopicDialog}>
      <Container>
        {
          // 派生した話題が無い場合
          !topic?.branchTopics.length && (
          <EmptyBranchTopicContainer>
            <Image src={imagePath.character.blue} width={130} height={130} objectFit="contain" />
            <EmptyBranchTopicMessage>この話題はまだ、これから盛り上がっていくようです。</EmptyBranchTopicMessage>
            <TextButton onClick={handleDeriveTopic}>話題を広げる</TextButton>
          </EmptyBranchTopicContainer>
          )
        }
        {
          // 話題が派生している場合
          topic?.branchTopics && topic?.branchTopics.length !== 0 && (
          <>
            <Link href={rootPath.topicPath.topic(topic.id)}>
              <ItemContainer onClick={handleClose}>
                <BranchTopicTitle>{topic.title}</BranchTopicTitle>
              </ItemContainer>
            </Link>
            {
              topic.branchTopics.map((branch, i) => (
                <Link key={i} href={rootPath.topicPath.topicBranch(topic.id, i)}>
                  <ItemContainer onClick={handleClose}>
                    <BranchTopicTitle>{branch.title}</BranchTopicTitle>
                  </ItemContainer>
                </Link>
              ))
            }
          </>
          )
        }
      </Container>
    </SwipeInDialog>
  );
};

const Container = styled.div`
  box-sizing: border-box;
  padding: 16px 0;
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

const BranchTopicTitle = styled.div`
  font-size: 20px;
  
  :before {
    content: '#';
    margin-right: 16px;
    font-weight: bold;
  }
`;

const EmptyBranchTopicContainer = styled.div`
  align-content: center;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 16px;
  width: 100%;
  height: 100%;
`;

const EmptyBranchTopicMessage = styled.div`
  text-align: center;
  margin-top: 16px;
`;
