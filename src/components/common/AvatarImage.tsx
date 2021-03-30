import styled from 'styled-components';

type Props = {
  size: number
  floating?: boolean,
}

export const AvatarImage = styled.img<Props>`
  border-radius: 50%;
  box-shadow: ${(props) => (props.floating ? '0 10px 10px -2px rgb(0 64 128 / 20%)' : 'none')};
  height: ${(props) => `${props.size}px`};
  width: ${(props) => `${props.size}px`};
  object-fit: cover;
`;
