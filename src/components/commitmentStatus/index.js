import { Mutation } from "react-apollo";
import React from "react";
import { compose } from "recompose";
import UPDATE_COMMITMENT from "../../mutations/updateCommitment";
import withNotif from "../notification";
import gql from "graphql-tag";

export default compose(
  withNotif("Status is successfully updated", "Error! Status is not updated")
)(
  ({
    intentId,
    isFinished,
    onError,
    onSuccess
  }) => {
    return (
      <Mutation
        mutation={UPDATE_COMMITMENT}
        onError={onError}
        update={(store, { data: { updateCommitment } }) => {
          store.writeFragment({
            id: `${updateCommitment.commitment.__typename}-${
              updateCommitment.commitment.id
            }`,
            fragment: gql`
              fragment myCommitment on Commitment {
                isFinished
              }
            `,
            data: {
              __typename: 'Commitment',
              isFinished: updateCommitment.commitment.isFinished
            }
          });
          return onSuccess();
        }}
      >
        {(editStatus, { data }) => ( 
            <input type='checkbox' checked={isFinished} onChange={() =>
              editStatus({
                variables: {
                  token: localStorage.getItem("oce_token"),
                  id: intentId,
                  isFinished: !isFinished
                }
              })} />
        )}
      </Mutation>
    );
  }
);