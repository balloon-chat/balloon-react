import styled from 'styled-components';

type Props = {
  title: string,
  imgSrc: string,
  link: string,
};
// tslint:disable-next-line:variable-name
export const NavButtonLarge = ({ title, imgSrc, link }: Props) => {
  return (<NavButtonLargeContainer href={link}>
    <ActionLargeIcon src={imgSrc}/>
    <div>{title}</div>
  </NavButtonLargeContainer>);
};

// tslint:disable-next-line:variable-name
export const NavButton = ({ title, imgSrc, link }: Props) => {
  return (<NavButtonContainer href={link}>
    <ActionIcon src={imgSrc}/>
    <div>{title}</div>
  </NavButtonContainer>);
};

// tslint:disable-next-line:variable-name
const NavButtonContainer = styled.a`
  align-items: center;
  display: flex;
  color: inherit;
  flex: 1;
  font-size: 16px;
  justify-content: center;
  padding: 8px 0;
  text-align: center;
  text-decoration: none;

  &:hover {
    background-color: rgba(0, 0, 0, .1);
    cursor: pointer;
  }
`;

// tslint:disable-next-line:variable-name
const NavButtonLargeContainer = styled(NavButtonContainer)`
  padding: 16px 0;
`;

// tslint:disable-next-line:variable-name
const ActionIcon = styled.img`
  height: 32px;
  margin-right: 16px;
`;

// tslint:disable-next-line:variable-name
const ActionLargeIcon = styled(ActionIcon)`
  height: 32px;
`;
