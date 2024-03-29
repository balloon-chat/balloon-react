import { Button } from 'src/components/common/Button';
import { Dialog } from 'src/components/common/Dialog';
import React from 'react';
import styled from 'styled-components';

type Props = {
  message: string | null, // nullの場合は表示しない
  closeMessage?: string,
  onClose: () => void,
}

export const ErrorDialog = ({ message, closeMessage, onClose }: Props) => (
  <Dialog onClose={onClose} isVisible={message !== null}>
    <ErrorDialogContainer>
      <div>{message ?? ''}</div>
      <Button onClick={onClose}>{closeMessage ?? '閉じる'}</Button>
    </ErrorDialogContainer>
  </Dialog>
);

const ErrorDialogContainer = styled.div`
  display: flex;
  flex-direction: column;

  & ${Button} {
    margin-top: 32px;
  }
`;
