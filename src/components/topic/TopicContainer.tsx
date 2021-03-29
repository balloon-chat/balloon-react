import styled from 'styled-components';
import { mediaQuery } from 'src/components/constants/mediaQuery';
import React from 'react';

type Props = {
  color?: string
}

export const TopicContainer: React.FC<Props> = ({ color, children }) => (
  <Container color={color}>
    <Inner>{children}</Inner>
  </Container>
);

const Container = styled.div<{ color?: string }>`
  box-sizing: border-box;
  background-color: ${(props) => props.color ?? '#caeaeb'};
  width: 100%;
  padding: 56px 16px;

  @media (max-width: ${mediaQuery.tablet.portrait}) {
    padding: 16px 0;
  }
`;

const Inner = styled.div`
  max-width: 1050px;
  margin: 0 auto;
`;
