import React, { CSSProperties } from 'react';
import styled from 'styled-components';
import { SVGIcon } from 'src/components/common/SVGIcon';

export const UploadDialog: React.FC<{ isDragging: boolean }> = ({
  isDragging,
}) => (
  <UploadDialogContainer style={uploadDialogStyle(isDragging)}>
    <SVGIcon url="/svg/upload_file-24px.svg" />
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
  z-index: 2000;

  & ${SVGIcon} {
    background-color: white;
    margin-right: 16px;
  }
`;
