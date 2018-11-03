import { Mutation } from "react-apollo";
import React from "react";
import styled, { css } from "styled-components";
import getComm from "../../queries/getCommitment";
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
          const commitment = store.readFragment({
            id: `${updateCommitment.commitment.__typename}-${
              updateCommitment.commitment.id
            }`,
            fragment: gql`
              fragment myCommitment on Commitment {
                id
                isFinished
              }
            `
          });
          commitment.isFinished = updateCommitment.commitment.isFinished;
          store.writeQuery({
            query: getComm,
            data: commitment
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


const Status = styled.div`
  color: #99adc6;
  font-weight: 500;
  font-size: 12px;
  letter-spacing: 1px;
  margin: 0;
  float: left;
  height: 24px;
  line-height: 24px;
  border-radius: 3px;
  margin-right: 16px;
  cursor: pointer;
  ${props =>
    props.isFinished === false &&
    css`
      color: #ffffff;
      background: #ffab00;
      padding: 0 5px;
    `} ${props =>
    props.isFinished &&
    css`
      color: #ffffff;
      background: ${props => props.theme.color.g100};
      padding: 0 5px;
    `};
`;