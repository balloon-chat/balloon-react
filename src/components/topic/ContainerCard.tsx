import React from 'react';
import styled from 'styled-components';

// tslint:disable-next-line:variable-name
export const ContainerCard: React.FC = ({ children }) => {
  return (<Card>{children}</Card>);
};

// tslint:disable-next-line:variable-name
const Card = styled.div`
  box-sizing: border-box;
  border-radius: 5px;
  overflow: hidden;
  background-color: white;
  box-shadow: 0 1px 1px 0 rgb(131 131 131 / 50%);
  width: 100%;
  margin: 0 auto;
  max-width: 1050px;
  min-height: 100vh;
`;
