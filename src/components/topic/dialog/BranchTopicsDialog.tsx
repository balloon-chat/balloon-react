import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { closeBranchTopicsDialog } from 'src/data/redux/chat/slice';
import { SwipeInDialog } from 'src/components/topic/dialog/SwipeInDialog';
import { useChatState } from 'src/data/redux/chat/selector';
import styled from 'styled-components';
import Link from 'next/link';
import { rootPath } from 'src/view/route/pagePath';

export const BranchTopicsDialog = () => {
  const dispatcher = useDispatch();
  const { topic, dialog } = useChatState();

  const handleClose = useCallback(() => {
    dispatcher(closeBranchTopicsDialog());
  }, []);

  return (
    <SwipeInDialog onClose={handleClose} isVisible={dialog.branchTopicDialog}>
      <Container>
        {
          topic && topic.branchTopics.map((branch, i) => (
            <Link key={i} href={rootPath.topicPath.topicBranch(topic.id, i)}>
              <ItemContainer onClick={handleClose}>
                <BranchTopicTitle>{branch.title}</BranchTopicTitle>
              </ItemContainer>
            </Link>
          ))
        }
      </Container>
    </SwipeInDialog>
  );
};

const Container = styled.div`
  padding: 16px 0;
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
