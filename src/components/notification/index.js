import Icons from '../../atoms/icons.tsx'
import updateNotification from "../../mutations/updateNotification";
import deleteNotification from "../../mutations/deleteNotification";
import React, { createFactory } from "react";
import { ApolloConsumer } from "react-apollo";

export default (onSuccessMessage, onErrorMessage) => BaseComponent => {
  const factory = createFactory(BaseComponent);
  const WithNotification = props => {
    return (
      <ApolloConsumer>
        {client => {
          const onErrorNotif = () =>
            client
              .mutate({
                mutation: updateNotification,
                variables: {
                  message: (
                    <div style={{ fontSize: "14px", color: "#f0f0f0" }}>
                      <span
                        style={{ marginRight: "10px", verticalAlign: "sub" }}
                      >
                        <Icons.Cross width="18" height="18" color="white" />
                      </span>
                      {onErrorMessage}
                    </div>
                  ),
                  type: "alert"
                }
              })
              .then(res =>
                setTimeout(() => {
                  return client.mutate({
                    mutation: deleteNotification,
                    variables: { id: res.data.addNotification.id }
                  });
                }, 1000)
              );
          const onSuccessNotif = () =>
            client
              .mutate({
                mutation: updateNotification,
                variables: {
                  message: (
                    <div style={{ fontSize: "14px", color: "#f0f0f0" }}>
                      <span
                        style={{ marginRight: "10px", verticalAlign: "sub" }}
                      >
                        <Icons.Bell width="18" height="18" color="white" />
                      </span>
                      {onSuccessMessage}
                    </div>
                  ),
                  type: "success"
                }
              })
              .then(res =>
                setTimeout(() => {
                  return client.mutate({
                    mutation: deleteNotification,
                    variables: { id: res.data.addNotification.id }
                  });
                }, 1000)
              );
          return factory({
            ...props,
            onError: onErrorNotif,
            onSuccess: onSuccessNotif
          });
        }}
      </ApolloConsumer>
    );
  };
  return WithNotification;
};

