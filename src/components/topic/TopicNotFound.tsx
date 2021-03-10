import React from 'react';
import styled from 'styled-components';
import { Button } from 'src/components/topic/Button';
import { rootPath } from 'src/pages/pagePath';

// tslint:disable-next-line:variable-name
export const TopicNotFound = () => {
  return(<Container>
    <Title>話題が見つかりませんでした</Title>
    <a href={rootPath.index}><Button>ホームに戻る</Button></a>
  </Container>);
};

// tslint:disable-next-line:variable-name
const Container = styled.div`
  display: flex;
  padding: 32px;
  flex-direction: column;
  align-items: center;
`;

// tslint:disable-next-line:variable-name
const Title = styled.h1`
  font-weight: bold;
`;
