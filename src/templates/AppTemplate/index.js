import * as React from "react";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import { withRouter } from "react-router-dom";
import { compose, withHandlers, withState } from "recompose";
import styled from "styled-components";
import updateNotification from "../../mutations/updateNotification";
import deleteNotification from "../../mutations/deleteNotification";
import { LoadingMini, ErrorMini } from "../../components/loading";
import LeftPanel from "../../components/leftPanel/leftPanel";
import Sidebar from "../../components/sidebar/sidebar";
import Main from "../../components/main";
import SettingModal from '../../pages/settings'

const Wrapper = styled.div`
  height: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: row;
`;

const Surface = styled.div`
  height: 100%;
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
  return props.loading ? (
    <LoadingMini />
  ) : props.error ? (
    <div style={{ padding: "20px" }}>
      <ErrorMini
        refetch={props.refetch}
        message={`Error! ${props.error.message}`}
      />
    </div>
  ) : (
    <Surface>
      <Wrapper>
        <Sidebar
          agents={props.data.agentRelationships}
          togglePanel={props.onTogglePanel}
          data={props.data}
          theme={props.theme}
          isOpen={props.isSidebarOpen}
          toggleSidebar={props.onToggleSidebar}
          history={props.history}
        />
        <Main
          toggleLeftPanel={props.onToggleSidebar}
          data={props.data}
          match={props.match}
          isSidebarOpen={props.isSidebarOpen}
          providerId={props.data.id}
          providerImage={props.data.image}
        />
        <LeftPanel
          data={props.data}
          togglePanel={props.onTogglePanel}
          active={props.isOpen}
          toggleSettings={props.onToggleSettings}
        />
        {props.isOpen ? <Overlay onClick={props.onTogglePanel} /> : null}
      </Wrapper>
      <SettingModal 
        modalIsOpen={props.isSettingsOpen}
        toggleModal={props.onToggleSettings}
        providerId={props.data.id}
      />
    </Surface>
  );
};

const agentRelationships = gql`
  query($token: String) {
    viewer(token: $token) {
      myAgent {
        id
        name
        image
        agentRelationships {
          object {
            id
            name
            note
            image
          }
        }
      }
    }
  }
`;
const App = withRouter(AppTemplate);

export default compose(
  graphql(updateNotification, { name: "updateNotification" }),
  graphql(deleteNotification, { name: "deleteNotification" }),
  graphql(agentRelationships, {
    options: props => ({
      variables: {
        token: localStorage.getItem("oce_token")
      }
    }),
    props: ({ ownProps, data: { viewer, loading, error, refetch } }) => ({
      loading,
      error,
      refetch,
      data: viewer ? viewer.myAgent : null
    })
  }),
  withState("isOpen", "togglePanel", false),
  withState("isSidebarOpen", "toggleSidebar", false),
  withState("isSettingsOpen", "toggleSettings", false),
  withHandlers({
    onToggleSettings: props => () => {
      props.toggleSettings(!props.isSettingsOpen)
      if (props.isOpen && props.isSidebarOpen) {
        return props.toggleSidebar(!props.isSidebarOpen)
      }
      return null
    },
    onTogglePanel: props => () => {
      props.togglePanel(!props.isOpen)
      if (props.isOpen && props.isSidebarOpen) {
        return props.toggleSidebar(!props.isSidebarOpen)
      }
      return null
    },
    onToggleSidebar: props => () => props.toggleSidebar(!props.isSidebarOpen)
  })
)(App);
