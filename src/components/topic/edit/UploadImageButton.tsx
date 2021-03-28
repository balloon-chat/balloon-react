import styled from 'styled-components';

const ButtonBase = styled.button`
  align-items: center;
  border-radius: 5px;
  background-color: transparent;
  display: flex;
  font-weight: bold;
  justify-content: center;
  padding: 8px;
  width: 100%;
  outline: none;
`;

export const UploadImageButton = styled(ButtonBase)`
  border: #5b87fa 1px solid;
  color: #1976d2;

  & > svg {
    margin-right: 8px;
    fill: #1976d2;
  }
`;

export const DeleteImageButton = styled(ButtonBase)`
  border: #dd2c00 1px solid;
  color: #dd2c00;
  padding: 8px;
  width: 100%;

  & > svg  {
    margin-right: 8px;
    fill: #e64a19;
  }
`;
