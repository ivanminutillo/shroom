import React from "react";
import styled from "styled-components";
import Header from "../agent/header";
import media from "styled-media-query";
import setInbox from "../../mutations/setInbox";
import setCommitted from "../../mutations/setCommitted";
import { Query } from "react-apollo";
import { LoadingMini, ErrorMini } from "../../components/loading";
import getAllCommitments from "../../queries/getAllCommitments";
import { PropsRoute } from "../../helpers/router";
import Todo from "../../components/todo";
import Sidebar from "../../components/sidebar/sidebar";
import setMatched from '../../mutations/setMatched'
export default props => {
  return (
    <Body>
      <Sidebar profile isOpen={props.isOpen} param={props.match.params.id} />
      <Wrapper isOpen={props.isOpen}>
        <Header
          image={''}
          name={'All groups'}
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
                  // INBOX
                  let activeIntents = intents.filter(i => !i.isFinished);
                  let completed = intents.filter(i => i.isFinished);
                  client.mutate({
                    mutation: setInbox,
                    variables: { total: intents.length }
                  });
                  // COMMITTED
                  let allCommittedIntents = intents.filter(
                    int =>
                      int.provider ? int.provider.id === props.providerId : null
                  );
                  let committed = allCommittedIntents.filter(
                    i => !i.isFinished
                  );
                  let committedCompleted = allCommittedIntents.filter(
                    i => i.isFinished
                  );
                  client.mutate({
                    mutation: setCommitted,
                    variables: { total: allCommittedIntents.length }
                  });
                  // MATCHED
                  let allmatchedIntents = data.viewer.agent.commitmentsMatchingSkills
                  let matched = allmatchedIntents.filter(
                    i => !i.isFinished
                  );
                  let matchedCompleted = allmatchedIntents.filter(
                    i => i.isFinished
                  );
                  client.mutate({
                    mutation: setMatched,
                    variables: { total: allmatchedIntents.length }
                  });
                  console.log(matched)
                  return (
                    <div>
                      <PropsRoute
                        exact
                        component={Todo}
                        activeIntents={activeIntents}
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
                        path={"/committed"}
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
                        path={"/matched"}
                        activeIntents={matched}
                        completed={matchedCompleted}
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
                    </div>
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

const Body = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
`;
