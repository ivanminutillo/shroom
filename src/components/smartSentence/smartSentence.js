import React from "react";
import { Icons, Input } from "oce-components/build";
import styled from "styled-components";
import { clearFix } from "polished";
import Log from "../logEvent/styled";
import media from "styled-media-query";
import {placeholder} from 'polished'
import BoxHeader from './boxHeader'

const Wrapper = styled.div`
position: relative;
  ${clearFix()};
  & input {
    float: left;
    width: 580px;
    height: 50px;
    border-radius: 4px;
    background: #42495B;
    text-indent: 8px;
    color: ${props => props.theme.color.p100};
    ${placeholder({ color: "#f0f0f0" })};
    ${media.lessThan('medium')`
        width: 100%;
    `}
  }
`;

const SpanRight = styled.div`
  width: 40px;
  text-align: center;
  margin-top: 15px;
  position: absolute;
  right: 10px;
`;


const SmartSentence = ({ handleMenuSelection, menuSelected }) => {
    return (
    <Log.Module>
        <BoxHeader menuSelected={menuSelected} handleMenuSelection={handleMenuSelection} />
      <Wrapper>
        <Input placeholder="Type your message..." />
        <SpanRight>
          <Icons.Right width="20" color="#989BA0" />
        </SpanRight>
        </Wrapper>
    </Log.Module>
  
)};

export default SmartSentence;
