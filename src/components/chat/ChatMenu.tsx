import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { rootPath } from 'src/view/route/pagePath';
import { useTopicState } from 'src/data/redux/topic/selector';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useRouter } from 'next/router';
import { createInvitation } from 'src/view/lib/invitation';

export const ChatMenu = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { code, currentTopic } = useTopicState();
  const [invitation, setInvitation] = useState<string|null>();

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

  return (
    <div style={{ position: 'relative' }}>
      <Container onClick={() => setIsOpen((prev) => !prev)}>•••</Container>
      {
        isOpen && (
          <>
            <FullScreenContainer onClick={() => setIsOpen(false)} />
            <DialogContainer>
              <Dialog>
                {
                  invitation && (
                    <CopyToClipboard
                      text={invitation}
                      onCopy={() => setIsOpen(false)}
                    >
                      <li>招待をコピー</li>
                    </CopyToClipboard>
                  )
                }
                <Link href={rootPath.index}><li>退出</li></Link>
              </Dialog>
            </DialogContainer>
          </>
        )
      }
    </div>
  );
};

const Container = styled.div`
  align-items: center;
  border: 1px solid rgba(0,0,0,.3);
  border-radius: 100%;
  color: rgba(0,0,0,.75);
  cursor: pointer;
  display: flex;
  width: 36px;
  height: 36px;
  justify-content: center;
  position: relative;
`;

const FullScreenContainer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

const DialogContainer = styled.div`
  width: 100vw;
  position: absolute;
  top: 0;
  right: 0;
`;

const Dialog = styled.ul`
  background-color: white;
  border-radius: 5px;
  border: 1px rgba(0, 0, 0, .1) solid;
  box-shadow: 0 10px 10px -2px rgb(0 64 128 / 15%);
  z-index: 100;
  margin: 0;
  transform: translateY(-100%);
  padding: 0;
  position: absolute;
  right: 0;
  top: -16px;
  
  & > li {
    list-style: none;
    box-sizing: border-box;
    display: block;
    cursor: pointer;
    line-height: 48px;
    padding: 0 80px 0 20px;
    width: 100%;
  }
  
  & > li:hover{
    background-color: #e9f2f9;
  }
`;
