import React from 'react';
import { LoginDialog } from 'src/components/login/LoginDialog';
import styled from 'styled-components';
// tslint:disable-next-line:variable-name
const LoginPage = () => {
  return (<Container>
    <LoginDialog/>
  </Container>);
};

// tslint:disable-next-line:variable-name
const Container = styled.div`
  align-items: center;
  background-color: #AEE1E1;
  display: flex;
  height: 100%;
  justify-content: center;
`;

export default LoginPage;
