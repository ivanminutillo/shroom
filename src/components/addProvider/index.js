import { Mutation } from "react-apollo";
import { Icons } from "oce-components";
import React from "react";
import styled from "styled-components";
import getComm from "../../queries/getCommitment";
import { compose } from "recompose";
import UPDATE_COMMITMENT from "../../mutations/updateCommitment";
import gql from "graphql-tag";
import withNotif from "../notification";

export default compose(withNotif("Provider is successfully updated", "Provider is not updated"))(
  ({ intentId, providerId, onError, onSuccess }) => {
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
          return onSuccess()
        }}
      >
        {(addProvider, { data }) => (
          <ImgSpan
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
            <Icons.Plus width="18" height="18" color="#8D8D8D" />
          </ImgSpan>
        )}
      </Mutation>
    );
  }
);

export const DeleteProvider = compose(withNotif("Provider is successfully updated", "Provider is not updated"))(
  ({ intentId, onError, onSuccess }) => {
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
          return onSuccess()
        }}
      >
        {(addProvider, { data }) => (
          <ImgSpan
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
            <Icons.Trash width="18" height="18" color="#8D8D8D" />
          </ImgSpan>
        )}
      </Mutation>
    );
  }
);

const ImgSpan = styled.div`
  float: left;
  width: 24px;
  height: 24px;
  border-radius: 2px;
  background-size: cover;
  background-repeat: no-repeat;
  background: #dedede;
  text-align: center;
  cursor: pointer;
  &:hover {
    background-color: #6c94be5e;
    span {
      color: #f0f0f0;
    }
  }
  & svg {
    margin-top: 3px;
  }
`;
