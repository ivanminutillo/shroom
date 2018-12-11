import React from "react";
import { Query } from "react-apollo";
import { LoadingMini, ErrorMini } from "../../components/loading/index.tsx";
import getCommitments from "../../queries/getCommitments";
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
            
      return (
        <div style={{ display: "flex", height: "100%" }}>
          <PropsRoute
            exact
            filter={props.filter}
            onFilter={props.onFilter}
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
          />
         
        </div>
      );
    }}
  </Query>
));
