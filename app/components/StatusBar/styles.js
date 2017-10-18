
import styled from 'styled-components';

export const Wrapper = styled.div`
  width: 100%;
  display: flex;
`;

export const SubWrapper = styled.div`
  height: 50%;
  display: flex;
  flex-direction: column;
  flex-grow: 2;
`;

export const LeftCell = styled.div`
  padding: 0.5em;
  display: flex;
  flex-grow: 1;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  background: #E74C3C;
  margin-right: 5px;
  margin-bottom: 5px;
`;

export const RightCell = styled.div`
  padding: 0.5em;
  display: flex;
  flex-grow: 1;
  justify-content: center;
  border-width: 0px 5px 5px 0px;
  border-color: #2C3E50;
  background: #E74C3C;
  margin-bottom: 5px;
`;

export const BarWrapper = styled.div`
  background: white;
  border: 2px solid black;
  flex-grow: 1;
  position: relative;
  margin: 0;
  background: #2C3E50;
`;

export const BarInner = styled.div`
  background: blue;
  width: ${(props) => props.width}%;
  height: 20px;
  transition: width 200ms;
  height: 100%;
  background: #29b529;
`;

export const BarText = styled.div`
  padding-top: 3px;
  width: 4em;
`;


export const H3 = styled.h3`
  margin: 0;
`;

export const BarData = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  text-align: center;
  padding-top: 2px;
`;
