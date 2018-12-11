import { Mutation } from "react-apollo";
import DELETE_EVENT from "../../mutations/deleteEvent";
import Icons from '../../atoms/icons.tsx'
import React from "react";
import styled from "styled-components";
import { compose } from "recompose";
import gql from "graphql-tag";
import withNotif from "../notification";

export default compose(
  withNotif("Event successfully deleted", "error! evet had not been deleted")
)(({ eventId, commitmentId, onError, onSuccess }) => {
  return (
    <Mutation
      mutation={DELETE_EVENT}
      onError={e => onError()}
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
        onSuccess()
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
            <Icons.Trash width="13" color="#989ba0" />
          </Span>
          <ActionTitle>Delete</ActionTitle>
        </Action>
      )}
    </Mutation>
  );
});

const ActionTitle = styled.h3`
  margin-left: 4px;
  font-weight: 400;
  margin-left: 8px;
  display: inline-block;
  height: 20px;
  line-height: 32px;
  font-size: 12px;
  letter-spacing: 1px;
  color: ${props => props.theme.color.p200};
`;

const Action = styled.div`
  cursor: pointer;
  float: left;
  position: relative;
  padding-right: 8px;
  margin-right: 24px;
  transition: background-color 0.5s ease;
  &:after {
    position: absolute;
    content: "";
    width: 2px;
    height: 2px;
    background: ${props => props.theme.color.p200};
    display: block;
    right: -8px;
    top: 15px;
    border-radius: 100px;
  }
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
