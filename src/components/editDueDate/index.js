import { Mutation } from "react-apollo";
import React from "react";
import styled, { css } from "styled-components";
import getComm from "../../queries/getCommitment";
import { compose } from "recompose";
import UPDATE_COMMITMENT from "../../mutations/updateCommitment";
import moment from "moment";
import withNotif from "../notification";
import gql from "graphql-tag";
import DatePicker from "react-datepicker";
require("react-datepicker/dist/react-datepicker-cssmodules.css");

const DueDate = props => {
  return (
    <Wrapper>
      <DatePicker
        selected={props.value}
        onChange={props.action}
        dateFormat={"DD MMM"}
      />
    </Wrapper>
  );
};

export default compose(
  withNotif("Due date is successfully updated", "Error! Due date is not updated")
)(({ intentId, due, onError, onSuccess }) => {
  let duration = moment.duration(moment(due).diff(moment())).asHours();

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
              due
            }
          `
        });
        commitment.due = updateCommitment.commitment.due;
        store.writeQuery({
          query: getComm,
          data: commitment
        });
        return onSuccess();
      }}
    >
      {(editDueDate, { data }) => (
        <Date deadline={duration < 0 ? "expired" : duration < 48 ? "soon" : ""}>
          <DueDate
            value={moment(due)}
            action={(value) => editDueDate({
              variables: {
                token: localStorage.getItem("oce_token"),
                id: intentId,
                due: moment(value).format("YYYY-MM-DD")
              }
            })}
          />
        </Date>
      )}
    </Mutation>
  );
});


const Wrapper = styled.div`
cursor: pointer;
  & input {
    cursor: pointer;
    background: transparent;
    height: 24px;
    line-height: 24px;
    border: none;
    width: 60px;
    text-align: center;
    font-weight: 500;
    font-size: 12px;
  }
`
const Date = styled.div`
cursor: pointer;
  & input {
      color: #8d8d8d;
  }
  margin: 0;
  float: left;
  height: 24px;
  line-height: 24px;
  border-radius: 3px;
  margin-left: 4px;
  ${props =>
    props.deadline === "soon" &&
    css`
    & input {
      color: #ffffff;
    }
      background: #ffab00;
      padding: 0 5px;
    `} ${props =>
    props.deadline === "expired" &&
    css`
    & input {
      color: #ffffff;
    }
      background: #ff5630;
      padding: 0 5px;
    `};
`;
