import React from "react";
import Sidebar from "../../components/sidebar/sidebar";
import styled from "styled-components";
import media from "styled-media-query";
import Header from './header'

const Process = props => (
  <Body>
    <Sidebar
      profile="true"
      isopen={props.isopen}
      param={props.match.params.id}
    />
    <Wrapper isopen={props.isopen}>
      <Header />
      {/* <Output />
      <Content>
        <Actions />
        <Agents />
      </Content> */}
    </Wrapper>
  </Body>
);

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  position: relative;
  flex: 1;
  margin: 16px 32px 0;
  ${media.lessThan("medium")`
    display: ${props => (props.isopen ? "none" : "flex")}
  `};
`;
const Body = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
`;

export default Process;
