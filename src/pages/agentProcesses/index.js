import React from "react";
import styled from "styled-components";
import Header from "../agent/header";
import media from "styled-media-query";
import setInbox from "../../mutations/setInbox";
import setCommitted from "../../mutations/setCommitted";
import { Query } from "react-apollo";
import { LoadingMini, ErrorMini } from "../../components/loading";
import { PropsRoute } from "../../helpers/router";
import Todo from "../../components/todo";
import Sidebar from "../../components/sidebar/sidebar";
import { compose, withState, withHandlers } from "recompose";
import getAgentProcesses from "../../queries/getAgentProcesses";
import processTodo from "../../components/processTodo";
export default compose(
  withState("event", "onEvent", "all"),
  withHandlers({
    handleEvent: props => val => props.onEvent(val.value)
  })
)(props => {
  return (
    <Body>
      <Sidebar
        profile="true"
        isopen={props.isopen}
        param={props.match.params.id}
        location={props.location}
      />
      <Query
        query={getAgentProcesses}
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
          let processes = data.viewer.agent.agentProcesses;
          // INBOX
          let inbox = processes.filter(i => !i.isFinished);
          let completed = processes.filter(i => i.isFinished);

          return (
            <Wrapper isopen={props.isopen}>
              <Header
                image={data.viewer.agent.image}
                name={data.viewer.agent.name}
                toggleLeftPanel={props.toggleLeftPanel}
                togglePanel={props.togglePanel}
                handleEvent={props.handleEvent}
              />
              <Content>
                <Inside>
                  <Overview>
                    <div>
                      <PropsRoute
                        exact
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
                      />
                    </div>
                  </Overview>
                </Inside>
              </Content>
            </Wrapper>
          );
        }}
      </Query>
    </Body>
  );
});

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
