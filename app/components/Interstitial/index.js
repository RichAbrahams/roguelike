/**
*
* Interstitial
*
*/

import React from 'react';
import { Wrapper, H2, H3, H4 } from './styles';

function Interstitial(props) {
  const { interstitialText } = props;
  return (
    <Wrapper>
      <H2>{ interstitialText.l1 }</H2>
      { interstitialText.l2 ? <H3>{interstitialText.l2}</H3> : null}
      { interstitialText.l3 ? <H4>{interstitialText.l3}</H4> : null}
      { interstitialText.l4 ? <H4>{interstitialText.l4}</H4> : null}
      { interstitialText.l5 ? <H4>{interstitialText.l5}</H4> : null}
    </Wrapper>
  );
}

Interstitial.propTypes = {
  interstitialText: React.PropTypes.object,
};

export default Interstitial;
