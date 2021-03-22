import styled from 'styled-components';

// tslint:disable-next-line:variable-name
export const SVGIcon = styled.div<{ url: string, color?: string }>`
  width: 24px;
  height: 24px;
  background-color: ${props => props.color ?? 'black'};
  mask: url(${props => props.url}) no-repeat center;
`;