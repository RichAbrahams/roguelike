/**
*
* Header
*
*/

import React from 'react';
import { Wrapper, H1, H3 } from './styles';


function Header() {
  return (
    <Wrapper>
      <H1>
        Rogue
      </H1>
      <H3>Built with React, Redux, Redux-Saga</H3>
    </Wrapper>
  );
}

Header.propTypes = {

};

export default Header;
