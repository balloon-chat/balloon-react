/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import { mediaQuery } from 'src/components/constants/mediaQuery';
import { ZIndex } from 'src/components/constants/z_index';
import styled from 'styled-components';
import { imagePath } from 'src/components/constants/imagePath';
import { Transition } from 'react-transition-group';

type Props = {
  title?: string,
  message: string,
  visible: boolean,
}

export const ChatNotification: React.FC<Props> = ({
  title,
  message,
  visible,
  children,
}) => (
  <Transition in={visible} timeout={500} mountOnEnter unmountOnExit>
    {(status) => (
      <Wrapper>
        <Container>
          <Dialog visible={status === 'entered'}>
            <Header>
              <img src={imagePath.character.blue} width={30} height={30} alt="" />
              <HeaderTitle>おしらせ</HeaderTitle>
            </Header>
            <Body>
              {title && <Title>{title}</Title>}
              <Message>{message}</Message>
              <Actions>{children}</Actions>
            </Body>
          </Dialog>
        </Container>
      </Wrapper>
    )}
  </Transition>
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
`;

const Title = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 4px;
`;

const Message = styled.div`
  font-size: 1.0rem;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
`;
