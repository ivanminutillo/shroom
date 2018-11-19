import React from "react";
import styled from "styled-components";
import Header from "../agent/header";
import media from "styled-media-query";
import setInbox from "../../mutations/setInbox";
import setCommitted from "../../mutations/setCommitted";
import { Query } from "react-apollo";
import { LoadingMini, ErrorMini } from "../../components/loading";
import getCommitments from "../../queries/getCommitments";
import { PropsRoute } from "../../helpers/router";
import { clearFix } from "polished";
import Todo from "../../components/todo";
import Select from "react-select";
import Sidebar from "../../components/sidebar/sidebar";
import setMatched from "../../mutations/setMatched";
import { compose, withState, withHandlers } from "recompose";
export default compose(
  withState("event", "onEvent", "all"),
  withHandlers({
    handleEvent: props => val => props.onEvent(val.value),
    openStuff: props => val => {
      if (val.value === "requirement") {
        return props.togglenewRequirementModal();
      } else if (val.value === "process") {
        return props.togglenewProcessModal();
      }
    }
  })
)(props => {
  return (
    <Body>
      <Sidebar
        profile="true"
        isopen={props.isopen}
        param={props.match.params.id}
        location={props.location}
        togglePanel={props.togglePanel}
        providerName={props.providerName}
        handleGroup={props.handleGroup}
      />
      <Wrapper isopen={props.isopen}>
        <Header
          image={props.providerImage}
          name={props.providerName}
          toggleLeftPanel={props.toggleLeftPanel}
          togglePanel={props.togglePanel}
          handleEvent={props.handleEvent}
        />
        <Content>
          <Inside>
            <Overview>
              <SmartSentence>
              <Img
                    style={{ backgroundImage: `url(${props.providerImage})` }}
                  />
                <WrapperNew>
                  <Select
                    styles={customStylesTwo}
                    onChange={props.openStuff}
                    value={{ value: null, label: "Add new..." }}
                    options={[
                      { value: "requirement", label: "Add a new requirement" },
                      { value: "process", label: "Add a new process" }
                    ]}
                  />
                </WrapperNew>
              </SmartSentence>
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
                      <ErrorMini
                        refetch={refetch}
                        message={`Error! ${error.message}`}
                      />
                    );
                  let intents = data.viewer.agent.agentCommitments;
                  let filteredIntents = [];
                  if (props.event !== "all") {
                    filteredIntents = intents.filter(
                      i => i.action === props.event
                    );
                  } else {
                    filteredIntents = intents;
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
                  let allmatchedIntents =
                    data.viewer.agent.commitmentsMatchingSkills;
                  let matched = allmatchedIntents.filter(i => !i.isFinished);
                  let matchedCompleted = allmatchedIntents.filter(
                    i => i.isFinished
                  );
                  client.mutate({
                    mutation: setMatched,
                    variables: { total: allmatchedIntents.length }
                  });
                  return (
                    <React.Fragment>
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
                        path={"/requirements/committed"}
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
            </Overview>
          </Inside>
        </Content>
      </Wrapper>
    </Body>
  );
});

const WrapperNew = styled.div`
  cursor: pointer;
  box-sizing: border-box;
  width: 180px;
  position: relative;
  z-index: 99999;
  margin-right: 16px;
  margin-top: 10px;
  flex: 1;
`;


const Img = styled.div`
  width: 34px;
  height: 34px;
  background: ${props => props.theme.color.p150};
  border-radius: 100px;
  display: inline-block;
  margin-right: 8px;
  margin-left: 16px;
  margin-top: 18px;
  vertical-align: middle;
  background-size: cover;
`;

const SmartSentence = styled.div`
  height: 70px;
  background: #fff;
  display: flex;
  flex-direction: row;
  margin-bottom: 16px;
  border: 1px solid #dadada;
  border-radius: 4px;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  position: relative;
  flex: 1;
  margin-top: 8px;
  margin-left: 8px;
  min-height: 100vh;
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
  background:#f2f4f8;
`;

const Inside = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-content: center;
  position: relative;
  overflow-x: overlay;
  position: relative;
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

const customStylesTwo = {
  control: base => ({
    ...base,
    background: "#e3ebf2;",
    border: "0px solid #396ea6",
    color: "#32211B80",
    fontWeight: 500,
    fontSize: "13px",
    minHeight: "50px",
    height: "50px",
    borderRadius: "6px"
  }),
  input: base => ({
    ...base,
    color: "#32211B80",
    fontWeight: 500,
    fontSize: "13px",
    height: "50px",
    minHeight: "50px",

  }),
  singleValue: base => ({
    ...base,
    color: "#32211B80",
    fontWeight: 500,
    fontSize: "13px"
  }),
  option: base => ({
    ...base,
    fontSize: "13px"
  }),
  menuList: base => ({
    ...base,
    fontSize: "13px"
  }),
  placeholder: base => ({
    ...base,
    color: "#32211B80",
    fontWeight: 500,
    fontSize: "13px"
  })
};
