import React from "react";
import styled from "styled-components";
import media from "styled-media-query";
import Profile from './overview'
import Requirements from './requirements'
import Processes from './processes'
import { PropsRoute } from "../../helpers/router";
import Sidebar from "../../components/sidebar/sidebar";
import { compose, withState, withHandlers } from "recompose";
import Inventory from '../inventory'
import SmartSentence from './smartSentence'
export default compose(
  withState("activity", "onActivity", null),
  withState("smartSentence", "onSmartSentence", false),
  withHandlers({
    handleSmartSentence: props => () => {
      props.onActivity(null)
      return props.onSmartSentence(!props.smartSentence)
    },
    handleActivity: props => value => props.onActivity(value)
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
        <CoverImage />
        <SmartSentence providerImage={props.providerImage} handleActivity={props.handleActivity} activity={props.activity} scopeId={props.match.params.id} handleSmartSentence={props.handleSmartSentence} isActive={props.smartSentence}/>
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
                  handleProcess={props.handleProcess}
                  processModalIsOpen={props.processModalIsOpen}
                />
                <PropsRoute
                  component={Profile}
                  path={props.match.path}
                  param={props.match.params.id}
                  providerId={props.providerId}
                  event={props.event}
                  exact
                />
                <PropsRoute
                  component={Inventory}
                  path={"/agent/:id/inventory"}
                  providerId={props.match.params.id}
                  exact
                />
            </Overview>
          </Inside>
        </Content>
      </Wrapper>
      {props.smartSentence ? <Overlay onClick={props.handleSmartSentence} /> : null}
    </Body>
  );
});


const CoverImage = styled.div`
height: 300px;
background: url(https://picsum.photos/800/300/?random);
background-repeat: no-repeat;
background-size: cover;
background-position: center center;
margin: 10px;
margin-top: 0;
border-radius: 2px;
`
const Overlay = styled.div`
  background: rgba(0,0,0,.4);
  position: fixed;
  z-index: 9999;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  height: 100vh;
`

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
  // background:#fff;
`;

const Inside = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-content: center;
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