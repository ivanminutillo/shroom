import React from "react";
import ReactDOM from "react-dom";
import Login from "./pages/login";
import { Query, graphql } from "react-apollo";
import registerServiceWorker from "./registerServiceWorker";
import { MemoryRouter as Router, Route, Switch } from "react-router-dom";
import { compose } from "recompose";
import { ApolloProvider } from "react-apollo";
import { client } from "./store";
import AppTemplate from "./templates/AppTemplate";
import { PrivateRoute } from "./helpers/router";
import { Notifications } from "oce-components/build";
import getNotification from "./queries/getNotifications";
import updateNotification from "./mutations/updateNotification";
import deleteNotification from "./mutations/deleteNotification";
import styled, { createGlobalStyle, ThemeProvider } from "styled-components";
import Dark from "./style/themeDark";

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css?family=Fira+Sans:300,400,400i,500,500i,700');
  * {box-sizing: border-box}
  body {
    padding: 0;
    margin: 0;
    font-family: 'Fira Sans', sans-serif;
    text-rendering: optimizelegibility;
    font-feature-settings: "kern";
    text-size-adjust: none;
    width: 100%;
    height: 100%;
    padding: 0;
    background: ${props => props.theme.color.p900};
  }
  .vis-timeline {
    visibility: visible !important
  }
  a {
    color: ${props => props.theme.color.p100};
    font-size: ${props => props.theme.fontSize.h3};
  }
  h1 {
    color: ${props => props.theme.color.p100};
    font-size: ${props => props.theme.fontSize.h1};
    margin: 0;
    padding: 0;
    line-height: ${props => props.theme.fontSize.h1};
    font-weight: 500;
  }
  h2 {
    color: ${props => props.theme.color.p100};
    font-size: ${props => props.theme.fontSize.h2};
    margin: 0;
    padding: 0;
    line-height: ${props => props.theme.fontSize.h2};
    font-weight: 500;
  }
  h3 {
    color: ${props => props.theme.color.p100};
    font-size: ${props => props.theme.fontSize.h3};
    margin: 0;
    padding: 0;
    line-height: ${props => props.theme.fontSize.h3};
    font-weight: 500;
  }
  p {
    color: ${props => props.theme.color.p200};
    font-size: ${props => props.theme.fontSize.p};
    margin: 0;
    padding: 0;
    line-height: 20px;
    font-weight: 400;
    letter-spacing: .5;
  }
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-corner {
      background: transparent;
  }

  ::-webkit-scrollbar-thumb {
      border-radius: 0;
  }

  ::-webkit-scrollbar-thumb {
      background: #313543;
      border: 0 none #fff;
  }

  ::-webkit-scrollbar-track {
      border: 0 none #fff;
      border-radius: 0;
      background: rgba(0,0,0,.1);
  }
 
`;

const GenericAlert = styled.div`
  position: fixed;
  top: 10px;
  width: 320px;
  right: 10px;
  z-index: 99999999999999999999999999999999;
`;
const NoMatch = ({ location }) => (
  <div>
    <h3>
      No match for <code>{location.pathname}</code>
    </h3>
  </div>
);

const NotificationsTemplate = props => {
  return (
    <GenericAlert>
      <Notifications
        notifications={props.notifications}
        dismiss={props.deleteNotification}
      />
    </GenericAlert>
  );
};

const EhnanchedNotifications = compose(
  graphql(updateNotification, { name: "updateNotification" }),
  graphql(deleteNotification, { name: "deleteNotification" })
)(NotificationsTemplate);

ReactDOM.render(
  <ThemeProvider theme={Dark}>
    <ApolloProvider client={client}>
      <Router>
        <div>
          <GlobalStyle />
          <Query query={getNotification}>
            {({ data: { notifications } }) => {
              return <EhnanchedNotifications notifications={notifications} />;
            }}
          </Query>
          <Switch>
            <Route path="/login" component={Login} />
            <PrivateRoute
              path="/"
              component={AppTemplate}
              redirectTo="/login"
            />
          </Switch>
        </div>
      </Router>
    </ApolloProvider>
  </ThemeProvider>,
  document.getElementById("root")
);
registerServiceWorker();
