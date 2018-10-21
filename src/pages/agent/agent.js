import React from "react";
import styled from "styled-components";
import Header from "./header";
import { graphql } from "react-apollo";
import media from "styled-media-query";
import SmartSentence from "../../components/smartSentence";
import Feeds from "./feeds";
import { ApolloConsumer } from "react-apollo";
import HeaderTitle from "../../components/agentSectionHeader";
import AgentPlans from "../../components/agentplans";
import AgentIntents from "../../components/agentintents";
import { compose, withState, withHandlers } from "recompose";
import ValidationModal from "../../components/modalValidation";
import { Field, withFormik } from "formik";
import * as Yup from "yup";
import deleteNotification from "../../mutations/deleteNotification";
import updateNotification from "../../mutations/updateNotification";
import createValidation from "../../mutations/createValidation";
import deleteValidation from "../../mutations/deleteValidation";
import IntentModal from "../../components/modalIntent";
import { Icons, Textarea } from "oce-components/build";
import Claim from "../../queries/getEvent";
const Agent = props => {
  return (
    <Wrapper isOpen={props.isOpen}>
      <Header
        id={props.id ? props.id : props.match.params.id}
        toggleLeftPanel={props.toggleLeftPanel}
        togglePanel={props.togglePanel}
      />
      {props.id ? null : (
        <ApolloConsumer>
          {client => (
            <SmartSentence
              client={client}
              providerId={props.providerId}
              providerImage={props.providerImage}
              providerName={props.providerName}
              scopeId={
                props.id === props.providerId
                  ? props.providerId
                  : props.match.params.id
              }
            />
          )}
        </ApolloConsumer>
      )}
      <Content>
        <Inside>
          <Overview>
            <EventsInfo>
              <AgentPlans id={props.id ? props.id : props.match.params.id} />
              <AgentIntents
                toggleModal={props.toggleIntentModal}
                id={props.id ? props.id : props.match.params.id}
              />
            </EventsInfo>
            <div style={{ margin: "16px", marginBottom: 0, marginTop: 0 }}>
              <HeaderTitle title="Feed" />
            </div>
            <Feeds
              providerId={props.providerId}
              openValidationModal={props.toggleValidationModal}
              id={props.id ? props.id : props.match.params.id}
            />
          </Overview>
        </Inside>
      </Content>
      <IntentModal
        modalIsOpen={props.intentModalIsOpen}
        toggleModal={props.toggleIntentModal}
        contributionId={props.intentModalId}
        intent={props.intentModal}
        addIntent={props.selectValidationModalId}
        providerId={props.providerId}
        scopeId={
          props.id === props.providerId
            ? props.providerId
            : props.match.params.id
        }
      />
      <ValidationModal
        modalIsOpen={props.validationModalIsOpen}
        toggleModal={props.toggleValidationModal}
        contributionId={props.validationModalId}
        deleteValidation={props.deleteValidation}
        createValidation={props.createValidation}
        myId={props.providerId}
        handleChange={props.handleChange}
        note={
          <Field
            name="note"
            render={({ field /* _form */ }) => (
              <Textarea {...field} placeholder="Type the validation note..." />
            )}
          />
        }
      />
    </Wrapper>
  );
};

export default compose(
  graphql(createValidation, { name: "createValidationMutation" }),
  graphql(deleteValidation, { name: "deleteValidationMutation" }),
  graphql(updateNotification, { name: "updateNotification" }),
  graphql(deleteNotification, { name: "deleteNotification" }),
  withFormik({
    mapPropsToValues: props => ({
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      note: ""
    }),
    validationSchema: Yup.object().shape({
      month: Yup.number(),
      year: Yup.number(),
      note: Yup.string()
    })
  }),
  withState("validationModalIsOpen", "toggleValidationModalIsOpen", false),
  withState("intentModalIsOpen", "toggleIntentModalIsOpen", false),
  withState("validationModalId", "selectValidationModalId", null),
  withState("intentModal", "selectIntentModal", null),
  withHandlers({
    toggleValidationModal: props => contributionId => {
      props.selectValidationModalId(contributionId);
      props.toggleValidationModalIsOpen(!props.validationModalIsOpen);
    },
    toggleIntentModal: props => contributionId => {
      props.selectIntentModal(contributionId);
      props.toggleIntentModalIsOpen(!props.intentModalIsOpen);
    }
  }),
  withHandlers({
    createValidation: props => eventId => {
      return props
        .createValidationMutation({
          variables: {
            token: localStorage.getItem("oce_token"),
            validatedById: props.providerId,
            economicEventId: eventId,
            note: props.values.note
          },
          update: (store, { data }) => {
            let claimCache = store.readQuery({
              query: Claim,
              variables: {
                token: localStorage.getItem("oce_token"),
                id: Number(eventId)
              }
            });
            claimCache.viewer.economicEvent.validations.push({
              id: data.createValidation.validation.id,
              note: data.createValidation.validation.note,
              validatedBy: {
                id: data.createValidation.validation.validatedBy.id,
                name: data.createValidation.validation.validatedBy.name,
                __typename: "Person"
              },
              __typename: "Validation"
            });
            store.writeQuery({
              query: Claim,
              variables: {
                token: localStorage.getItem("oce_token"),
                id: Number(eventId)
              },
              data: claimCache
            });
          }
        })
        .then(
          data => {
            props.toggleValidationModal(eventId);
            props
              .updateNotification({
                variables: {
                  message: (
                    <div style={{ fontSize: "14px" }}>
                      <span
                        style={{ marginRight: "10px", verticalAlign: "sub" }}
                      >
                        <Icons.Bell width="18" height="18" color="white" />
                      </span>
                      Validation updated successfully!
                    </div>
                  ),
                  type: "success"
                }
              })
              .then(res => {
                setTimeout(() => {
                  props.deleteNotification({
                    variables: { id: res.data.addNotification.id }
                  });
                }, 1000);
              });
          },
          e => {
            const errors = e.graphQLErrors.map(error => error.message);
            props.toggleValidationModal(eventId);
            props
              .updateNotification({
                variables: {
                  message: (
                    <div style={{ fontSize: "14px" }}>
                      <span
                        style={{ marginRight: "10px", verticalAlign: "sub" }}
                      >
                        <Icons.Cross width="18" height="18" color="white" />
                      </span>
                      {errors}
                    </div>
                  ),
                  type: "alert"
                }
              })
              .then(res => {
                setTimeout(() => {
                  props.deleteNotification({
                    variables: { id: res.data.addNotification.id }
                  });
                }, 1000);
              });
          }
        );
    },
    deleteValidation: props => (eventId, valId) => {
      return props
        .deleteValidationMutation({
          variables: {
            token: localStorage.getItem("oce_token"),
            id: valId
          },
          update: (store, { data }) => {
            let claimCache = store.readQuery({
              query: Claim,
              variables: {
                token: localStorage.getItem("oce_token"),
                id: Number(eventId)
              }
            });
            let ValIndex = claimCache.viewer.economicEvent.validations.findIndex(
              item => Number(item.id) === Number(valId)
            );
            claimCache.viewer.economicEvent.validations.splice(ValIndex, 1);
            store.writeQuery({
              query: Claim,
              variables: {
                token: localStorage.getItem("oce_token"),
                id: Number(eventId)
              },
              data: claimCache
            });
          }
        })
        .then(
          data => {
            props.toggleValidationModal(eventId);
            props
              .updateNotification({
                variables: {
                  message: (
                    <div style={{ fontSize: "14px" }}>
                      <span
                        style={{ marginRight: "10px", verticalAlign: "sub" }}
                      >
                        <Icons.Bell width="18" height="18" color="white" />
                      </span>
                      Validation updated successfully!
                    </div>
                  ),
                  type: "success"
                }
              })
              .then(res => {
                setTimeout(() => {
                  props.deleteNotification({
                    variables: { id: res.data.addNotification.id }
                  });
                }, 1000);
              });
          },
          e => {
            const errors = e.graphQLErrors.map(error => error.message);
            props.toggleValidationModal(eventId);
            props
              .updateNotification({
                variables: {
                  message: (
                    <div style={{ fontSize: "14px" }}>
                      <span
                        style={{ marginRight: "10px", verticalAlign: "sub" }}
                      >
                        <Icons.Cross width="18" height="18" color="white" />
                      </span>
                      {errors}
                    </div>
                  ),
                  type: "alert"
                }
              })
              .then(res => {
                setTimeout(() => {
                  props.deleteNotification({
                    variables: { id: res.data.addNotification.id }
                  });
                }, 1000);
              });
          }
        );
    }
  })
)(Agent);

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  position: relative;
  width: 100%;
  height: 100%;
  ${media.lessThan("medium")`
    display: ${props => (props.isOpen ? "none" : "flex")}
  `};
`;

const Content = styled.div`
  contain: strict;
  flex: 1 1 auto;
  will-change: transform;
  display: flex;
  flex: 1;
`;

const Inside = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-content: center;
  position: relative;
  overflow-y: overlay;
  position: relative;
`;

const Overview = styled.div`
  flex: 1;
  ${media.lessThan("medium")`
  width: 100%;
  `};
`;

// const Textarea = styled.textarea`
// width: 100%;
// height: 100%;
// box-sizing: border-box;
// border: none;
// padding: 8px;
// resize: none;
// ${placeholder({
//   fontFamily: 'Fira-Sans'
// })}
// `

const EventsInfo = styled.div`
  display: grid;
  column-gap: 16px;
  grid-template-columns: 1fr 2fr
  padding: 16px;
  padding-top: 0;
`;
