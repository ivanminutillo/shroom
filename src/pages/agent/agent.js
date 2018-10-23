import React from "react";
import styled from "styled-components";
import Header from "./header";
import media from "styled-media-query";
import SmartSentence from "../../components/smartSentence";
import Feeds from "./feeds";
import { ApolloConsumer } from "react-apollo";
import HeaderTitle from "../../components/agentSectionHeader";
import AgentPlans from "../../components/agentplans";
import AgentIntents from "../../components/agentintents";
import { compose, withState, withHandlers } from "recompose";
import ValidationModal from "../../components/modalValidation";
import IntentModal from "../../components/modalIntent";
import NewRequirementModal from "../../components/newRequirementModal"

const Agent = props => {
  return (
    <Wrapper isOpen={props.isOpen}>
      <Header
        id={props.id ? props.id : props.match.params.id}
        toggleLeftPanel={props.toggleLeftPanel}
        togglePanel={props.togglePanel}
        openNewReq={props.togglenewRequirementModal}
      />
      {props.id ? null : (
        <ApolloConsumer>
          {client => (
            <SmartSentence
              client={client}
              providerId={props.providerId}
              providerImage={props.providerImage}
              providerName={props.providerName}
              scopeId={
                props.id === props.providerId
                  ? props.providerId
                  : props.match.params.id
              }
            />
          )}
        </ApolloConsumer>
      )}
      <Content>
        <Inside>
          <Overview>
            <EventsInfo>
              <AgentPlans id={props.id ? props.id : props.match.params.id} />
              <AgentIntents
                toggleModal={props.toggleIntentModal}
                id={props.id ? props.id : props.match.params.id}
              />
            </EventsInfo>
            <div style={{ margin: "16px", marginBottom: 0, marginTop: 0 }}>
              <HeaderTitle title="Feed" />
            </div>
            <Feeds
              providerId={props.providerId}
              openValidationModal={props.toggleValidationModal}
              id={props.id ? props.id : props.match.params.id}
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
      <ValidationModal
        modalIsOpen={props.validationModalIsOpen}
        toggleModal={props.toggleValidationModal}
        contributionId={props.validationModalId}
        myId={props.providerId}
        handleChange={props.handleChange}
      />
      <NewRequirementModal 
       modalIsOpen={props.newRequirementModalIsOpen}
       toggleModal={props.togglenewRequirementModal}
       scopeId={props.match.params.id}
      />
    </Wrapper>
  );
};

export default compose(
  withState("newRequirementModalIsOpen", "togglenewRequirementModalIsOpen", false),
  withState("intentModalIsOpen", "toggleIntentModalIsOpen", false),
  withState("validationModalIsOpen", "toggleValidationModalIsOpen", false),
  withState("intentModalIsOpen", "toggleIntentModalIsOpen", false),
  withState("validationModalId", "selectValidationModalId", null),
  withState("intentModal", "selectIntentModal", null),
  withHandlers({
    togglenewRequirementModal: props => () => {
      props.togglenewRequirementModalIsOpen(!props.newRequirementModalIsOpen);
    },
    toggleValidationModal: props => contributionId => {
      props.selectValidationModalId(contributionId);
      props.toggleValidationModalIsOpen(!props.validationModalIsOpen);
    },
    toggleIntentModal: props => contributionId => {
      props.selectIntentModal(contributionId);
      props.toggleIntentModalIsOpen(!props.intentModalIsOpen);
    }
  }),
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
`;

const Overview = styled.div`
  flex: 1;
  ${media.lessThan("medium")`
  width: 100%;
  `};
`;

const EventsInfo = styled.div`
  display: grid;
  column-gap: 16px;
  grid-template-columns: 1fr 2fr
  padding: 16px;
  padding-top: 0;
`;
