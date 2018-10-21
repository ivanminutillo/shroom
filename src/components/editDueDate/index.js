import { Mutation } from "react-apollo";
import { Icons } from "oce-components";
import React from "react";
import styled, { css } from "styled-components";
import getComm from "../../queries/getCommitment";
import updateNotification from "../../mutations/updateNotification";
import deleteNotification from "../../mutations/deleteNotification";
import { compose } from "recompose";
import { graphql } from "react-apollo";
import UPDATE_COMMITMENT from "../../mutations/updateCommitment";
import moment from "moment";
import gql from "graphql-tag";
import DatePicker from "react-datepicker";
require("react-datepicker/dist/react-datepicker-cssmodules.css");

const DueDate = props => {
  return (
    <Wrapper>
      <DatePicker
        selected={props.value}
        onChange={props.action}
        dateFormat={"DD MMM YYYY"}
        withPortal
      />
    </Wrapper>
  );
};

export default compose(
  graphql(deleteNotification, { name: "deleteNotification" }),
  graphql(updateNotification, { name: "updateNotification" })
)(({ intentId, due, updateNotification, deleteNotification }) => {
  let duration = moment.duration(moment(due).diff(moment())).asHours();

  return (
    <Mutation
      mutation={UPDATE_COMMITMENT}
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
                Due date updated successfully!
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
      update={(store, { data: { updateCommitment } }) => {
        let commCache = store.readQuery({
          query: getComm,
          variables: {
            token: localStorage.getItem("oce_token"),
            id: intentId
          }
        });
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
        commCache.due = updateCommitment.commitment.due;
        store.writeQuery({
          query: getComm,
          data: commCache
        });
      }}
    >
      {(addProvider, { data }) => (
        <Date deadline={duration < 0 ? "expired" : duration < 48 ? "soon" : ""}>
          <DueDate
            value={moment(due)}
            action={(value) => addProvider({
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
    width: 100%;
    border: none;
    width: 100px;
    text-align: center;
    font-weight: 500;
    letter-spacing: .5px;
    font-size: 12px;
  }
`
const Date = styled.h3`
cursor: pointer;
  & input {
      color: #8d8d8d;
      text-decoration: underline;
  }
  margin: 0;
  float: left;
  height: 24px;
  line-height: 24px;
  border-radius: 3px;
  margin-right: 16px;
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
