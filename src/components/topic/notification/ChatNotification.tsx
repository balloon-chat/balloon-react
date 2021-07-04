import React from 'react';
import { mediaQuery } from 'src/components/constants/mediaQuery';
import { ZIndex } from 'src/components/constants/z_index';
import styled from 'styled-components';
import Image from 'next/image';
import { imagePath } from 'src/components/constants/imagePath';

type Props = {
  message: string,
  visible: boolean,
}

export const ChatNotification: React.FC<Props> = ({
  message,
  visible,
  children,
}) => (
  <Wrapper>
    <Container>
      <Dialog visible={visible}>
        <Header>
          <Image src={imagePath.character.blue} width={30} height={30} />
          <HeaderTitle>おしらせ</HeaderTitle>
        </Header>
        <Body>
          <Title>{message}</Title>
          <Actions>
            {children}
          </Actions>
        </Body>
      </Dialog>
    </Container>
  </Wrapper>
);

const Wrapper = styled.div`
  position: relative;
`;

const Container = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  width: 100%;
  top: 16px;
  left: 0;
  right: 0;
`;

const Dialog = styled.div<{visible: boolean}>`
  box-sizing: border-box;
  background-color: white;
  border-radius: 10px;
  box-shadow: 20px 20px 60px rgba(0, 0, 0, .2);
  display: flex;
  flex-direction: column;
  transition: all 0.4s ease-in-out;
  transform: translateY(${(props) => (props.visible ? 0 : -50)}vh);
  padding: 16px 24px;
  width: calc(100% - 16px);
  max-width: calc(100% - 16px);
  z-index: ${ZIndex.notification};

  @media screen and (min-width: ${mediaQuery.tablet.portrait}px) {
    width: auto;
    max-width: 800px;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`;

const HeaderTitle = styled.div`
  margin-left: 16px;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  
  @media screen and (min-width: ${mediaQuery.tablet.portrait}px) {
    align-items: center;
    flex-direction: row;
  }
`;

const Title = styled.div`
  font-size: 18px;

  @media screen and (min-width: ${mediaQuery.tablet.portrait}px) {
    margin-right: 16px;
  }
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;

  @media screen and (min-width: ${mediaQuery.tablet.portrait}px) {
    margin: 0;
  }
`;
