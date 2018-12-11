import { Mutation } from "react-apollo";
import React from "react";
import { compose } from "recompose";
import UPDATE_COMMITMENT from "../../mutations/updateCommitment";
import withNotif from "../notification";
import gql from "graphql-tag";
import Icons from '../../atoms/icons.tsx'
import styled, {css} from 'styled-components'
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
            <Status checked={isFinished} onClick={() =>
              editStatus({
                variables: {
                  token: localStorage.getItem("oce_token"),
                  id: intentId,
                  isFinished: !isFinished
                }
              })} ><Icons.Check width='16' height='16' color='#3497ff' /></Status>
        )}
      </Mutation>
    );
  }
);

const Status = styled.span`
align-items: center;
-moz-box-sizing: border-box;
box-sizing: border-box;
display: inline-flex;
height: 20px;
justify-content: center;
width: 20px;
border: 1px solid #3497ff;
border-radius: 50%;
color: #848f99;
fill: #848f99;
flex: 0 0 auto;
min-width: 1px;
overflow: hidden;
vertical-align: middle;
margin: 0 10px 0 0;
transition: 200ms box-shadow,200ms color,200ms background,200ms fill;
${props =>
  props.checked &&
  css`
  background-color: #e2fffa;
  border-color: #25e8c8;
  color: #25e8c8;
  fill: #25e8c8;
  `};
&:hover {
  background-color: #e2fffa;
  border-color: #25e8c8;
  color: #25e8c8;
  fill: #25e8c8;
  cursor: pointer;
}
`