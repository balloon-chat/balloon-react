import React, { useCallback, useEffect, useState } from 'react';
import { ChatAction } from 'src/components/topic/actions/ChatAction';
import styled from 'styled-components';
import { ChatActionDialog } from 'src/components/topic/actions/ChatActionDialog';
import { ChatActionBottomSheet } from 'src/components/topic/actions/ChatActionBottomSheet';
import { mediaQuery } from 'src/components/constants/mediaQuery';
import { useTopicState } from 'src/data/redux/topic/selector';
import { useUserSelector } from 'src/data/redux/user/selector';
import { createInvitation } from 'src/view/lib/invitation';
import { useRouter } from 'next/router';
import { MessageLog } from 'src/components/topic/log/MessageLog';

export const DetailActions = () => {
  const [isActive, setIsActive] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <ActionDialog isActive={isActive} onClose={() => setIsActive(false)} />
      <ChatAction
        onClick={useCallback(() => setIsActive((s) => !s), [isActive])}
        isActive={isActive}
        message="詳細"
      >
        <DotContainer isActive={isActive}>
          <Dot />
          <Dot />
          <Dot />
        </DotContainer>
      </ChatAction>
    </div>
  );
};

const Dot = styled.span`
  width: 5px;
  height: 5px;
  margin: 1px;
  display: inline-block;
  border-radius: 100%;
`;

const DotContainer = styled.div<{isActive: boolean}>`
  & ${Dot} {
    border: 1px solid ${(props) => (props.isActive ? '#5b87fa' : '#555')};
    background-color: ${(props) => (props.isActive ? '#5b87fa' : '#555')};
  }
`;

const ActionDialog = ({ isActive, onClose }: {isActive: boolean, onClose: ()=> void}) => {
  const router = useRouter();
  const { code, currentTopic } = useTopicState();
  const { uid } = useUserSelector();
  const [invitation, setInvitation] = useState('');
  const [isEditable, setIsEditable] = useState(false);
  const [isLogVisible, setIsLogVisible] = useState(false);

  useEffect(() => {
    if (currentTopic) {
      const invitation = createInvitation({
        title: currentTopic.title,
        currentPath: router.asPath,
        code,
      });
      setInvitation(invitation);
    }
  }, [currentTopic]);

  useEffect(() => {
    if (!currentTopic) {
      setIsEditable(false);
      return;
    }

    setIsEditable(currentTopic.createdBy === uid);
  }, [uid, currentTopic]);

  return (
    <>
      <MobileDialog>
        <MessageLog
          isVisible={isLogVisible}
          onClose={useCallback(() => { setIsLogVisible(false); }, [])}
        />
        <ChatActionBottomSheet
          isVisible={isActive}
          isEditable={isEditable}
          invitation={invitation}
          onClose={onClose}
          onShowLog={useCallback(() => { onClose(); setIsLogVisible(true); }, [])}
        />
      </MobileDialog>
      <TabletDialog>
        <ChatActionDialog
          isVisible={isActive}
          isEditable={isEditable}
          invitation={invitation}
          onClose={onClose}
        />
      </TabletDialog>
    </>
  );
};

const MobileDialog = styled.div`
  @media screen and (min-width: ${mediaQuery.tablet.portrait}px) {
    & > div {
      visibility: hidden;
      position: fixed;
      background-color: white;
      user-select: none;
    }
  }
`;

const TabletDialog = styled.div`
  @media screen and (max-width: ${mediaQuery.tablet.portrait}px) {
    & > div {
      visibility: hidden;
      position: fixed;
      user-select: none;
    }
  }
`;
