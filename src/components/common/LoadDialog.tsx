import React from 'react';
import styled from 'styled-components';
import { Dialog } from 'src/components/common/Dialog';
import { imagePath } from 'src/components/constants/imagePath';

type Props = {
  message: string;
};

export const LoadDialog: React.FC<Props> = ({ message }) => (
  <Dialog onClose={() => {}}>
    <Container>
      <DialogImage src={imagePath.character.blue} />
      <DialogMessage>{message}</DialogMessage>
    </Container>
  </Dialog>
);

const Container = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
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
  width: 100px;
  height: 100px;
  object-fit: contain;

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;
