import React from "react";
import styled, { css } from "styled-components";
import Header from "../agentSectionHeader";
import Intent from "./intents";
import { Query } from "react-apollo";
import { LoadingMini, ErrorMini } from "../../components/loading";
import getComms from "../../queries/getCommitments";
import { compose, withHandlers, withState } from "recompose";
import getAllCommitments from "../../queries/getAllCommitments";
const Wrapper = styled.div`
  position: relative;
`;

const Content = styled.div`
  overflow-y: scroll;
  margin: 0;
  padding: 0;
  width: 100%;
`;

const Intents = props => {
  console.log(props)
  return (
    <div>
      <h1>cici  </h1>
    {/* {props.intents.map((intent, i) => (
      <Intent
        handleAddEvent={props.handleAddEvent}
        addEvent={props.addEvent}
        toggleModal={props.toggleModal}
        key={i}
        data={intent}
        scopeId={props.id}
        myId={props.myId}
        providerImage={props.providerImage}
      />
    ))} */}
    </div>
  )
}
  // <Wrapper>
  //   <Header
  //     title={props.path}
  //   />
  //   <Content>
  //     <Query
  //       query={props.profile ? getAllCommitments : getComms}
  //       variables={{
  //         token: localStorage.getItem("oce_token"),
  //         id: props.id
  //       }}
  //     >
  //       {({ loading, error, data, refetch, fetchMore }) => {
  //         if (loading) return <LoadingMini />;
  //         if (error)
  //           return (
  //             <ErrorMini
  //               refetch={refetch}
  //               message={`Error! ${error.message}`}
  //             />
  //           );
  //           let intents
  //           if (props.profile) {
  //             let merged = data.viewer.agent.agentRelationships.map(
  //               a => a.object.agentCommitments
  //             );
  //             intents = [].concat(...merged);
  //           }
  //           else {
  //             intents = data.viewer.agent.agentCommitments
  //           }

  //         if (props.path === "inbox") {
  //           intents = intents.filter(int => int.isFinished === false);
  //         } else if (props.path === "committed") {
  //           intents = intents.filter(int => {
  //             if (int.provider) {
  //               return int.provider.id === props.myId;
  //             } else return null
  //           });
  //         } else if (props.path === "matched") {
  //           intents = intents.filter(int => int.provider);
  //         } else if (props.path === "completed") {
  //           intents = intents.filter(int => int.isFinished);
  //         }

          // return intents.map((intent, i) => (
          
  //       }}
  //     </Query>
  //   </Content>
  // </Wrapper>
// );

export default compose(
  withState("intentQuery", "onIntentQuery", "All"),
  withState("query", "onQuery", "Commitments"),
  withState("intentsOptions", "handleIntentsOptions", false),
  withState("addEvent", "onAddEvent", false),
  withHandlers({
    handleAddEvent: props => () => {
      props.onAddEvent(!props.addEvent);
    },
    handleQuery: props => () => {
      if (props.query === "Commitments") {
        return props.onQuery("Skills");
      } else {
        return props.onQuery("Commitments");
      }
    },
    onIntentsOptions: props => () => {
      props.handleIntentsOptions(!props.intentsOptions);
    }
  })
)(Intents);
