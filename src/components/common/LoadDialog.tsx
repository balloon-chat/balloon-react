import React from 'react';
import styled from 'styled-components';

type Props = {
  message: string;
};

export const LoadDialog: React.FC<Props> = ({ message }) => (
  <DialogContainer>
    <Dialog>
      <DialogImage src="/images/character_blue.png" width={100} />
      <DialogMessage>{message}</DialogMessage>
    </Dialog>
  </DialogContainer>
);

const DialogContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
`;

const Dialog = styled.div`
  box-sizing: border-box;
  padding: 32px 62px;
  background-color: white;
  display: flex;
  border-radius: 5px;
  flex-direction: column;
  text-align: center;
  align-items: center;
  white-space: nowrap;
  max-width: 100%;
`;

const DialogMessage = styled.div`
  margin-top: 24px;
  font-size: 20px;
  color: rgba(0, 0, 0, 0.8);
`;

const DialogImage = styled.img`
  animation-name: rotate;
  animation-duration: 1.5s;
  animation-iteration-count: infinite;
  margin: 32px;

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;
