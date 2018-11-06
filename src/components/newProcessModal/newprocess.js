import React from "react";
import styled from "styled-components";
import { clearFix } from "polished";
import LogEvent from "../createReqInProcess/";
import AsyncSelect from "react-select/lib/Async";
import Select from "react-select";
import { compose } from "recompose";
import getPlans from "../../queries/getPlans";
import { withFormik, Field } from "formik";
import * as Yup from "yup";
import moment from "moment";
import { ApolloConsumer, graphql } from "react-apollo";
import withNotif from "../notification";
import CreateCommitment from "../../mutations/CreateCommitment";
import getCommitments from "../../queries/getCommitments";
import gql from "graphql-tag";
import Input from "../../atoms/input";
import Textarea from "../../atoms/textarea";
import Alert from "../alert";

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
      action: null,
      note: "",
      numericValue: "00.00" || "",
      unit: "",
      date: moment(),
      affectedResourceClassifiedAsId: ""
    }),
    validationSchema: Yup.object().shape({
      action: Yup.string().required(),
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
        action: values.action.toLowerCase(),
        due: date,
        note: values.note,
        committedResourceClassifiedAsId:
        values.affectedResourceClassifiedAsId.value,
        committedUnitId: values.unit.value,
        committedNumericValue: values.numericValue,
        inputOfId: values.process ? values.process.value : null,
        outputOfId: values.process ? values.process.value : null,
        scopeId: values.scope.value
      };
      return props
        .createCommitment({
          variables: MutationVariables,
          update: (store, { data }) => {
            let comm = store.readQuery({
              query: getCommitments,
              variables: {
                token: localStorage.getItem("oce_token"),
                id: props.scopeId
              }
            });
            comm.viewer.agent.agentCommitments.push(
              data.createCommitment.commitment
            );
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
    const promiseGroupOptions = (client, val) => {
      return client
        .query({
          query: agentRelationships,
          variables: {
            token: localStorage.getItem("oce_token")
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
        <Title>Create a new process</Title>
        <Wrapper>
        <ApolloConsumer>
            {client => (
              <Field
                name="scope"
                render={({ field }) => (
                  <AsyncSelect
                    placeholder={"Select a group..."}
                    defaultOptions
                    cacheOptions
                    isClearable
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
          </ApolloConsumer>

          <PlanWrapper>
            <Input placeholder="Type the name of the process..." />
            <Textarea placeholder="Type the note of the process" />
          </PlanWrapper>
          
          {values.scope ? 
          <Actions>
          <CommitmentWrapper>
            <Field
              name="action"
              render={({ field }) => (
                <Select
                  isClearable
                  name={field.name}
                  onChange={val =>
                    setFieldValue("action", val ? val.value : null)
                  }
                  placeholder="Add an input requirement"
                  options={[
                    {
                      value: "work",
                      label: "Add a work type requirement"
                    },
                    {
                      value: "use",
                      label: "Add a use type requirement"
                    },
                    {
                      value: "consume",
                      label: "Add a consume type requirement"
                    },
                    {
                      value: "prepare",
                      label: "Add a prepare type requirement"
                    },
                    {
                      value: "cite",
                      label: "Add a cite type requirement"
                    }
                  ]}
                />
              )}
            />
            {errors.action &&
              touched.action && <Alert>{errors.action}</Alert>}
          </CommitmentWrapper>
          {values.action ? (
            <Actions>
              <LogEvent
                action={values.action}
                providerId={providerId}
                scopeId={scopeId}
                addIntent={addIntent}
                closeLogEvent={toggleModal}
              />
            </Actions>
          ) : null}
          <CommitmentWrapper>
            <Select
              placeholder="Add an output requirement"
              options={[
                {
                  value: "produce",
                  label: "Add a produce type requirement"
                },
                {
                  value: "give",
                  label: "Add a give type requirement"
                },
                {
                  value: "transfer",
                  label: "Add a transfer type requirement"
                }
              ]}
            />
          </CommitmentWrapper>
        </Actions>
        : null}
        </Wrapper>
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

const TitleWrapper = styled.h3`
  color: ${props => props.theme.color.p900};
  letter-spacing: 0.5px;
  margin-bottom: 8px;
  margin-top: 16px;
`;

const Actions = styled.div`
  ${clearFix()};
`;

const CommitmentWrapper = styled.div`
  margin-top: 8px;
`;

const PlanWrapper = styled.div`
  ${clearFix()};
  margin-top: 10px;
  & input {
    background: #f5f5f5;
    border: 1px solid #d7d7d7;
    border-radius: 0;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
  }
  & textarea {
    margin-top: -1px;
    border-radius: 0;
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
    background: #f5f5f5;
    border: 1px solid #d7d7d7;
  }
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
