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
  color: #1976D2;

  & ${SVGIcon} {
    margin-right: 8px;
    background-color: #1976D2;
  }
`;

// tslint:disable-next-line:variable-name
export const DeleteImageButton = styled(ButtonBase)`
  border: #DD2C00 1px solid;
  color: #DD2C00;
  padding: 8px;
  width: 100%;

  & ${SVGIcon} {
    margin-right: 8px;
    background-color: #E64A19;
  }
`;
