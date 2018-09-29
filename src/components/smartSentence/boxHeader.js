import React from "react";
import styled from "styled-components";
import {Icons} from 'oce-components/build'
import { clearFix } from "polished";
import media from "styled-media-query";

const Box = styled.span`
    height: 32px;
    width: ${props => props.active ? 'auto' : '32px' };
    float: left;
    margin-top: 4px;
    line-height: 32px;
    vertical-align: middle;
    text-align: center;
    align-items: center;
    cursor: pointer;
    padding: ${props => props.active ? '0 8px' : '0' };
    background: ${props => props.active ? '#3B99FC' : '#4281C3' };
    border-radius: 3px;
    margin-right: 4px;
    transition: background-color 0.5s ease;
    &:hover {
        background: #3B99FC;
        & svg {
        color: #f0f0f0 !important;
        }
    }
    & svg {
        vertical-align: middle;
    }
`;

const Header = styled.div`
  margin-top: 0px;
  padding: 0 4px;
  height: 40px;
  ${clearFix()};
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  background: #0B6DB5;
  ${media.lessThan("medium")`
  padding-left: 4px;
  `}
`;

const TitleBox = styled.h3`
  display: inline-block;
  font-size: 14px;
  margin-left: 10px;
  letter-spacing: .5px;
  font-weight: 400;
  line-height: 31px;
  border-left: 1px solid #f0f0f040;
  padding-left: 8px;
`

export default ({handleMenuSelection, menuSelected}) => (
  <Header>
    <Box onClick={() => handleMenuSelection("1")} active={menuSelected == 1 ? true : false}>
      <Icons.Type width="18" color="#f0f0f080" />
      {menuSelected == 1 ? <TitleBox>Type a message</TitleBox> : null}
      
    </Box>
    <Box onClick={() => handleMenuSelection("2")} active={menuSelected == 2 ? true : false}>
      <Icons.Activity width="18" color="#f0f0f080" />
      {menuSelected == 2 ? <TitleBox>Log an event</TitleBox> : null}
    </Box>
    <Box onClick={() => handleMenuSelection("3")} active={menuSelected == 3 ? true : false}>
      <Icons.Dollar width="18" color="#f0f0f080" />
      {menuSelected == 3 ? <TitleBox>Transfer a currency</TitleBox> : null}
    </Box>
  </Header>
);
