import { Mutation } from "react-apollo";
import DELETE_EVENT from "../../mutations/deleteEvent";
import { Icons } from "oce-components";
import React from "react";
import styled from "styled-components";
import updateNotification from "../../mutations/updateNotification";
import deleteNotification from "../../mutations/deleteNotification";
import { compose } from "recompose";
import { graphql } from "react-apollo";
import gql from "graphql-tag";

export default compose(
  graphql(deleteNotification, { name: "deleteNotification" }),
  graphql(updateNotification, { name: "updateNotification" })
)(
  ({
    eventId,
    commitmentId,
    scopeId,
    updateNotification,
    deleteNotification
  }) => {
    return (
      <Mutation
        mutation={DELETE_EVENT}
        onError={e => {
          const errors = e.graphQLErrors.map(error => error.message);
          updateNotification({
            variables: {
              message: (
                <div style={{ fontSize: "14px", color: "#f0f0f0" }}>
                  <span style={{ marginRight: "10px", verticalAlign: "sub" }}>
                    <Icons.Cross width="18" height="18" color="white" />
                  </span>
                  {errors}
                </div>
              ),
              type: "alert"
            }
          }).then(res => {
            setTimeout(() => {
              deleteNotification({
                variables: { id: res.data.addNotification.id }
              });
            }, 1000);
          });
        }}
        onCompleted={res => {
          updateNotification({
            variables: {
              message: (
                <div style={{ fontSize: "14px", color: "#f0f0f0" }}>
                  <span style={{ marginRight: "10px", verticalAlign: "sub" }}>
                    <Icons.Bell width="18" height="18" color="white" />
                  </span>
                  Event deleted successfully!
                </div>
              ),
              type: "success"
            }
          }).then(res => {
            setTimeout(() => {
              deleteNotification({
                variables: { id: res.data.addNotification.id }
              });
            }, 1000);
          });
        }}
        update={(store, { data: { deleteEconomicEvent } }) => {
          const commitment = store.readFragment({
            id: `Commitment-${commitmentId}`,
            fragment: gql`
              fragment myCommitment on Commitment {
                fulfilledBy {
                  fulfilledBy {
                    id
                    action
                  }
                }
              }
            `
          });
          const events = store.readFragment({
            id: `${
              deleteEconomicEvent.economicEvent.scope.__typename
            }-${scopeId}`,
            fragment: gql`
              fragment myScope on Agent {
                id
                agentEconomicEvents(latestNumberOfDays: 30) {
                  id
                }
              }
            `
          });
          let eventIndex = events.agentEconomicEvents.findIndex(
            ev => ev.id === eventId
          );
          events.agentEconomicEvents.splice(eventIndex, 1);
          store.writeFragment({
            id: `${
              deleteEconomicEvent.economicEvent.scope.__typename
            }-${scopeId}`,
            fragment: gql`
              fragment myAgent on Agent {
                id
                agentEconomicEvents(latestNumberOfDays: 30) {
                  id
                  action
                }
              }
            `,
            data: events
          });

          if (commitment) {
            let eventIndexFromCommitment = commitment.fulfilledBy.findIndex(
              ev => ev.fulfilledBy.id === eventId
            );
            commitment.fulfilledBy.splice(eventIndexFromCommitment, 1);
            store.writeFragment({
              id: `Commitment-${commitmentId}`,
              fragment: gql`
                fragment myCommitment on Commitment {
                  fulfilledBy {
                    fulfilledBy {
                      id
                      action
                    }
                  }
                }
              `,
              data: commitment
            });
          }
        }}
      >
        {(deleteEvent, { data }) => (
          <Action
            onClick={() =>
              deleteEvent({
                variables: {
                  token: localStorage.getItem("oce_token"),
                  id: eventId
                }
              })
            }
          >
            <Span>
              <Icons.Trash width="16" color="#99ADC6" />
            </Span>
            <ActionTitle>Delete</ActionTitle>
          </Action>
        )}
      </Mutation>
    );
  }
);

const ActionTitle = styled.h3`
  margin-left: 4px;
  font-weight: 500;
  margin-left: 8px;
  float: left;
  display: inline-block;
  height: 20px;
  line-height: 32px;
  font-size: 12px;
  letter-spacing: 1px;
  color: ${props => props.theme.color.p300};
`;

const Action = styled.div`
  cursor: pointer;
  float: left;
  margin-right: 8px;
  transition: background-color 0.5s ease;
`;

const Span = styled.span`
  vertical-align: sub;
  margin-right: ${props => (props.withText ? "8px" : 0)}
  float: left;
  height: 30px;
  line-height: 30px;
  & svg {
    height: 30px;
  }
`;
