import { Mutation } from "react-apollo";
import Icons from '../../atoms/icons.tsx'
import React from "react";
import styled from "styled-components";
import getComm from "../../queries/getCommitment";
import { compose } from "recompose";
import UPDATE_COMMITMENT from "../../mutations/updateCommitment";
import gql from "graphql-tag";
import withNotif from "../notification";

export default compose(
  withNotif("Provider is successfully updated", "Provider is not updated")
)(({ intentId, providerId, onError, onSuccess }) => {
  return (
    <Mutation
      mutation={UPDATE_COMMITMENT}
      onError={onError}
      update={(store, { data: { updateCommitment } }) => {
        let commCache = store.readQuery({
          query: getComm,
          variables: {
            token: localStorage.getItem("oce_token"),
            id: intentId
          }
        });
        commCache.provider = updateCommitment.commitment.provider;
        store.writeQuery({
          query: getComm,
          data: commCache
        });
        return onSuccess();
      }}
    >
      {(addProvider, { data }) => (
        <Span
          onClick={() =>
            addProvider({
              variables: {
                token: localStorage.getItem("oce_token"),
                id: intentId,
                providerId: providerId
              }
            })
          }
        >
          <Icons.Star width='18' height='18' color='#dadada'/>
        </Span>
      )}
    </Mutation>
  );
});

export const DeleteProvider = compose(
  withNotif("Provider is successfully updated", "Provider is not updated")
)(({ intentId, onError, onSuccess }) => {
  return (
    <Mutation
      mutation={UPDATE_COMMITMENT}
      onError={onError}
      update={(store, { data: { updateCommitment } }) => {
        const commitment = store.readFragment({
          id: `Commitment-${intentId}`,
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
        commitment.fulfilledBy.provider = null;
        store.writeFragment({
          id: `Commitment-${intentId}`,
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
        return onSuccess();
      }}
    >
      {(addProvider, { data }) => (
        <Span
          onClick={() =>
            addProvider({
              variables: {
                token: localStorage.getItem("oce_token"),
                id: intentId,
                providerId: 0
              }
            })
          }
        >
         <Icons.Star width='18' height='18' color='#FFD054'/>
        </Span>
      )}
    </Mutation>
  );
});

const Span = styled.span`
  display: inline-block;
  vertical-align: sub;
  margin-right: 8px;
`;
