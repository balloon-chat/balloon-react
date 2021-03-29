import styled from 'styled-components';
import React from 'react';
import { Button } from 'src/components/topic/Button';
import { useRouter } from 'next/router';
import { rootPath } from 'src/view/route/pagePath';

type Props = {
  isCurrentUser: boolean
}

export const NoCreatedTopic = ({ isCurrentUser }: Props) => {
  const router = useRouter();

  const createTopic = async () => {
    await router.push(rootPath.topicPath.create);
  };

  return (
    <Container>
      <Title>作成された話題がありません</Title>
      {isCurrentUser && <Button onClick={createTopic}>話題を作成する</Button>}
    </Container>
  );
};

const Container = styled.div`
  align-items: center;
  border: 5px dashed rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  padding: 64px 0;
  
  & ${Button} {
    margin-top: 8px;
  }
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 20px;
  color: rgba(0, 0, 0, .6);
`;
