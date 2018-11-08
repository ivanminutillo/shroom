import React from "react";
import styled from "styled-components";
import Header from "./header";
import media from "styled-media-query";
import SmartSentence from "../../components/smartSentence";
import { ApolloConsumer } from "react-apollo";
import { Query } from "react-apollo";
import { LoadingMini, ErrorMini } from "../../components/loading";
import getCommitments from "../../queries/getCommitments";
import setInbox from "../../mutations/setInbox";
import Todo from "../../components/todo";
import { PropsRoute } from "../../helpers/router";
import Sidebar from "../../components/sidebar/sidebar";
import { compose, withState, withHandlers } from "recompose";
import setCommitted from "../../mutations/setCommitted";

export default compose(
  withState('event', 'onEvent', 'all'),
  withHandlers({
    handleEvent: props => (val) => (props.onEvent(val.value))
  })
)(props => {
  return (
    <Body>
      <Sidebar isopen={props.isopen} param={props.match.params.id} />
      <Wrapper isopen={props.isopen}>
        <Content>
          <Inside>
            <Query
              query={getCommitments}
              variables={{
                token: localStorage.getItem("oce_token"),
                id: props.match.params.id
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
                let intents = data.viewer.agent.agentCommitments;
                let filteredIntents = []
                if (props.event !== 'all') {
                  filteredIntents = intents.filter(i => i.action === props.event)
                } else {
                  filteredIntents = intents
                }
                // INBOX
                let inbox = filteredIntents.filter(i => !i.isFinished);
                let completed = filteredIntents.filter(i => i.isFinished);
                client.mutate({
                  mutation: setInbox,
                  variables: { total: filteredIntents.length }
                });
                // COMMITTED
                let allCommittedIntents = filteredIntents.filter(
                  int =>
                    int.provider ? int.provider.id === props.providerId : null
                );
                let committed = allCommittedIntents.filter(i => !i.isFinished);
                let committedCompleted = allCommittedIntents.filter(
                  i => i.isFinished
                );
                client.mutate({
                  mutation: setCommitted,
                  variables: { total: allCommittedIntents.length }
                });
                return (
                  <Overview>
                    <Header
                      image={data.viewer.agent.image}
                      name={data.viewer.agent.name}
                      toggleLeftPanel={props.toggleLeftPanel}
                      togglePanel={props.togglePanel}
                      handleEvent={props.handleEvent}
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
                    <PropsRoute
                      exact
                      component={Todo}
                      activeIntents={inbox}
                      completed={completed}
                      path={props.match.path}
                      onToggleSidebar={props.onToggleSidebar}
                      togglePanel={props.togglePanel}
                      isSidebarOpen={props.isSidebarOpen}
                      client={client}
                      providerId={props.providerId}
                      providerImage={props.providerImage}
                      providerName={props.providerName}
                      toggleValidationModal={props.toggleValidationModal}
                      isCommittedOpen={props.isCommittedOpen}
                      handleCommittedOpen={props.handleCommittedOpen}
                      isCompletedOpen={props.isCompletedOpen}
                      handleCompletedOpen={props.handleCompletedOpen}
                    />
                    <PropsRoute
                      component={Todo}
                      exact
                      path={`/agent/${props.match.params.id}/committed`}
                      activeIntents={committed}
                      completed={committedCompleted}
                      onToggleSidebar={props.onToggleSidebar}
                      togglePanel={props.togglePanel}
                      isSidebarOpen={props.isSidebarOpen}
                      client={client}
                      providerId={props.providerId}
                      providerImage={props.providerImage}
                      providerName={props.providerName}
                      toggleValidationModal={props.toggleValidationModal}
                      isCommittedOpen={props.isCommittedOpen}
                      handleCommittedOpen={props.handleCommittedOpen}
                      isCompletedOpen={props.isCompletedOpen}
                      handleCompletedOpen={props.handleCompletedOpen}
                    />
                    <PropsRoute
                      component={Todo}
                      exact
                      path={`/agent/${props.match.params.id}/matched`}
                      activeIntents={inbox}
                      completed={completed}
                      onToggleSidebar={props.onToggleSidebar}
                      togglePanel={props.togglePanel}
                      isSidebarOpen={props.isSidebarOpen}
                      client={client}
                      providerId={props.providerId}
                      providerImage={props.providerImage}
                      providerName={props.providerName}
                      toggleValidationModal={props.toggleValidationModal}
                      isCommittedOpen={props.isCommittedOpen}
                      handleCommittedOpen={props.handleCommittedOpen}
                      isCompletedOpen={props.isCompletedOpen}
                      handleCompletedOpen={props.handleCompletedOpen}
                    />
                  </Overview>
                );
              }}
            </Query>
          </Inside>
        </Content>
      </Wrapper>
    </Body>
  );
});

const Body = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  position: relative;
  flex: 1;
  ${media.lessThan("medium")`
    display: ${props => (props.isopen ? "none" : "flex")}
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
