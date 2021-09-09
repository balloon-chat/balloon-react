import React, { useCallback } from 'react';
import { imagePath } from 'src/components/constants/imagePath';
import { useDispatch } from 'react-redux';
import { showStampDialog } from 'src/data/redux/chat/slice';
import styled from 'styled-components';
import { useChatState } from 'src/data/redux/chat/selector';
import { mediaQuery } from 'src/components/constants/mediaQuery';
import Image from 'next/image';

export const StampMessage = () => {
  const dispatcher = useDispatch();
  const { dialog, form } = useChatState();

  const handleOnClick = useCallback(() => {
    dispatcher(showStampDialog());
  }, []);

  return (
    <Container isActive={dialog.stamp} isVisible={!form.inputting} onClick={handleOnClick}>
      <Image src={imagePath.character.blue} height={50} width={50} layout="fixed" />
    </Container>
  );
};

const Container = styled.div<{isActive: boolean, isVisible: boolean}>`
  border: 2px solid ${({ isActive }) => (isActive ? '#5b87fa' : 'rgba(0, 0, 0, .2)')};
  border-radius: 20%;
  background-color: #aee1e1;
  height: 50px;

  // 入力中は隠す
  margin-right: ${({ isVisible }) => (isVisible ? 8 : 0)}px;
  visibility: ${({ isVisible }) => (isVisible ? 'inherit' : 'hidden')};
  width: ${({ isVisible }) => (isVisible ? 50 : 0)}px;

  // タブレット以上の場合は常に表示
  @media screen and (min-width: ${mediaQuery.tablet.portrait}px) {
    margin-right: 8px;
    visibility: inherit;
    width: 50px;
  }
`;
