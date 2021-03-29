import React from 'react';
import styled from 'styled-components';
import { Button } from 'src/components/common/Button';
import { rootPath } from 'src/view/route/pagePath';

export const TopicNotFound = () => (
  <Container>
    <Title>話題が見つかりませんでした</Title>
    <a href={rootPath.index}>
      <Button>ホームに戻る</Button>
    </a>
  </Container>
);

const Container = styled.div`
  display: flex;
  padding: 32px;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  font-weight: bold;
`;
