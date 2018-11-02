import React from "react";
import styled from "styled-components";
import Header from "./header";
import media from "styled-media-query";
import SmartSentence from "../../components/smartSentence";
import Feeds from "./feeds";
import { ApolloConsumer } from "react-apollo";
import AgentPlans from "../../components/agentplans";
import AgentIntents from "../../components/agentintents";
import { compose, withState, withHandlers } from "recompose";
import ValidationModal from "../../components/modalValidation";
import IntentModal from "../../components/modalIntent";
import NewRequirementModal from "../../components/newRequirementModal";
import HeaderTitle from "../../components/agentSectionHeader";
import Intent from "../../components/agentintents/intents";
import { Query } from "react-apollo";
import { LoadingMini, ErrorMini } from "../../components/loading";
import getAllCommitments from "../../queries/getAllCommitments";
import getCommitments from "../../queries/getCommitments";
import Sidebar from "../../components/sidebar/sidebar";
const Body = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
`;


const Agent = props => {
  return (
    <Body>
      <Sidebar
        isOpen={props.isSidebarOpen}
        param={props.match.params.id}
      />
    <Wrapper isOpen={props.isOpen}>
      <Header
        id={props.match.params.id}
        toggleLeftPanel={props.toggleLeftPanel}
        togglePanel={props.togglePanel}
      />
      {props.id ? null : (
        <ApolloConsumer>
          {client => (
            <SmartSentence
              client={client}
              providerId={props.providerId}
              providerImage={props.providerImage}
              providerName={props.providerName}
              scopeId={props.match.params.id}
            />
          )}
        </ApolloConsumer>
      )}
       <Content>
        <Inside>
          <Overview>

              <Query
              query={getCommitments}
              variables={{
                token: localStorage.getItem("oce_token"),
                id: props.match.params.id
              }}
            >
              {({ loading, error, data, refetch }) => {
                if (loading) return <LoadingMini />
                if (error) return <ErrorMini refetch={refetch} message={`Error! ${error.message}`}/>
                let intents = data.viewer.agent.agentCommitments
                let activeIntents = intents.filter(i => !i.isFinished)
                let completed = intents.filter(i => i.isFinished)
                return (
                  <EventsInfo>
                    <WrapperIntents>
                      <HeaderTitle title={`Inbox (${activeIntents.length})`} />
                      <ContentIntents>
                        {activeIntents.map((intent, i) => (
                          <Intent
                            handleAddEvent={props.handleAddEvent}
                            addEvent={props.addEvent}
                            toggleModal={props.toggleModal}
                            key={i}
                            data={intent}
                            scopeId={props.id}
                            myId={props.providerId}
                            providerImage={props.providerImage}
                          />
                        ))}
                      </ContentIntents>
                    </WrapperIntents>
                    <WrapperIntents>
                      <HeaderTitle title={`Completed (${completed.length})`} />
                      <ContentIntents>
                        {completed.map((intent, i) => (
                          <Intent
                            handleAddEvent={props.handleAddEvent}
                            addEvent={props.addEvent}
                            toggleModal={props.toggleModal}
                            key={i}
                            data={intent}
                            scopeId={props.id}
                            myId={props.providerId}
                            providerImage={props.providerImage}
                          />
                        ))}
                      </ContentIntents>
                    </WrapperIntents>
                  </EventsInfo>
                );
              }}
            </Query>
          </Overview>
        </Inside>
      </Content>
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
    </Body>
  );
};



const WrapperIntents = styled.div`
  position: relative;
`;

const ContentIntents = styled.div`
  overflow-y: scroll;
  margin: 0;
  padding: 0;
  width: 100%;
`;


export default compose(
  withState(
    "newRequirementModalIsOpen",
    "togglenewRequirementModalIsOpen",
    false
  ),
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
  })
)(Agent);

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  position: relative;
  flex: 1;
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
  // grid-template-columns: 1fr 2fr
  padding: 16px;
  padding-top: 0;
`;
