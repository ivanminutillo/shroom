import * as React from "react";
import gql from "graphql-tag";
import { compose, withHandlers, withState } from "recompose";
import styled from "styled-components";
import { LoadingMini, ErrorMini } from "../../components/loading";
import Header from "./header";
import { Query } from "react-apollo";
import ValidationModal from "../../components/modalValidation";
import NewRequirementModal from "../../components/newRequirementModal";
import Home from "../../pages/home";
import { PropsRoute } from "../../helpers/router";
import Agent from "../../pages/agent/agent";
import { Switch } from "react-router-dom";
import NewProcessModal from '../../components/newProcessModal'
import ProcessModal from "../../pages/process/wrapper";

const Surface = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  max-width: 1010px;
  margin: 0 auto;
  margin-top: 50px;
`;

const Whole = styled.div`
  
`;

const AppTemplate = props => {
  return (
    <Query
      query={agentRelationships}
      variables={{
        token: localStorage.getItem("oce_token")
      }}
    >
      {({ loading, error, data, refetch, client }) => {
        if (loading) return <LoadingMini />;
        if (error) return (<ErrorMini refetch={refetch} message={`Error! ${error.message}`} />)
        return (
          <Whole>
            <Header 
              history={props.history}
              providerId={data.viewer.myAgent.id}
              providerImage={data.viewer.myAgent.image}
              agents={data.viewer.myAgent.agentRelationships}
            />
          <Surface>
            <Switch>
              {/* <PropsRoute
                component={Process}
                path={"/process/:id"}
                location={props.location}
                providerId={data.viewer.myAgent.id}
                providerImage={data.viewer.myAgent.image}
                providerName={data.viewer.myAgent.name}
                toggleModal={props.handleProcess}
              /> */}
              <PropsRoute
                component={Agent}
                location={props.location}
                path="/agent/:id"
                client={client}
                providerId={data.viewer.myAgent.id}
                providerImage={data.viewer.myAgent.image}
                providerName={data.viewer.myAgent.name}
                toggleValidationModal={props.toggleValidationModal}
                isCommittedOpen={props.isCommittedOpen}
                handleCommittedOpen={props.handleCommittedOpen}
                isCompletedOpen={props.isCompletedOpen}
                handleCompletedOpen={props.handleCompletedOpen}
                handleProcess={props.handleProcess}
                handleProcess={props.handleProcess}
                processModalIsOpen={props.processModalIsOpen}
              />
              <PropsRoute
                component={Home}
                path={props.match.path}
                location={props.location}
                client={client}
                providerId={data.viewer.myAgent.id}
                providerImage={data.viewer.myAgent.image}
                providerName={data.viewer.myAgent.name}
                toggleValidationModal={props.toggleValidationModal}
                isCommittedOpen={props.isCommittedOpen}
                handleCommittedOpen={props.handleCommittedOpen}
                isCompletedOpen={props.isCompletedOpen}
                handleCompletedOpen={props.handleCompletedOpen}
                handleProcess={props.handleProcess}
                processModalIsOpen={props.processModalIsOpen}
              />
            </Switch>
            <ValidationModal
              modalIsOpen={props.validationModalIsOpen}
              toggleModal={props.toggleValidationModal}
              contributionId={props.validationModalId}
              myId={data.viewer.myAgent.id}
            />
            <NewRequirementModal
              modalIsOpen={props.newRequirementModalIsOpen}
              toggleModal={props.togglenewRequirementModal}
            />
            <NewProcessModal
              modalIsOpen={props.newProcessModalIsOpen}
              history={props.history}
              toggleModal={props.togglenewProcessModal}
            />
            {/* <ProcessModal
              modalIsOpen={props.processModalIsOpen}
              history={props.history}
              toggleModal={props.handleProcess}
            /> */}
          </Surface>
          </Whole>
        );
      }}
    </Query>
  );
};

const agentRelationships = gql`
  query($token: String) {
    viewer(token: $token) {
      myAgent {
        id
        name
        image
        agentRelationships {
          id
          object {
            id
            name
          }
        }
      }
    }
  }
`;

export default compose(
  withState(
    "newRequirementModalIsOpen",
    "togglenewRequirementModalIsOpen",
    false
  ),
  withState(
    "newProcessModalIsOpen",
    "togglenewProcessIsOpen",
    false
  ),
  withState("validationModalIsOpen", "toggleValidationModalIsOpen", false),
  withState("processModalIsOpen", "toggleProcessModalIsOpen", false),
  withState("validationModalId", "selectValidationModalId", null),
  withState("intentModalIsOpen", "toggleIntentModalIsOpen", false),
  withState("intentModal", "selectIntentModal", null),
  withState("isCommittedOpen", "onCommittedOpen", true),
  withState("isCompletedOpen", "onCompletedOpen", false),

  withHandlers({
    handleProcess: props => (id) => {
      if (props.processModalIsOpen) {
        props.history.goBack()
        props.toggleProcessModalIsOpen(false)
      } else {
        props.history.push('/processes/' + id)
        props.toggleProcessModalIsOpen(true)
      }
    },
    handleCommittedOpen: props => () =>
      props.onCommittedOpen(!props.isCommittedOpen),
    handleCompletedOpen: props => () =>
      props.onCompletedOpen(!props.isCompletedOpen),
    toggleIntentModal: props => contributionId => {
      props.selectIntentModal(contributionId);
      props.toggleIntentModalIsOpen(!props.intentModalIsOpen);
    },
    togglenewRequirementModal: props => () => {
      props.togglenewRequirementModalIsOpen(!props.newRequirementModalIsOpen);
    },
    togglenewProcessModal: props => () => {
      props.togglenewProcessIsOpen(!props.newProcessModalIsOpen);
    },
    toggleValidationModal: props => contributionId => {
      props.selectValidationModalId(contributionId);
      props.toggleValidationModalIsOpen(!props.validationModalIsOpen);
    }
  })
)(AppTemplate);
