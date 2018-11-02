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

export default props => {
  return (
    <ApolloConsumer>
      {client => (
        <Wrapper isSidebarOpen={props.isSidebarOpen}>
          <PropsRoute
            exact
            path={props.match.path}
            component={Home}
            onToggleSidebar={props.onToggleSidebar}
            
            togglePanel={props.togglePanel}
            isSidebarOpen={props.isSidebarOpen}
            client={client}
            providerId={props.providerId}
            providerImage={props.providerImage}
            providerName={props.providerName}
          />
          <PropsRoute
            onToggleSidebar={props.onToggleSidebar}
            path="/agent/:id"
            component={Agent}
            exact
            data={props}
            
            togglePanel={props.togglePanel}
            providerImage={props.providerImage}
            providerId={props.providerId}
            isSidebarOpen={props.isSidebarOpen}
            client={client}
            providerName={props.providerName}
          />
          <PropsRoute
            exact
            path='/committed'
            component={committed}
            profile
            onToggleSidebar={props.onToggleSidebar}
            
            togglePanel={props.togglePanel}
            isSidebarOpen={props.isSidebarOpen}
            client={client}
            providerId={props.providerId}
            providerImage={props.providerImage}
            providerName={props.providerName}
          />
          <PropsRoute
            exact
            path='/matched'
            component={matched}
            profile
            onToggleSidebar={props.onToggleSidebar}
            
            togglePanel={props.togglePanel}
            isSidebarOpen={props.isSidebarOpen}
            client={client}
            providerId={props.providerId}
            providerName={props.providerName}
            providerImage={props.providerImage}
          />
          
          <PropsRoute
            onToggleSidebar={props.onToggleSidebar}
            path="/agent/:id/committed"
            component={committed}
            exact
            
            togglePanel={props.togglePanel}
            providerImage={props.providerImage}
            providerId={props.providerId}
            providerName={props.providerName}
            isSidebarOpen={props.isSidebarOpen}
            client={client}
          />
          <PropsRoute
            onToggleSidebar={props.onToggleSidebar}
            path="/agent/:id/matched"
            component={matched}
            exact
            
            togglePanel={props.togglePanel}
            providerImage={props.providerImage}
            providerId={props.providerId}
            providerName={props.providerName}
            loggedUser={props.data.id}
            isSidebarOpen={props.isSidebarOpen}
            client={client}
          />
          
          <PropsRoute
            onToggleSidebar={props.onToggleSidebar}
            path="/plan/:id"
            component={Plan}
            data={props}
            
            togglePanel={props.togglePanel}
            providerId={props.providerId}
            isSidebarOpen={props.isSidebarOpen}
            client={client}
          />
          <PropsRoute
            onToggleSidebar={props.onToggleSidebar}
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


