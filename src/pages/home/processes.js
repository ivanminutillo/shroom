import React from "react";
import { Query } from "react-apollo";
import { LoadingMini, ErrorMini } from "../../components/loading";
import { PropsRoute } from "../../helpers/router";
import getAgentProcesses from "../../queries/getAgentProcesses";
import processTodo from "../../components/processTodo";
import ProcessModal from "../process/wrapper";

export default props => (
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
      let processes = data.viewer.agent.agentProcesses;
      // INBOX
      let inbox = processes.filter(i => !i.isFinished);
      let completed = processes.filter(i => i.isFinished);

      return (
        <div>
           <PropsRoute
            component={ProcessModal}
            path={"/processes/:id"}
              modalIsOpen={props.processModalIsOpen}
              history={props.history}
              toggleModal={props.handleProcess}
            />
          <PropsRoute
            component={processTodo}
            activeProcesses={inbox}
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
          <PropsRoute
            component={processTodo}
            exact
            path={"completed"}
            activeProcesses={completed}
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
);
