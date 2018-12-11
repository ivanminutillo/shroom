import * as React from "react";
import * as ReactDOM from "react-dom";
import {SFC} from 'react'
// import Login from "./pages/login";
import { Query, graphql, ApolloProvider } from "react-apollo";
import registerServiceWorker from "./registerServiceWorker";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { compose } from "recompose";
import { client } from "./store";
// import AppTemplate from "./templates/AppTemplate";
// import { PrivateRoute } from "./helpers/router";
// import Notifications from "./components/notificationTemplate";
import getNotification from "./queries/getNotifications";
import updateNotification from "./mutations/updateNotification";
import deleteNotification from "./mutations/deleteNotification";
import styled, { createGlobalStyle, ThemeProvider, StyledThemeInterface } from "./style/styled";
import {shroom} from "./style/index";

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
    background: #e6ecf0;
    background: #272a2c;
  }
  .vis-timeline {
    visibility: visible !important
  }
  a {
    color: ${(props: StyledThemeInterface) => props.theme.color.p100};
    font-size: ${(props: StyledThemeInterface) => props.theme.fontSize.h3};
  }
  h1 {
    color: ${(props: StyledThemeInterface) => props.theme.color.p100};
    font-size: ${(props: StyledThemeInterface) => props.theme.fontSize.h1};
    margin: 0;
    padding: 0;
    line-height: ${(props: StyledThemeInterface) => props.theme.fontSize.h1};
    font-weight: 500;
  }
  h2 {
    color: ${(props: StyledThemeInterface) => props.theme.color.p100};
    font-size: ${(props: StyledThemeInterface) => props.theme.fontSize.h2};
    margin: 0;
    padding: 0;
    line-height: ${(props: StyledThemeInterface) => props.theme.fontSize.h2};
    font-weight: 500;
  }
  h3 {
    color: ${(props: StyledThemeInterface) => props.theme.color.p100};
    font-size: ${(props: StyledThemeInterface) => props.theme.fontSize.h3};
    margin: 0;
    padding: 0;
    line-height: ${(props: StyledThemeInterface) => props.theme.fontSize.h3};
    font-weight: 500;
  }
  p {
    color: ${(props: StyledThemeInterface) => props.theme.color.p200};
    font-size: ${(props: StyledThemeInterface) => props.theme.fontSize.p};
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

// interface NotificationProps {
//   notifications: Array<Notification>
//   deleteNotification: any
// }

// interface Notification {

// }

// const NotificationsTemplate: SFC<NotificationProps> = props => {
//   return (
//     <GenericAlert>
//       <Notifications
//         notifications={props.notifications}
//         dismiss={props.deleteNotification}
//       />
//     </GenericAlert>
//   );
// };

// const EhnanchedNotifications = compose(
//   graphql(updateNotification, { name: "updateNotification" }),
//   graphql(deleteNotification, { name: "deleteNotification" })
// )(NotificationsTemplate);

ReactDOM.render(
  <ThemeProvider theme={shroom}>
    <ApolloProvider client={client}>
      <Router>
          <>

          {/* <Query query={getNotification}>
            {({ data: { notifications } }) => {
              return <EhnanchedNotifications notifications={notifications} />;
            }}
          </Query> */}
          <h1>test</h1>
          {/* <Switch> */}
            {/* <Route path="/login" component={Login} /> */}
            {/* <PrivateRoute
              path="/"
              component={AppTemplate}
              redirectTo="/login"
            /> */}

          {/* </Switch> */}
            <GlobalStyle />
          </>
      </Router>
    </ApolloProvider>
  </ThemeProvider>,
  document.getElementById("root")
);
registerServiceWorker();
