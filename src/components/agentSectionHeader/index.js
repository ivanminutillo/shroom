import React from "react";
import styled from "styled-components";
import { clearFix } from "polished";
import {Icons} from 'oce-components'

const Header = styled.div`
  height: 36px;
  position: relative;
  ${clearFix()};
  display: inline-block;
  cursor: pointer;
`;
const SectionTitle = styled.h3`
float: left;
line-height: 36px;
font-weight: 500;
// margin-left: 8px;
color: ${props => props.theme.color.p150};
letter-spacing: .5px;
text-transform: capitalize;
`;
const Right = styled.div`
height: 36px;
line-height: 36px;
vertical-align: middle;
padding-top: 2px;
position: absolute;
right: -20px;
top: 1px;
`;

export default ({ title, action, isOpen }) => (
  <Header onClick={action}>
    <SectionTitle>{title}</SectionTitle>
    <Right>{isOpen ? <Icons.Down width='18' height='18' color='#9ab4ce' /> : <Icons.Right width='18' height='18' color='#9ab4ce' />}</Right>
  </Header>
);
