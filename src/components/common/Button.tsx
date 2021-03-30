import styled from 'styled-components';

export const Button = styled.button<{isEnabled?: boolean}>`
  background-color: ${(props) => (props.isEnabled ?? true ? '#5b87fa' : '#ccc')};
  border-style: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  font-weight: bold;
  padding: 8px 24px;

  &:focus {
    outline: none;
  }
`;

export const TextButton = styled(Button)<{isEnabled?: boolean}>`
  background-color: transparent;
  color: ${(props) => (props.isEnabled ?? true ? '#5b87fa' : '#999')};
`;
