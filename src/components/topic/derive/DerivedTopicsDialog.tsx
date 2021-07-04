import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { closeDerivedTopicsDialog } from 'src/data/redux/chat/slice';
import { SwipeInDialog } from 'src/components/topic/dialog/SwipeInDialog';
import { useChatState } from 'src/data/redux/chat/selector';
import styled from 'styled-components';
import Link from 'next/link';
import { rootPath } from 'src/view/route/pagePath';

export const DerivedTopicsDialog = () => {
  const dispatcher = useDispatch();
  const { topic, dialog } = useChatState();

  const handleClose = useCallback(() => {
    dispatcher(closeDerivedTopicsDialog());
  }, []);

  return (
    <SwipeInDialog onClose={handleClose} isVisible={dialog.derivedTopicsDialog}>
      <Container>
        {
          topic && topic.derivedTopics.map((branch, i) => (
            <Link key={i} href={rootPath.topicPath.topicBranch(topic.id, i)}>
              <ItemContainer onClick={handleClose}>
                <DerivedTopicTitle>{branch.title}</DerivedTopicTitle>
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

const DerivedTopicTitle = styled.div`
  font-size: 20px;
  
  :before {
    content: '#';
    margin-right: 16px;
    font-weight: bold;
  }
`;