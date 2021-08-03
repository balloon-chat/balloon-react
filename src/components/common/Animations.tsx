import { keyframes } from 'styled-components';

export const fadeinAnimation = keyframes`
  from { opacity: 0; }
  to   { opacity: 1.0; }
`;

export const slideX = (from: number, to: number) => keyframes`
  from { transform: translateX(${from}px); }
  to   { transform: translateX(${to}px); }
`;

export const slideY = (from: number, to: number) => keyframes`
  from { transform: translateY(${from}px); }
  to   { transform: translateY(${to}px); }
`;
