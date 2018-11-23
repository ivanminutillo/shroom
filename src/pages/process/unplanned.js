import React from 'react'
import styled from 'styled-components'
import moment from "moment";
import Feed from "../../components/FeedItem";
import LogEvent from '../../components/logEvent/logEvent';
import { compose } from "recompose";
import { withFormik } from "formik";
import * as Yup from "yup";
import createEvent from "../../mutations/createEvent";
import { graphql } from "react-apollo";
import { event } from "../../fragments/economicEvents";
import gql from "graphql-tag";
import withNotif from "../../components/notification";

export default compose(
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
          inputOfId: props.processId,
          outputOfId: props.processId,
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
              fragment Comm on Process {
                id
                unplannedEconomicEvents {
                    ...BasicEvent
                }
              }
              ${event}
            `
              const process = store.readFragment({
                id: `Process-${
                  props.processId
                }`,
                fragment: fragment,
                fragmentName: "Comm",
              });
              console.log(process)
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
              
              process.unplannedEconomicEvents.unshift({
                ...ev,
                __typename: "EconomicEvent"
              });
              store.writeFragment({
                id: `Process-${
                  props.processId
                }`,
                fragment: fragment,
                fragmentName: "Comm",
                data: process,
              });
            }
          })
          .then(res => {
            return props.onSuccess()
          })
          .catch(err => props.onError());
      }
    })
  )(props => (
    <FeedList>
    <WrapperLogEvent>
        <Title>Add a unplanned event</Title>
        <LogEvent
        commitmentId={null}
        providerId={props.providerId}
        scopeId={props.scopeId}
        inputOfId={props.processId}
        errors={props.errors}
        values={props.values}
        touched={props.touched}
        setFieldValue={props.setFieldValue}
        setFieldTouched={props.setFieldTouched}
        values={props.values}
        handleSubmit={props.handleSubmit}
        // action={data.action}
        // unit={data.committedQuantity.unit.name}
        // unitId={data.committedQuantity.unit.id}
        // resourceId={data.resourceClassifiedAs.id}
        // resource={data.resourceClassifiedAs.name}
        // closeLogEvent={handleAddEvent}
        />
    </WrapperLogEvent>
    {props.events.map((ev, i) => (
      <Feed
        scopeId={props.scopeId}
        image={ev.provider.image}
        commitmentId={null}
        key={i}
        id={ev.id}
        loggedUserId={props.providerId}
        providerId={ev.provider.id}
        withDelete
        
        validations={ev.validations}
        openValidationModal={props.openValidationModal}
        primary={
          <FeedItem>
            <B>{ev.provider.name}</B>{" "}
            {ev.action +
              " " +
              ev.affectedQuantity.numericValue +
              " " +
              ev.affectedQuantity.unit.name +
              " of "}
            <i>{ev.affects.resourceClassifiedAs.name}</i>
          </FeedItem>
        }
        secondary={ev.note}
        date={moment(ev.start).format("DD MMM")}
      />
    ))}
  </FeedList>
))

const WrapperLogEvent = styled.div`
  margin-top: -20px;
  margin-bottom: 10px;
  background: #eff1f4;
`;

const Title = styled.div`
    height: 30px;
    line-height: 30px;
    background: #d9dde3;
    margin-bottom: 10px;
    padding-left: 10px;
    font-size: 13px;
    color: #1c1e22b5;
    letter-spacing: 0.5px;
    font-weight: 500;
`;

const FeedItem = styled.div`
  font-size: ${props => props.theme.fontSize.h3};
  color:  ${props => props.theme.color.p900};
`;

const B = styled.b`
  text-decoration: underline;
  font-weight: 500;
  color: ${props => props.theme.color.p900};
`;

const FeedList = styled.div`
  margin-top: 0;
  margin-bottom: 0;
`;