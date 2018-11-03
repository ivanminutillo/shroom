import React from "react";
import styled from "styled-components";
import Header from "../agent/header";
import { graphql } from "react-apollo";
import media from "styled-media-query";
import { compose, withState, withHandlers } from "recompose";
import deleteNotification from "../../mutations/deleteNotification";
import updateNotification from "../../mutations/updateNotification";
import HeaderTitle from "../../components/agentSectionHeader";
import Intent from "../../components/agentintents/intents";
import { Query } from "react-apollo";
import { LoadingMini, ErrorMini } from "../../components/loading";
import getAllCommitments from "../../queries/getAllCommitments";
import Sidebar from "../../components/sidebar/sidebar";

const Agent = props => {
  return (
    <Body>
      <Sidebar
        isOpen={props.isSidebarOpen}
        param={props.match.params.id}
      />

      <Wrapper isOpen={props.isOpen}>
        <Header
          id={props.providerId}
          toggleLeftPanel={props.toggleLeftPanel}
          togglePanel={props.togglePanel}
        />
        <Content>
          <Inside>
            <Overview>
              <Query
                query={getAllCommitments}
                variables={{
                  token: localStorage.getItem("oce_token"),
                  id: props.providerId
                }}
              >
                {({ loading, error, data, client, refetch }) => {
                  if (loading) return <LoadingMini />;
                  if (error)
                    return (
                      <ErrorMini
                        refetch={refetch}
                        message={`Error! ${error.message}`}
                      />
                    );
                  let intents = [].concat(
                    ...data.viewer.agent.agentRelationships.map(
                      a => a.object.agentCommitments
                    )
                  );
                  let activeIntents = intents.filter(i => !i.isFinished);
                  let completed = intents.filter(i => i.isFinished);
                  return (
                    <EventsInfo>
                      <WrapperIntents>
                        <HeaderTitle
                          isOpen={props.isCommittedOpen}
                          action={props.handleCommittedOpen}
                          title={`Inbox (${activeIntents.length})`}
                        />
                        {props.isCommittedOpen ? (
                        <ContentIntents>
                          {activeIntents.map((intent, i) => (
                            <Intent
                              handleAddEvent={props.handleAddEvent}
                              addEvent={props.addEvent}
                              toggleModal={props.toggleModal}
                              key={i}
                              data={intent}
                              client={client}
                              scopeId={intent.scope.id}
                              myId={props.providerId}
                              providerImage={props.providerImage}
                            />
                          ))}
                        </ContentIntents>
                         ) : null}
                      </WrapperIntents>
                      <WrapperIntents>
                        <HeaderTitle
                          isOpen={props.isCompletedOpen}
                          action={props.handleCompletedOpen}
                          title={`Completed (${completed.length})`}
                        />
                         {props.isCompletedOpen ? (
                        <ContentIntents>
                          {completed.map((intent, i) => (
                            <Intent
                              handleAddEvent={props.handleAddEvent}
                              addEvent={props.addEvent}
                              toggleModal={props.toggleModal}
                              key={i}
                              data={intent}
                              client={client}
                              scopeId={intent.scope.id}
                              myId={props.providerId}
                              providerImage={props.providerImage}
                            />
                          ))}
                        </ContentIntents>
                        ) : null}
                      </WrapperIntents>
                    </EventsInfo>
                  );
                }}
              </Query>
            </Overview>
          </Inside>
        </Content>
      </Wrapper>
    </Body>
  );
};

export default compose(
  graphql(updateNotification, { name: "updateNotification" }),
  graphql(deleteNotification, { name: "deleteNotification" }),
  withState("intentModalIsOpen", "toggleIntentModalIsOpen", false),
  withState("intentModal", "selectIntentModal", null),
  withState("isCommittedOpen", "onCommittedOpen", true),
  withState("isCompletedOpen", "onCompletedOpen", false),
  withHandlers({
    handleCommittedOpen: props => () =>
      props.onCommittedOpen(!props.isCommittedOpen),
    handleCompletedOpen: props => () =>
      props.onCompletedOpen(!props.isCompletedOpen),
    toggleIntentModal: props => contributionId => {
      props.selectIntentModal(contributionId);
      props.toggleIntentModalIsOpen(!props.intentModalIsOpen);
    }
  })
)(Agent);

const Body = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
`;

const WrapperIntents = styled.div`
  position: relative;
`;

const ContentIntents = styled.div`
  overflow-y: scroll;
  margin: 0;
  padding: 0;
  width: 100%;
`;

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
  // grid-template-columns: 1fr 2fr
  padding: 16px;
  padding-top: 0;
`;
