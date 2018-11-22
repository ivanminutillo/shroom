import React from "react";
import styled from "styled-components";
import { clearFix } from "polished";
import Icons from '../../atoms/icons'

const Header = styled.div`
  height: 26px;
  position: relative;
  ${clearFix()};
  display: inline-block;
  cursor: pointer;
`;
const SectionTitle = styled.h3`
float: left;
line-height: 26px;
font-weight: 500;
color: ${props => props.theme.color.p900};
letter-spacing: .5px;
text-transform: capitalize;
`;
const Right = styled.div`
height: 26px;
line-height: 26px;
vertical-align: middle;
padding-top: 2px;
position: absolute;
right: -20px;
top: 1px;
`;

export default ({ title, action, isopen }) => (
  <Header onClick={action}>
    <SectionTitle>{title}</SectionTitle>
    <Right>{isopen ? <Icons.Down width='18' height='18' color='#9ab4ce' /> : <Icons.Right width='18' height='18' color='#9ab4ce' />}</Right>
  </Header>
);
