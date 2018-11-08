import React from "react";
import styled from "styled-components";
import { clearFix } from "polished";
import LogEvent from "../logEvent/logEvent";
import AsyncSelect from "react-select/lib/Async";
import { compose } from "recompose";
import getPlans from "../../queries/getPlans";
import { withFormik, Field } from "formik";
import * as Yup from "yup";
import moment from "moment";
import { ApolloConsumer, graphql } from "react-apollo";
import ProcessSelect from "./processSelect";
import withNotif from "../notification";
import CreateCommitment from "../../mutations/CreateCommitment";
import getCommitments from "../../queries/getCommitments";
import gql from "graphql-tag";
import GroupSelect from "../groupSelect";

const customStyles = {
  control: base => ({
    ...base,
    color: "#333"
  }),
  input: base => ({
    ...base,
    color: "#333"
  }),
  singleValue: base => ({
    ...base,
    color: "#333"
  }),
  placeholder: base => ({
    ...base,
    color: "#333",
    fontSize: "14px"
  })
};


const agentRelationships = gql`
  query($token: String) {
    viewer(token: $token) {
      myAgent {
        id
        agentRelationships {
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
  withNotif("Commitment is successfully created", "Commitment is not created"),
  graphql(CreateCommitment, { name: "createCommitment" }),
  withFormik({
    mapPropsToValues: props => ({
      scope: null,
      plan: null,
      process: "",
      action: "",
      note: "",
      numericValue: "00.00" || "",
      unit: "",
      date: moment(),
      affectedResourceClassifiedAsId: ""
    }),
    validationSchema: Yup.object().shape({
      action: Yup.object().required(),
      scope: Yup.object().required(),
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
      setSubmitting(true);
      let MutationVariables = {
        token: localStorage.getItem("oce_token"),
        action: values.action.value.toLowerCase(),
        due: date,
        note: values.note,
        committedResourceClassifiedAsId: values.affectedResourceClassifiedAsId.value,
        committedUnitId: values.unit.value,
        committedNumericValue: values.numericValue,
        inputOfId: values.process ? values.process.value : null,
        outputOfId: values.process ? values.process.value : null,
        planId: values.plan ? values.plan.value : null,
        scopeId: values.scope.value
      };
      return props.createCommitment({
        variables: MutationVariables,
        update: (store, { data }) => {
          let comm = store.readQuery({
            query: getCommitments,
            variables: {
              token: localStorage.getItem("oce_token"),
              id: props.scopeId
            }
          });
          comm.viewer.agent.agentCommitments.push(data.createCommitment.commitment)
          store.writeQuery({
            query: getCommitments,
            data: comm,
            variables: {
              token: localStorage.getItem("oce_token"),
              id: props.scopeId
            }
          });

        }
      })
      .then(res => props.onSuccess())
      .catch(err => props.onError());
    }
  })
)(
  ({
    intent,
    providerId,
    scopeId,
    errors,
    touched,
    setFieldValue,
    setFieldTouched,
    values,
    toggleModal,
    addIntent
  }) => {
    const promiseOptions = (client, val) => {
      return client
        .query({
          query: getPlans,
          variables: {
            token: localStorage.getItem("oce_token"),
            id: values.scope.value
          }
        })
        .then(res => {
          let options = res.data.viewer.agent.agentPlans
            .map(plan => ({
              value: plan.id,
              label: plan.name
            }))
            .filter(i => i.label.toLowerCase().includes(val.toLowerCase()));
          return options;
        });
    };
    const promiseGroupOptions = (client, val) => {
      return client
        .query({
          query: agentRelationships,
          variables: {
            token: localStorage.getItem("oce_token"),
          }
        })
        .then(res => {
          console.log(res);
          let options = res.data.viewer.myAgent.agentRelationships
            .map(plan => ({
              value: plan.object.id,
              label: plan.object.name
            }))
            .filter(i => i.label.toLowerCase().includes(val.toLowerCase()));
          return options;
        });
    };

    return (
      <div>
        <Title>Create a new requirement</Title>
        <Wrapper>
          <GroupSelect
              setFieldValue={setFieldValue}
          />
          {/* <ApolloConsumer>
            {client => (
              <Field
                name="scope"
                render={({ field }) => (
                  <AsyncSelect
                    placeholder={"Select a group..."}
                    defaultOptions
                    cacheOptions
                    styles={customStyles}
                    value={field.label}
                    onChange={val =>
                      setFieldValue("scope", {
                        value: val.value,
                        label: val.label
                      })
                    }
                    loadOptions={val => promiseGroupOptions(client, val)}
                  />
                )}
              />
            )}
          </ApolloConsumer> */}
          {values.scope ?
          <PlanWrapper>
          <ApolloConsumer>
            {client => (
              <Field
                name="plan"
                render={({ field }) => (
                  <AsyncSelect
                    placeholder={"Select a plan..."}
                    defaultOptions
                    cacheOptions
                    styles={customStyles}
                    value={field.label}
                    onChange={val =>
                      setFieldValue("plan", {
                        value: val.value,
                        label: val.label
                      })
                    }
                    loadOptions={val => promiseOptions(client, val)}
                  />
                )}
              />
            )}
          </ApolloConsumer>
          </PlanWrapper> 
        : null}
          {values.plan ? (
            <SelectContainer>
              <Field
                name="process"
                render={({ field }) => (
                  <ProcessSelect
                    planId={values.plan.value}
                    setFieldValue={setFieldValue}
                    field={field}
                  />
                )}
              />
            </SelectContainer>
          ) : null}
        </Wrapper>
        <Actions>
          <LogEvent
            errors={errors}
            values={values}
            setFieldValue={setFieldValue}
            commitmentId={intent}
            providerId={providerId}
            scopeId={scopeId}
            addIntent={addIntent}
            touched={touched}
            setFieldTouched={setFieldTouched}
            action={intent}
            unit={intent}
            unitId={intent}
            resourceId={intent}
            resource={intent}
            closeLogEvent={toggleModal}
          />
        </Actions>
      </div>
    );
  }
);

const Title = styled.h3`
  color: ${props => props.theme.color.p900};
  letter-spacing: 0.5px;
  margin-bottom: 16px;
  margin-left: 10px;
  margin-top: 20px;
`;

const Actions = styled.div`
  ${clearFix()};
`;

const PlanWrapper = styled.div`
  ${clearFix()};
  margin-top: 10px;
`;

const Wrapper = styled.div`
  ${clearFix()};
  margin: 0 10px;
  margin-bottom: 10px;
  position: relative;
  z-index: 999999;
`;

const SelectContainer = styled.div`
  ${clearFix()};
  margin-top: 8px;
  position: relative;
  z-index: 9999;
`;
