/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import { mediaQuery } from 'src/components/constants/mediaQuery';
import styled from 'styled-components';
import { imagePath } from 'src/components/constants/imagePath';
import { Transition } from 'react-transition-group';
import { fadeinAnimation, slideX, slideY } from 'src/components/common/Animations';
import { Button } from 'src/components/common/Button';

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
  <Transition in={visible} timeout={500} unmountOnExit mountOnEnter>
    {
      (status) => {
        const visibleState = status === 'entering' || status === 'entered';
        return (
          <NotificationContainer>
            <Notification isVisible={visibleState} duration={500}>
              <NotificationHeader>
                <Title>
                  <img src={imagePath.character.blue} width={32} height={32} alt="icon" />
                  <div>{title ?? 'お知らせ'}</div>
                </Title>
                {message && <Message>{message}</Message>}
              </NotificationHeader>
              <Actions>{children}</Actions>
            </Notification>
          </NotificationContainer>
        );
      }
    }
  </Transition>
);

const NotificationContainer = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  left: 0;
  padding: 8px 16px;
  transform: translateY(-100%);
  display: flex;
  justify-content: flex-end;
  overflow-x: hidden;

  @media screen and (min-width: ${mediaQuery.tablet.portrait}px) {
    left: inherit;
    min-width: 200px;
  }
`;

const Notification = styled.div<{ isVisible: boolean, duration: number }>`
  background-color: white;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  opacity: ${({ isVisible }) => (isVisible ? 1.0 : 0)};
  padding: 16px;
  width: 100%;

  // モバイルの場合は、下からスライドイン
  animation: ${fadeinAnimation} ${({ duration }) => duration}ms, ${slideY(500, 0)} ${({ duration }) => duration}ms;
  transition: all ${({ duration }) => duration}ms;
  transform: translateY(${({ isVisible }) => (isVisible ? 0 : '500px')}); 
  
  // タブレット以上の場合は、横からスライドイン
  @media screen and (min-width: ${mediaQuery.tablet.portrait}px) {
    min-width: 200px;
    animation: ${fadeinAnimation} ${({ duration }) => duration}ms, ${slideX(500, 0)} ${({ duration }) => duration}ms;
    transform: translateX(${({ isVisible }) => (isVisible ? 0 : '500px')});
  }
`;

const Actions = styled.div`
  display: flex;
  flex-direction: row;
  align-items: start;

  & > ${Button}:first-child {
    margin-right: 16px;
  }

  & > ${Button} {
    margin-top: 16px;
    flex: 1;
  }
`;

const NotificationHeader = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;

  @media screen and (min-width: ${mediaQuery.tablet.portrait}px) {
    align-items: flex-start;
  }
`;

const Title = styled.div`
  align-items: center;
  color: rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: row;
  justify-content: center;
  font-size: 1.2rem;

  & > img {
    margin-right: 8px;
  }

  @media screen and (min-width: ${mediaQuery.tablet.portrait}px) {
    justify-content: flex-start;
  }
`;

const Message = styled.div`
  margin-top: 4px;
  color: rgba(0,0,0,.7);
`;
