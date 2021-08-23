import styled from 'styled-components';

export const Button = styled.button<{isEnabled?: boolean}>`
  background-color: ${(props) => (props.isEnabled ?? true ? '#5b87fa' : '#ccc')};
  border: 2px solid ${(props) => (props.isEnabled ?? true ? '#5b87fa' : '#999')};
  border-radius: 5px;
  color: white;
  cursor: pointer;
  font-weight: bold;
  padding: 8px 24px;

  &:focus {
    outline: none;
  }
`;

export const OutlinedButton = styled(Button)<{isEnabled?: boolean}>`
  background-color: transparent;
  border: 2px solid ${(props) => (props.isEnabled ?? true ? '#5b87fa' : '#999')};
  color: ${(props) => (props.isEnabled ?? true ? '#5b87fa' : '#999')};
`;

export const TextButton = styled(Button)<{isEnabled?: boolean}>`
  background-color: transparent;
  border-color: transparent;
  color: ${(props) => (props.isEnabled ?? true ? '#5b87fa' : '#999')};
`;
