import { Transition } from 'react-transition-group';
import React from 'react';
import styled, { keyframes } from 'styled-components';
import { slideX, slideY } from 'src/components/common/Animations';
import { imagePath } from 'src/components/constants/imagePath';
import { Button, OutlinedButton } from 'src/components/common/Button';
import { mediaQuery } from 'src/components/constants/mediaQuery';
import { useChatState } from 'src/data/redux/chat/selector';
import CopyToClipboard from 'react-copy-to-clipboard';

type Props = {
  isVisible: boolean,
  duration?: number,
  onClose: () => void,
}

export const InvitationNotification = ({ isVisible, duration = 600, onClose }: Props) => {
  const { invitation } = useChatState();

  return (
    <Transition in={isVisible} timeout={duration} unmountOnExit mountOnEnter>
      {
        (status) => {
          const visibleState = status === 'entering' || status === 'entered';
          return (
            <NotificationContainer>
              <Notification isVisible={visibleState} duration={duration}>
                <Title>
                  <img src={imagePath.character.blue} width={32} height={32} alt="icon" />
                  <div>友達を招待しましょう!</div>
                </Title>
                <Actions>
                  <CopyToClipboard text={invitation ?? ''} onCopy={onClose}>
                    <Button>招待をコピー</Button>
                  </CopyToClipboard>
                  <OutlinedButton onClick={onClose}>閉じる</OutlinedButton>
                </Actions>
              </Notification>
            </NotificationContainer>
          );
        }
      }
    </Transition>
  );
};

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

const fadeinAnimation = keyframes`
  from { opacity: 0; }
  to   { opacity: 1.0; }
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
  margin-top: 16px;
  
  & > ${Button}:first-child {
    margin-right: 16px;
  } 
  
  & > ${Button} {
    flex: 1;
  }

  @media screen and (min-width: ${mediaQuery.tablet.portrait}px) {
    & > ${Button} {
      flex: none;
    }
  }
`;

const Title = styled.div`
  align-items: center;
  color: rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: row;
  justify-content: center;
  
  & > img {
    margin-right: 8px;
  }

  @media screen and (min-width: ${mediaQuery.tablet.portrait}px) {
    justify-content: flex-start;
  }
`;
