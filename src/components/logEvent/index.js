import { compose } from "recompose";
import Component from "./logEvent";
import moment from "moment";
import { withFormik } from "formik";
import * as Yup from "yup";
import createEvent from "../../mutations/createEvent";
import { graphql } from "react-apollo";
import { event } from "../../fragments/economicEvents";
import gql from "graphql-tag";
import withNotif from "../notification";

const wrapperComponent = compose(
  withNotif(
    "Event successfully added",
    "Error, the event has not been created"
  ),
  graphql(createEvent, { name: "createEventMutation" }),
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
            const fragment = gql`
            fragment Comm on Commitment {
              id
              fulfilledBy {
                fulfilledBy {
                  ...BasicEvent
                }
              }
            }
            ${event}
          `
            const commitment = store.readFragment({
              id: `Commitment-${
                props.commitmentId
              }`,
              fragment: fragment,
              fragmentName: "Comm",
            });

            const ev = {
              __typename: "EconomicEvent",
              action: data.createEconomicEvent.economicEvent.action,
              requestDistribution: data.createEconomicEvent.economicEvent.requestDistribution,
              start: data.createEconomicEvent.economicEvent.start,
              id: data.createEconomicEvent.economicEvent.id,
              scope: data.createEconomicEvent.economicEvent.scope,
              note: data.createEconomicEvent.economicEvent.note,
              provider: data.createEconomicEvent.economicEvent.provider,
              inputOf: data.createEconomicEvent.economicEvent.inputOf,
              isValidated: false,
              fulfills: data.createEconomicEvent.economicEvent.fulfills,
              validations: [],
              affects: data.createEconomicEvent.economicEvent.affects,
              affectedQuantity: data.createEconomicEvent.economicEvent.affectedQuantity
            };
            
            commitment.fulfilledBy.unshift({
              fulfilledBy: ev,
              __typename: "Fulfillment"
            });
            store.writeFragment({
              id: `Commitment-${
                props.commitmentId
              }`,
              fragment: fragment,
              fragmentName: "Comm",
              data: commitment,
            });
          }
        })
        .then(res => {
          props.onSuccess()
          return props.closeLogEvent()
        })
        .catch(err => props.onError());
    }
  })
)(Component);

export default wrapperComponent;
