import React from "react";
import styled, { css } from "styled-components";
import { withState, withHandlers, compose } from "recompose";
import { PropsRoute } from "../../helpers/router";
import Agent from "../../pages/agent";
import Home from "../../pages/home";
import Wallet from "../../pages/wallet";
import media from "styled-media-query";
import { ApolloConsumer } from "react-apollo";
import Plan from "../../pages/plan";
import committed from "../../pages/committed";
import matched from "../../pages/matched";

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  border-left: 1px solid #1e2024;
  ${media.lessThan("medium")`
  ${props =>
    props.isSidebarOpen &&
    css`
      display: none;
    `} 
  `};
`;

const Main = props => {
  return (
    <ApolloConsumer>
      {client => (
        <Wrapper isSidebarOpen={props.isSidebarOpen}>
          <PropsRoute
            exact
            path={props.match.path}
            component={Home}
            toggleLeftPanel={props.toggleLeftPanel}
            onTogglePanel={props.onTogglePanel}
            isSidebarOpen={props.isSidebarOpen}
            client={client}
            providerId={props.providerId}
            providerId={props.providerId}
          />
          <PropsRoute
            exact
            path='/committed'
            component={committed}
            profile
            toggleLeftPanel={props.toggleLeftPanel}
            onTogglePanel={props.onTogglePanel}
            isSidebarOpen={props.isSidebarOpen}
            client={client}
            providerId={props.providerId}
            providerId={props.providerId}
          />
          <PropsRoute
            exact
            path='/matched'
            component={matched}
            profile
            toggleLeftPanel={props.toggleLeftPanel}
            onTogglePanel={props.onTogglePanel}
            isSidebarOpen={props.isSidebarOpen}
            client={client}
            providerId={props.providerId}
            providerId={props.providerId}
          />
          <PropsRoute
            toggleLeftPanel={props.toggleLeftPanel}
            path="/agent/:id"
            component={Agent}
            exact
            data={props}
            toggleLeftPanel={props.toggleLeftPanel}
            onTogglePanel={props.onTogglePanel}
            providerImage={props.providerImage}
            loggedUser={props.data.id}
            isSidebarOpen={props.isSidebarOpen}
            client={client}
          />
          
          <PropsRoute
            toggleLeftPanel={props.toggleLeftPanel}
            path="/plan/:id"
            component={Plan}
            data={props}
            toggleLeftPanel={props.toggleLeftPanel}
            onTogglePanel={props.onTogglePanel}
            providerId={props.providerId}
            isSidebarOpen={props.isSidebarOpen}
            client={client}
          />
          <PropsRoute
            toggleLeftPanel={props.toggleLeftPanel}
            id={props.data.id}
            path="/wallet"
            component={Wallet}
            data={props}
            providerId={props.providerId}
          />
        </Wrapper>
      )}
    </ApolloConsumer>
  );
};

export default compose(
  withState("isOpen", "togglePanel", false),
  withHandlers({
    onTogglePanel: props => () => props.togglePanel(!props.isOpen)
  })
)(Main);
