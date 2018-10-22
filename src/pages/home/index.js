import React from "react";
import styled from "styled-components";
import Header from "../agent/header";
import { graphql } from "react-apollo";
import media from "styled-media-query";
import Feeds from "../agent/feeds";
import HeaderTitle from "../../components/agentSectionHeader";
import AgentPlans from "../../components/agentplans";
import AgentIntents from "../../components/agentintents";
import { compose, withState, withHandlers } from "recompose";
import deleteNotification from "../../mutations/deleteNotification";
import updateNotification from "../../mutations/updateNotification";
import IntentModal from "../../components/modalIntent";
const Agent = props => {
  return (
    <Wrapper isOpen={props.isOpen}>
      <Header
        id={props.id}
        toggleLeftPanel={props.toggleLeftPanel}
        togglePanel={props.togglePanel}
      />
      <Content>
        <Inside>
          <Overview>
            <EventsInfo>
              <AgentPlans id={props.id} />
              <AgentIntents
                toggleModal={props.toggleIntentModal}
                id={props.id}
                profile
              />
            </EventsInfo>
            <div style={{ margin: "16px", marginBottom: 0, marginTop: 0 }}>
              <HeaderTitle title="Feed" />
            </div>
            <Feeds
              providerId={props.providerId}
              openValidationModal={props.toggleValidationModal}
              id={props.id}
            />
          </Overview>
        </Inside>
      </Content>
      <IntentModal
        modalIsOpen={props.intentModalIsOpen}
        toggleModal={props.toggleIntentModal}
        contributionId={props.intentModalId}
        intent={props.intentModal}
        addIntent={props.selectValidationModalId}
        providerId={props.providerId}
        scopeId={
          props.id === props.providerId
            ? props.providerId
            : props.match.params.id
        }
      />
    </Wrapper>
  );
};

export default compose(
  graphql(updateNotification, { name: "updateNotification" }),
  graphql(deleteNotification, { name: "deleteNotification" }),
  withState("intentModalIsOpen", "toggleIntentModalIsOpen", false),
  withState("intentModal", "selectIntentModal", null),
  withHandlers({
    toggleIntentModal: props => contributionId => {
      props.selectIntentModal(contributionId);
      props.toggleIntentModalIsOpen(!props.intentModalIsOpen);
    }
  })
)(Agent);

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  position: relative;
  width: 100%;
  height: 100%;
  ${media.lessThan("medium")`
    display: ${props => (props.isOpen ? "none" : "flex")}
  `};
`;

const Content = styled.div`
  contain: strict;
  flex: 1 1 auto;
  will-change: transform;
  display: flex;
  flex: 1;
`;

const Inside = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-content: center;
  position: relative;
  overflow-y: overlay;
  position: relative;
  margin-top: 16px;
`;

const Overview = styled.div`
  flex: 1;
  ${media.lessThan("medium")`
  width: 100%;
  margin-top: 16px;
  `};
`;

// const Textarea = styled.textarea`
// width: 100%;
// height: 100%;
// box-sizing: border-box;
// border: none;
// padding: 8px;
// resize: none;
// ${placeholder({
//   fontFamily: 'Fira-Sans'
// })}
// `

const EventsInfo = styled.div`
  display: grid;
  column-gap: 16px;
  grid-template-columns: 1fr 2fr
  padding: 16px;
  padding-top: 0;
`;
