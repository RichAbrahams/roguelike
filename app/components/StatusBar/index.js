/**
*
* StatusBar
*
*/

import React from 'react';
// import styled from 'styled-components';
import { Wrapper, SubWrapper, LeftCell, RightCell, BarWrapper, BarInner, BarText, H3, BarData } from './styles';

function StatusBar(props) {
  const { playerLevel, playerHealth, playerXP, playerWeapon, playerMaxHealth, playerNextLevel, levelMap } = props;
  const healthBar = (100 / playerMaxHealth) * playerHealth;
  // const xpBar = (100 / playerNextLevel) * playerXP
  const xpBar = () => {
    if (playerLevel === 5) {
      return {
        text: 'Max Level',
        width: 100,
      };
    }
    return {
      text: `${playerXP}/${playerNextLevel}`,
      width: (100 / playerNextLevel) * playerXP,
    };
  };
  return (
    <Wrapper className="StatusWrapper">
      <LeftCell className="Cell1">
        <H3>Floor</H3>
        <H3>{levelMap.currentLevel}</H3>
      </LeftCell>
      <LeftCell className="Cell2">
        <H3>Level</H3>
        <H3>{playerLevel}</H3>
      </LeftCell>
      <LeftCell className="Cell3">
        <H3>Weapon</H3>
        <H3>+{playerWeapon}</H3>
      </LeftCell>
      <SubWrapper className="SubWrapper">
        <RightCell>
          <BarText>Health</BarText>
          <BarWrapper className="healthWrapper">
            <BarInner className="healthInner" width={healthBar} />
            <BarData>{playerHealth}/{playerMaxHealth}</BarData>
          </BarWrapper>
        </RightCell>
        <RightCell>
          <BarText>XP</BarText>
          <BarWrapper className="xpWrapper">
            <BarInner className="xpInner" width={xpBar().width} />
            <BarData>{xpBar().text}</BarData>
          </BarWrapper>
        </RightCell>
      </SubWrapper>
    </Wrapper>
  );
}

StatusBar.propTypes = {

};

export default StatusBar;
