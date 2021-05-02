import React from 'react';
import { InvitationCode } from 'src/domain/topic/models/invitationCode';
import styled from 'styled-components';

type Props = {
  code: number[]
}

export const InviteCode = ({ code }: Props) => (
  <Container>
    <Title>招待コード</Title>
    <Code>{new InvitationCode(code).formatCode}</Code>
  </Container>
);

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.div`
  color: rgba(0, 0, 0, .6);
`;

const Code = styled.div`
  font-size: 32px;
`;
