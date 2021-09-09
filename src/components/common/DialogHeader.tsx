import styled from 'styled-components';
import React from 'react';

type Props = {
  title: string,
  message: string,
}

/**
 * ダイアログに表示するタイトル
 */
export const DialogHeader = ({ title, message }: Props) => (
  <div>
    <DialogTitle>{title}</DialogTitle>
    <DialogDescription>{message}</DialogDescription>
  </div>
);

export const DialogTitle = styled.div`
  font-weight: bold;
  font-size: 1.25rem;
`;

export const DialogDescription = styled.div`
  color: rgba(0, 0, 0, .6);
`;
