import React, { CSSProperties } from 'react';
import styled from 'styled-components';
import UploadFile from 'src/components/svgs/upload_file.svg';
import { ZIndex } from 'src/components/constants/z_index';

export const UploadDialog: React.FC<{ isDragging: boolean }> = ({
  isDragging,
}) => (
  <UploadDialogContainer style={uploadDialogStyle(isDragging)}>
    <UploadFile />
    <div>ドロップして画像をアップロード</div>
  </UploadDialogContainer>
);

const uploadDialogStyle = (isDragging: Boolean): CSSProperties => ({
  bottom: isDragging ? 24 : 0,
  opacity: isDragging ? 1 : 0,
  visibility: isDragging ? 'visible' : 'hidden',
} as const);

const UploadDialogContainer = styled.div`
  border-radius: 5px;
  color: white;
  display: flex;
  padding: 8px;
  background-color: #5b87fa;
  left: 50%;
  pointer-events: none;
  position: absolute;
  transform: translate(-50%, 0);
  transition: all 0.2s ease-out 0s;
  z-index: ${ZIndex.dialog};

  & > svg {
    fill: white;
    margin-right: 8px;
  }
`;
