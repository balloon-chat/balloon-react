import styled from 'styled-components';

export const Button = styled.button<{isEnabled?: boolean}>`
  background-color: ${({ isEnabled }) => (isEnabled ?? true ? '#5b87fa' : '#ccc')};
  border: 2px solid ${({ isEnabled }) => (isEnabled ?? true ? '#5b87fa' : '#ccc')};
  border-radius: 5px;
  color: white;
  cursor: pointer;
  font-weight: bold;
  padding: 8px 24px;
  white-space: nowrap;

  &:focus {
    outline: none;
  }
`;

export const OutlinedButton = styled(Button)<{isEnabled?: boolean}>`
  background-color: transparent !important;
  color: ${(props) => (props.isEnabled ?? true ? '#5b87fa' : '#999')} !important;
`;

export const TextButton = styled(Button)<{isEnabled?: boolean}>`
  background-color: transparent !important;
  border-color: transparent !important;
  color: ${(props) => (props.isEnabled ?? true ? '#5b87fa' : '#999')} !important;
`;
