import React from "react";
import { compose } from "recompose";
import DELETE_COMMITMENT from "../../mutations/deleteCommitment";
import getCommitments from '../../queries/getCommitments'
import withNotif from "../notification";
import { Mutation } from "react-apollo";

export default compose(
  withNotif(
    "Requirement is successfully deleted",
    "Error! Requirement has not been deleted"
  )
)(({ intentId, toggleModal, scopeId, onError, onSuccess }) => (
  <Mutation
    mutation={DELETE_COMMITMENT}
    onError={onError}
    update={(store, { data }) => {
        console.log(scopeId)
        let comm = store.readQuery({
            query: getCommitments,
            variables: {
              token: localStorage.getItem("oce_token"),
              id: scopeId
            }
          });
          let i =comm.viewer.agent.agentCommitments.findIndex(comm => comm.id === intentId)
          let newlist = comm.viewer.agent.agentCommitments.splice(i, 1)
          console.log(newlist)
          store.writeQuery({
            query: getCommitments,
            data: newlist,
            variables: {
              token: localStorage.getItem("oce_token"),
              id: scopeId
            }
          });
      toggleModal()
      return onSuccess();
    }}
  >
    {(deleteCommitment, { data }) => (
      <div
        onClick={() =>
          deleteCommitment({
            variables: {
              token: localStorage.getItem("oce_token"),
              id: intentId,
            }
          })
        }
      >
        Delete requirement
      </div>
    )}
  </Mutation>
));
