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

export default compose(
  graphql(deleteNotification, { name: "deleteNotification" }),
  graphql(updateNotification, { name: "updateNotification" })
)(
  ({
    intentId,
    isFinished,
    updateNotification,
    deleteNotification
  }) => {
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
        update={(store, { data: { updateCommitment } }) => {
          let commCache = store.readQuery({
            query: getComm,
            variables: {
              token: localStorage.getItem("oce_token"),
              id: intentId
            }
          });
          commCache.isFinished = updateCommitment.commitment.isFinished;
          store.writeQuery({
            query: getComm,
            data: commCache
          });
        }}
      >
        {(addProvider, { data }) => (
          <Status
            isFinished={isFinished}
            onClick={() =>
              addProvider({
                variables: {
                  token: localStorage.getItem("oce_token"),
                  id: intentId,
                  isFinished: !isFinished
                }
              })
            }
          >
            {isFinished ? "Completed" : "Incomplete"}
          </Status>
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