import React from "react";
import styled from "styled-components";
import media from "styled-media-query";
import Profile from './overview'
import Requirements from './requirements'
import Processes from './processes'
import { PropsRoute } from "../../helpers/router";
import Sidebar from "../../components/sidebar/sidebar";
import { compose, withState, withHandlers } from "recompose";

export default compose(
  withState("event", "onEvent", "all"),
  withHandlers({
    handleEvent: props => val => props.onEvent(val.value)
  })
)(props => {
  return (
    <Body>
      <Sidebar
        param={props.match.params.id}
        providerId={props.providerId}
        location={props.location}
      />
      <Wrapper>
        <Content>
          <Inside>
            <Overview>
              <PropsRoute
                  component={Requirements}
                  path="/agent/:id/requirements"
                  providerId={props.providerId}
                  param={props.match.params.id}
                  event={props.event}
                  isCommittedOpen={props.isCommittedOpen}
                  handleCommittedOpen={props.handleCommittedOpen}
                  isCompletedOpen={props.isCompletedOpen}
                  handleCompletedOpen={props.handleCompletedOpen}
                />
                <PropsRoute
                  component={Processes}
                  path="/agent/:id/processes"
                  providerId={props.providerId}
                  event={props.event}
                  param={props.match.params.id}
                />
                <PropsRoute
                  component={Profile}
                  path={props.match.path}
                  param={props.match.params.id}
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


const WrapperNew = styled.div`
  cursor: pointer;
  box-sizing: border-box;
  width: 180px;
  position: relative;
  z-index: 99999;
  margin-right: 16px;
  margin-top: 10px;
  flex: 1;
`;


const Img = styled.div`
  width: 34px;
  height: 34px;
  background: ${props => props.theme.color.p150};
  border-radius: 100px;
  display: inline-block;
  margin-right: 8px;
  margin-left: 16px;
  margin-top: 18px;
  vertical-align: middle;
  background-size: cover;
`;

const SmartSentence = styled.div`
  height: 70px;
  background: #fff;
  display: flex;
  flex-direction: row;
  margin-bottom: 16px;
  border: 1px solid #dadada;
  border-radius: 4px;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  position: relative;
  flex: 1;
  margin-left: 8px;
  min-height: 100vh;
  ${media.lessThan("medium")`
    display: ${props => (props.isopen ? "none" : "flex")}
  `};
`;

const Content = styled.div`
  will-change: transform;
  display: flex;
  flex: 1;
  background:#fff;
  padding-top: 8px;
`;

const Inside = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-content: center;
  position: relative;

  position: relative;
`;

const Overview = styled.div`
  flex: 1;
  ${media.lessThan("medium")`
  width: 100%;
  margin-top: 16px;
  `};
`;

const Body = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
`;