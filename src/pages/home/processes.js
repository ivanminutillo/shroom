import React from "react";
import { Query } from "react-apollo";
import { LoadingMini, ErrorMini } from "../../components/loading/index.tsx";
import { PropsRoute } from "../../helpers/router";
import getAgentProcesses from "../../queries/getAgentProcesses";
import processTodo from "../../components/processTodo";
import ProcessModal from "../process/wrapper";
import { compose, withState } from "recompose";

export default compose(
  withState('filter', 'onFilter', null),
)(props => (
  <Query
    query={getAgentProcesses}
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
      let filteredProcesses= []
      let processes = data.viewer.agent.agentProcesses;
      if (props.filter === 'active') {
        filteredProcesses = processes.filter(i => !i.isFinished);
      } else if (props.filter === 'completed') {
        filteredProcesses = processes.filter(i => i.isFinished);
      } else {
        filteredProcesses = processes
      }

      return (
        <div>
           <PropsRoute
              component={ProcessModal}
              path={"/processes/:id"}
              modalIsOpen={props.processModalIsOpen}
              history={props.history}
              toggleModal={props.handleProcess}
              providerId={props.providerId}
            />
          <PropsRoute
            filter={props.filter}
            onFilter={props.onFilter}
            component={processTodo}
            activeProcesses={filteredProcesses}
            path={props.match.path}
            onToggleSidebar={props.onToggleSidebar}
            togglePanel={props.togglePanel}
            isSidebarOpen={props.isSidebarOpen}
            client={client}
            providerId={props.providerId}
            providerImage={props.providerImage}
            providerName={props.providerName}
            handleProcess={props.handleProcess}
          />
        </div>
      );
    }}
  </Query>
));
