import React from "react";
import { Query } from "react-apollo";
import { LoadingMini, ErrorMini } from "../../components/loading";
import getCommitments from "../../queries/getCommitments";
import { PropsRoute } from "../../helpers/router";
import Todo from "../../components/todo";
import { compose, withState } from "recompose";

export default compose(
  withState('filter', 'onFilter', null),
)(props => (
  <Query
    query={getCommitments}
    variables={{
      token: localStorage.getItem("oce_token"),
      id: props.providerId
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
      // MATCHED
      let allmatchedIntents = data.viewer.agent.commitmentsMatchingSkills;
      let matched = allmatchedIntents.filter(i => !i.isFinished);
      let matchedCompleted = allmatchedIntents.filter(i => i.isFinished);
      return (
        <React.Fragment>
          <PropsRoute
            exact
            component={Todo}
            activeIntents={filteredIntents}
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

            filter={props.filter}
            onFilter={props.onFilter}
          />
          <PropsRoute
            component={Todo}
            exact
            path={"/requirements/matched"}
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
        </React.Fragment>
      );
    }}
  </Query>
));
