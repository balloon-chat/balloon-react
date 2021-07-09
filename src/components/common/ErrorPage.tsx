/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import styled from 'styled-components';
import { Button } from 'src/components/common/Button';
import { rootPath } from 'src/view/route/pagePath';
import Link from 'next/link';

type Props = {
  message: string,
  detail?: string,
}

export const ErrorPage = ({ message, detail }: Props) => (
  <Container>
    <Title>{message}</Title>
    {detail && <Detail>{detail}</Detail>}
    <Link href={rootPath.index}>
      <a><Button>ホームに戻る</Button></a>
    </Link>
  </Container>
);

const Container = styled.div`
  display: flex;
  padding: 32px;
  height: 100%;
  flex-direction: column;
  align-items: center;

  & > button {
    margin-top: 16px;
  }
`;

const Title = styled.h2`
  font-weight: bold;
`;

const Detail = styled.div`
`;
