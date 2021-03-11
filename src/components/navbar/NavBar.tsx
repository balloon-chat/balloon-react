import { NavButton, NavButtonLarge } from 'src/components/navbar/NavBarAction';
import { rootPath, topicPath } from 'src/pages/pagePath';
import styled from 'styled-components';

// tslint:disable-next-line:variable-name
export const NavBarLarge = () => {
  return (<NavContainerLarge>
    <NavTitleLarge>
      <div>ふうせん</div>
      <TitleIconLarge src={'/images/character_blue.png'}/>
      <div>チャット</div>
    </NavTitleLarge>
    <ActionContainerLarge>
      <NavButtonLarge link={topicPath.create} title={'話題を作る'} imgSrc={'/svg/speech_balloon.svg'}/>
      <NavButtonLarge link={topicPath.index} title={'話題に参加する'} imgSrc={'/svg/exit.svg'}/>
    </ActionContainerLarge>
  </NavContainerLarge>);
};

// tslint:disable-next-line:variable-name
export const NavBar = () => {
  return (<NavContainer>
    <NavTitle href={rootPath.index}>
      <div>ふうせん</div>
      <TitleIcon src={'/images/character_blue.png'}/>
      <div>チャット</div>
    </NavTitle>
    <ActionContainer>
      <NavButton link={topicPath.create} title={'話題を作る'} imgSrc={'/svg/speech_balloon.svg'}/>
      <NavButton link={topicPath.index} title={'話題に参加する'} imgSrc={'/svg/exit.svg'}/>
    </ActionContainer>
  </NavContainer>);
};

// tslint:disable-next-line:variable-name
const NavContainer = styled.div`
  align-items: center;
  background-color: white;
  border-bottom: 1px solid rgba(0, 0, 0, .1);
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  padding-top: 0;
`;

// tslint:disable-next-line:variable-name
const NavContainerLarge = styled(NavContainer)`
  flex-direction: column;
  padding-top: 16px;
`;

// tslint:disable-next-line:variable-name
const NavTitle = styled.a`
  align-items: center;
  color: inherit;
  display: flex;
  font-size: 16px;
  height: 100%;
  text-align: center;
  text-decoration: none;

  &:hover {
    background-color: rgba(0, 0, 0, .1);
  }
`;

// tslint:disable-next-line:variable-name
const NavTitleLarge = styled(NavTitle)`
  font-size: 36px;

  &:hover {
    background-color: transparent;
  }
`;

// tslint:disable-next-line:variable-name
const TitleIcon = styled.img`
  margin: 0 16px;
  height: 24px;
`;

// tslint:disable-next-line:variable-name
const TitleIconLarge = styled(TitleIcon)`
  margin: 0 8px;
  height: 48px;
`;

// tslint:disable-next-line:variable-name
const ActionContainer = styled.div`
  display: flex;
  flex-direction: row;
  max-width: 500px;
  width: 100%;
`;

// tslint:disable-next-line:variable-name
const ActionContainerLarge = styled(ActionContainer)`
  margin-top: 16px;
`;
