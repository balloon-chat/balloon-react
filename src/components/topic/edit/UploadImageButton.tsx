// tslint:disable-next-line:variable-name
import styled from 'styled-components';
import { SVGIcon } from 'src/components/common/SVGIcon';

// tslint:disable-next-line:variable-name
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

// tslint:disable-next-line:variable-name
export const UploadImageButton = styled(ButtonBase)`
  border: #5b87fa 1px solid;
  color: #1976d2;

  & ${SVGIcon} {
    margin-right: 8px;
    background-color: #1976d2;
  }
`;

// tslint:disable-next-line:variable-name
export const DeleteImageButton = styled(ButtonBase)`
  border: #dd2c00 1px solid;
  color: #dd2c00;
  padding: 8px;
  width: 100%;

  & ${SVGIcon} {
    margin-right: 8px;
    background-color: #e64a19;
  }
`;
