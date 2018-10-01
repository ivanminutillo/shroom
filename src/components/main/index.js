import React from "react";
import styled, {css} from "styled-components";
import { withState, withHandlers, compose } from "recompose";
import { PropsRoute } from "../../helpers/router";
import Agent from "../../pages/agent";
import Wallet from "../../pages/wallet";
import media from 'styled-media-query'
import { ApolloConsumer } from 'react-apollo';


const Wrapper = styled.div`
display: flex;
flex: 1;
${media.lessThan("medium")`
  ${props =>
    props.isSidebarOpen &&
    css`
      display: none;
    `} 
  `};
`

const Main = props => {
  return (
    <ApolloConsumer>
    {client => (
    <Wrapper isSidebarOpen={props.isSidebarOpen}>
      <PropsRoute
        exact
        path={props.match.path}
        component={Agent}
        id={props.data.id}
        data={props}
        toggleLeftPanel={props.toggleLeftPanel}
        onTogglePanel={props.onTogglePanel}
        isSidebarOpen={props.isSidebarOpen}
        providerId={props.providerId}
        client={client}
      />
      <PropsRoute
        toggleLeftPanel={props.toggleLeftPanel}
        path="/agent/:id"
        component={Agent}
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
