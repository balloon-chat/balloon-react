import styled from 'styled-components';
import { ZIndex } from 'src/components/constants/z_index';

export const FullscreenContainer = styled.div<{isVisible: boolean, transparent?: boolean}>`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: ${(props) => (props.transparent ? 'transparent' : 'rgba(0, 0, 0, .6)')};
  visibility: ${(props) => (props.isVisible ? 'visible' : 'hidden')};
  z-index: ${ZIndex.dialog};
`;
