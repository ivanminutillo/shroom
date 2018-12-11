import { compose } from "recompose";
import Component from "../logEvent/logEvent";
import moment from "moment";
import { withFormik } from "formik";
import * as Yup from "yup";
import createEvent from "../../mutations/createEvent";
import updateNotification from "../../mutations/updateNotification";
import deleteNotification from "../../mutations/deleteNotification";
import React from "react";
import Icons from '../../atoms/icons.tsx'
import { graphql } from "react-apollo";
import queryEvents from "../../queries/getFeed";
import getComm from "../../queries/getCommitment";

const wrapperComponent = compose(
  graphql(createEvent, { name: "createEventMutation" }),
  graphql(deleteNotification, { name: "deleteNotification" }),
  graphql(updateNotification, { name: "updateNotification" }),

  withFormik({
    mapPropsToValues: props => ({
      action: { value: props.action, label: props.action } || {
        value: "",
        label: ""
      },
      note: "",
      numericValue: "00.00" || "",
      unit: { value: props.unitId, label: props.unit } || {
        value: "",
        label: ""
      },
      date: moment(),
      affectedResourceClassifiedAsId: {
        value: props.resourceId,
        label: props.resource
      } || { value: "", label: "" }
    }),
    validationSchema: Yup.object().shape({
      action: Yup.object().required(),
      note: Yup.string(),
      numericValue: Yup.number(),
      unit: Yup.object().required(),
      date: Yup.string(),
      affectedResourceClassifiedAsId: Yup.object().required(
        "Classification is a required field"
      )
    }),
    handleSubmit: (values, { props, resetForm, setErrors, setSubmitting }) => {
      let date = moment(values.date).format("YYYY-MM-DD");
      let eventMutationVariables = {
        token: localStorage.getItem("oce_token"),
        id: props.providerId,
        providerId: props.providerId,
        receiverId: props.scopeId,
        commitmentId: props.commitmentId,
        action: values.action.value,
        scopeId: props.scopeId,
        note: values.note,
        affectedNumericValue: values.numericValue,
        affectedUnitId: values.unit.value,
        start: date,
        affectedResourceClassifiedAsId:
          values.affectedResourceClassifiedAsId.value
      };
      return props
        .createEventMutation({
          variables: eventMutationVariables,
          update: (store, { data }) => {
            let EventsCache = store.readQuery({
              query: queryEvents,
              variables: {
                token: localStorage.getItem("oce_token"),
                id: props.scopeId
              }
            });
            let CommitmentCache = store.readQuery({
              query: getComm,
              variables: {
                token: localStorage.getItem("oce_token"),
                id: props.commitmentId
              }
            });
            const ev = {
              __typename: "EconomicEvent",
              action: data.createEconomicEvent.economicEvent.action,
              requestDistribution:
                data.createEconomicEvent.economicEvent.requestDistribution,
              start: data.createEconomicEvent.economicEvent.start,
              id: data.createEconomicEvent.economicEvent.id,
              scope: data.createEconomicEvent.economicEvent.scope,
              note: data.createEconomicEvent.economicEvent.note,
              provider: data.createEconomicEvent.economicEvent.provider,
              inputOf: data.createEconomicEvent.economicEvent.inputOf,
              isValidated: false,
              fulfills: data.createEconomicEvent.economicEvent.fulfills,
              validations: [],
              affects: {
                trackingIdentifier:
                  data.createEconomicEvent.economicEvent.affects
                    .trackingIdentifier,
                resourceClassifiedAs: {
                  id:
                    data.createEconomicEvent.economicEvent.affects
                      .resourceClassifiedAs.id,
                  name:
                    data.createEconomicEvent.economicEvent.affects
                      .resourceClassifiedAs.name,
                  __typename: "ResourceClassification"
                },
                note: data.createEconomicEvent.economicEvent.affects.note,
                __typename: "EconomicResource"
              },
              affectedQuantity: {
                numericValue:
                  data.createEconomicEvent.economicEvent.affectedQuantity
                    .numericValue,
                unit: {
                  id:
                    data.createEconomicEvent.economicEvent.affectedQuantity.unit
                      .id,
                  name:
                    data.createEconomicEvent.economicEvent.affectedQuantity.unit
                      .name,
                  __typename: "Unit"
                },
                __typename: "QuantityValue"
              }
            };
            // Add the last economicevent to the events list cache, related to its commitment
            EventsCache.viewer.agent.agentEconomicEvents.unshift(ev);
            CommitmentCache.viewer.commitment.fulfilledBy.unshift({
              fulfilledBy: ev,
              __typename: "Fulfillment"
            });
            store.writeQuery({
              query: queryEvents,
              variables: {
                token: localStorage.getItem("oce_token"),
                id: props.scopeId
              },
              data: { viewer: EventsCache.viewer }
            });
            store.writeQuery({
              query: getComm,
              variables: {
                token: localStorage.getItem("oce_token"),
                id: props.scopeId
              },
              data: { viewer: CommitmentCache.viewer }
            });
            return null
          }
        })
        .then(data =>
          props
            .updateNotification({
              variables: {
                message: (
                  <div style={{ fontSize: "14px" }}>
                    <span style={{ marginRight: "10px", verticalAlign: "sub" }}>
                      <Icons.Bell width="18" height="18" color="white" />
                    </span>
                    Event logged successfully!
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
            })
        )
        .catch(e => {
          const errors = e.graphQLErrors.map(error => error.message);
          props
            .updateNotification({
              variables: {
                message: (
                  <div style={{ fontSize: "14px" }}>
                    <span style={{ marginRight: "10px", verticalAlign: "sub" }}>
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
        });
    }
  })
)(Component);

export default wrapperComponent;
