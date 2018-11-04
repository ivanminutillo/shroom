import React from "react";
import styled from "styled-components";
import media from "styled-media-query";
import { clearFix } from "polished";
import { Icons } from "oce-components/build";

export default ({
  toggleLeftPanel,
  togglePanel,
  name,
  image
}) => (
  <WrappedHeader>
    <Header>
      <HeaderLeft>
        <HeaderSpan onClick={toggleLeftPanel}>
          <Icons.Left width="22" height="22" color="#99ADC6" />
        </HeaderSpan>
        <Img src={image} />
        <Title>{name}</Title>
      </HeaderLeft>
      <HeaderRight>
        <Span onClick={togglePanel}>
          <Icons.Sidebar width="22" height="22" color="#99ADC6" />
        </Span>
      </HeaderRight>
    </Header>
  </WrappedHeader>
);


const WrappedHeader = styled.div`
  ${clearFix()};
  background: #2f3136;
  position: relative;
`;

const Header = styled.div`
  position: relative;
  height: 50px;
  color: ${props => props.theme.color.p100};
  background: #2f3136;
  border-bottom: 1px solid #1e2024;
  box-shadow: 0 1px 0 #373d45;
  z-index: 9999;
  ${clearFix()};
  ${media.lessThan("medium")`
    width: 100%;
  `};
`;

const HeaderLeft = styled.div`
  float: left;
  margin-left: 8px;
  ${clearFix()};
`;

const HeaderSpan = styled.div`
  float: left;
  vertical-align: sub;
  margin-top: 14px;
  margin-left: 0px;
  cursor: pointer;
  display: none;
  ${media.lessThan("medium")`
    display: block;
    margin-right: 8px;
  `};
`;

const HeaderRight = styled.div`
  float: right;
  ${clearFix()};
  margin-right: 8px;
`;

const Span = styled.div`
  margin-right: 0px;
  cursor: pointer;
  float: left;
  margin-left: 24px;
  background: ${props => (props.popup ? "#485562" : "none")};
  width: 30px;
  height: 30px;
  vertical-align: middle;
  text-align: center;
  border-radius: 100%;
  margin-top: 10px;
  & svg {
    margin-top: 5px;
  }
  &:hover {
    background: #485562;
  }
`;

const Img = styled.div`
  float: left;
  background: url(${props => props.src});
  border-radius: ${props => props.theme.avatar.radius};
  width: ${props => props.theme.avatar.mini};
  height: ${props => props.theme.avatar.mini};
  margin-top: 11px;
  margin-left: 0px;
  background-size: cover;
  background-color: ${props => props.theme.color.p600};
`;
const Title = styled.h2`
  float: left;
  margin-left: 8px;
  line-height: 50px;
`;

