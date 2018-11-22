import React from "react";
import styled from "styled-components";
import media from "styled-media-query";
import Sidebar from "../../components/sidebar/sidebar";
import { compose, withState, withHandlers } from "recompose";
import Profile from "./profile";
import { PropsRoute } from "../../helpers/router";
import Requirements from "./requirements";
import Processes from "./processes";

export default compose(
  withState("event", "onEvent", "all"),
  withHandlers({
    handleEvent: props => val => props.onEvent(val.value)
  })
)(props => {
  return (
    <Body>
      <Sidebar
        profile="true"
        param={props.match.params.id}
        providerImage={props.providerImage}
        providerName={props.providerName}
        providerId={props.providerId}
        location={props.location}
      />
      <Wrapper>
        <Content>
          <Inside>
            <Overview>
              <PropsRoute
                component={Requirements}
                path={"/requirements"}
                providerId={props.providerId}
                event={props.event}
                isCommittedOpen={props.isCommittedOpen}
                handleCommittedOpen={props.handleCommittedOpen}
                isCompletedOpen={props.isCompletedOpen}
                handleCompletedOpen={props.handleCompletedOpen}
              />
              <PropsRoute
                component={Processes}
                path={"/processes"}
                providerId={props.providerId}
                event={props.event}
                handleProcess={props.handleProcess}
                processModalIsOpen={props.processModalIsOpen}
              />
              <PropsRoute
                component={Profile}
                path={"/"}
                providerId={props.providerId}
                event={props.event}
                exact
              />
            </Overview>
          </Inside>
        </Content>
      </Wrapper>
    </Body>
  );
});

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  position: relative;
  flex: 1;
  margin-left: 8px;
  overflow-y: overlay;
  min-height: 100vh;
  margin-bottom: -20px;
  ${media.lessThan("medium")`
    display: ${props => (props.isopen ? "none" : "flex")}
  `};
`;

const Content = styled.div`
  flex: 1 1 auto;
  will-change: transform;
  display: flex;
  flex: 1;
  background: #fff;
  padding-top: 8px;
`;

const Inside = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-content: center;
  position: relative;
  overflow-y: overlay;
  position: relative;
`;

const Overview = styled.div`
  flex: 1;
  ${media.lessThan("medium")`
  width: 100%;
  `};
`;

const Body = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
`;
