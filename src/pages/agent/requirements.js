import React from "react";
import setCommitted from "../../mutations/setCommitted";
import { Query } from "react-apollo";
import { LoadingMini, ErrorMini } from "../../components/loading";
import getCommitments from "../../queries/getCommitments";
import setInbox from "../../mutations/setInbox";
import Todo from "../../components/todo";
import { PropsRoute } from "../../helpers/router";
import { compose, withState } from "recompose";

export default compose(
  withState('filter', 'onFilter', null),
)(props => (
  <Query
    query={getCommitments}
    variables={{
      token: localStorage.getItem("oce_token"),
      id: props.param
    }}
  >
    {({ loading, error, data, client, refetch }) => {
      if (loading) return <LoadingMini />;
      if (error)
        return (
          <ErrorMini refetch={refetch} message={`Error! ${error.message}`} />
        );
      let intents = data.viewer.agent.agentCommitments;
      let filteredIntents = [];
      if (props.filter === 'active') {
        filteredIntents = intents.filter(i => !i.isFinished);
      } else if (props.filter === 'completed') {
        filteredIntents = intents.filter(i => i.isFinished);
      } else if (props.filter === 'committed') {
        filteredIntents = intents.filter(i => i.provider ? i.provider.id === props.providerId : null);
      } else if (props.filter === 'without process') {
        filteredIntents = intents.filter(i => !i.inputOf && !i.outputOf)
      } else if (props.filter === 'with process') {
        filteredIntents = intents.filter(i => i.inputOf || i.outputOf)
      } else {
        filteredIntents = intents;
      }
      // if (props.filter) {
      //   filteredIntents = intents.filter(i => i.action === props.filter);
      // } else {
      //   filteredIntents = intents;
      // }
      // INBOX
      let inbox = filteredIntents.filter(i => !i.isFinished);
      let completed = filteredIntents.filter(i => i.isFinished);
      client.mutate({
        mutation: setInbox,
        variables: { total: filteredIntents.length }
      });
      // COMMITTED
      let allCommittedIntents = filteredIntents.filter(
        int => (int.provider ? int.provider.id === props.providerId : null)
      );
      let committed = allCommittedIntents.filter(i => !i.isFinished);
      let committedCompleted = allCommittedIntents.filter(i => i.isFinished);
      client.mutate({
        mutation: setCommitted,
        variables: { total: allCommittedIntents.length }
      });
      return (
        <div style={{ display: "flex", height: "100%" }}>
          <PropsRoute
            exact
            filter={props.filter}
            onFilter={props.onFilter}
            component={Todo}
            activeIntents={filteredIntents}
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
            path={`/agent/${props.match.params.id}/requirements/committed`}
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
            path={`/agent/${props.match.params.id}/requirements/matched`}
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
        </div>
      );
    }}
  </Query>
));
