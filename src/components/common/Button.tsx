import styled from 'styled-components';

export const Button = styled.button`
  background-color: #5b87fa;
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

export const TextButton = styled(Button)`
  background-color: transparent;
  color: #5b87fa;
`;
