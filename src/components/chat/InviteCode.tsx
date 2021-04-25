import React from 'react';
import styled from 'styled-components';

type Props = {
  code: string
}

export const InviteCode = ({ code }: Props) => (
  <Container>
    <Title>招待コード</Title>
    <Code>{code}</Code>
  </Container>
);

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: 16px 0;
`;

const Title = styled.div`
  color: rgba(0, 0, 0, .6);
`;

const Code = styled.div`
  font-size: 24px;
`;
