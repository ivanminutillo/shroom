import * as React from "react";
import gql from "graphql-tag";
import { compose, withHandlers, withState } from "recompose";
import styled from "styled-components";
import { LoadingMini, ErrorMini } from "../../components/loading";
import LeftPanel from "../../components/leftPanel/leftPanel";
import Main from "../../components/main";
import SettingModal from "../../pages/settings";
import Header from './header'
import { Query } from "react-apollo";
import ValidationModal from "../../components/modalValidation";

const Surface = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Overlay = styled.div`
  position: absolute;
  z-index: 9;
  top: 0;
  bottom: 0;
  left: 270px;
  right: 0;
  background: rgba(0, 0, 0, 0.2);
  cursor: pointer;
`;

const AppTemplate = props => {
  return (
    <Query
      query={agentRelationships}
      variables={{
        token: localStorage.getItem("oce_token")
      }}
    >
      {({ loading, error, data, refetch, client }) => {
        if (loading) return <LoadingMini />;
        if (error)
          return (
            <ErrorMini refetch={refetch} message={`Error! ${error.message}`} />
          );

        return (
          <Surface>
            <Header
              handleGroup={props.handleGroup}
              history={props.history}
              providerId={data.viewer.myAgent.id}
              providerImage={data.viewer.myAgent.image}
              providerName={data.viewer.myAgent.name}
              togglePanel={props.onTogglePanel}
              togglenewRequirementModal={props.togglenewRequirementModal}
              toggleValidationModal={props.toggleValidationModal}
            />
              <Main
                onToggleSidebar={props.onToggleSidebar}
                data={data.viewer.myAgent}
                match={props.match}
                togglePanel={props.onTogglePanel}
                isSidebarOpen={props.isSidebarOpen}
                providerId={data.viewer.myAgent.id}
                providerImage={data.viewer.myAgent.image}
                providerName={data.viewer.myAgent.name}
                toggleValidationModal={props.toggleValidationModal}
              />
              <LeftPanel
                data={data.viewer.myAgent}
                togglePanel={props.onTogglePanel}
                active={props.isOpen}
                toggleSettings={props.onToggleSettings}
              />
              {props.isOpen ? <Overlay onClick={props.onTogglePanel} /> : null}
            <SettingModal
              modalIsOpen={props.isSettingsOpen}
              toggleModal={props.onToggleSettings}
              providerId={data.viewer.myAgent.id}
            />

          <ValidationModal
            modalIsOpen={props.validationModalIsOpen}
            toggleModal={props.toggleValidationModal}
            contributionId={props.validationModalId}
            myId={data.viewer.myAgent.id}
          />
          {/* <NewRequirementModal
            modalIsOpen={props.newRequirementModalIsOpen}
            toggleModal={props.togglenewRequirementModal}
            scopeId={props.match.params.id}
          /> */}

          </Surface>
        );
      }}
    </Query>
  );
};

const agentRelationships = gql`
  query($token: String) {
    viewer(token: $token) {
      myAgent {
        id
        name
        image
      }
    }
  }
`;

export default compose(
  withState(
    "newRequirementModalIsOpen",
    "togglenewRequirementModalIsOpen",
    false
  ),
  withState("validationModalIsOpen", "toggleValidationModalIsOpen", false),
  withState("validationModalId", "selectValidationModalId", null),
  withState("group", "onGroup", "all"),
  withHandlers({
    handleGroup: props => val => {
      props.onGroup(val.value);
      if (val.value !== "all") {
        return props.history.push("/agent/" + val.value);
      } else {
        return props.history.push("/");
      }
    }
  }),
  withState("isOpen", "togglePanel", false),
  withState("isSidebarOpen", "toggleSidebar", false),
  withState("isSettingsOpen", "toggleSettings", false),
  withHandlers({
    onToggleSettings: props => () => {
      props.toggleSettings(!props.isSettingsOpen);
      if (props.isOpen && props.isSidebarOpen) {
        return props.toggleSidebar(!props.isSidebarOpen);
      }
      return null;
    },
    onTogglePanel: props => () => {
      props.togglePanel(!props.isOpen);
      if (props.isOpen && props.isSidebarOpen) {
        return props.toggleSidebar(!props.isSidebarOpen);
      }
      return null;
    },
    onToggleSidebar: props => () => props.toggleSidebar(!props.isSidebarOpen),
    togglenewRequirementModal: props => () => {
      props.togglenewRequirementModalIsOpen(!props.newRequirementModalIsOpen);
    },
    toggleValidationModal: props => contributionId => {
      props.selectValidationModalId(contributionId);
      props.toggleValidationModalIsOpen(!props.validationModalIsOpen);
    }
  })
)(AppTemplate);
