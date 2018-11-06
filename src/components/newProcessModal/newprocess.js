import React from "react";
import styled from "styled-components";
import { clearFix } from "polished";
import LogEvent from "../createReqInProcess/";
import AsyncSelect from "react-select/lib/Async";
import Select from "react-select";
import { compose, withState } from "recompose";
import getPlans from "../../queries/getPlans";
import { withFormik, Field } from "formik";
import * as Yup from "yup";
import moment from "moment";
import { ApolloConsumer, graphql } from "react-apollo";
import withNotif from "../notification";
import CreateCommitment from "../../mutations/CreateCommitment";
import getCommitments from "../../queries/getCommitments";

import Input from "../../atoms/input";
import Textarea from "../../atoms/textarea";
import Alert from "../alert";
import { getRelationships } from "../../helpers/asyncQueries";

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

export default compose(
  withState("inputs", "onInput", []),
  withState("outputs", "onOutput", []),
  withFormik({
    mapPropsToValues: props => ({
      scope: null,
      inputAction: null,
      outputAction: null,
      note: ""
    }),
    validationSchema: Yup.object().shape({
      scope: Yup.object().required(),
      note: Yup.string()
    }),
    handleSubmit: (values, { props, resetForm, setErrors, setSubmitting }) => {}
  })
)(
  ({
    providerId,
    scopeId,
    errors,
    touched,
    setFieldValue,
    inputs,
    outputs,
    onInput,
    onOutput,
    values,
    toggleModal,
    addIntent
  }) => {
    console.log(inputs);

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
                    loadOptions={val => getRelationships(client, val)}
                  />
                )}
              />
            )}
          </ApolloConsumer>

          <PlanWrapper>
            <Input placeholder="Type the name of the process..." />
            <Textarea placeholder="Type the note of the process" />
          </PlanWrapper>

          {values.scope ? (
            <Actions>
              <CommitmentWrapper>
                <Field
                  name="inputAction"
                  render={({ field }) => (
                    <Select
                      isClearable
                      name={field.name}
                      onChange={val =>
                        setFieldValue("inputAction", val ? val.value : null)
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
                {errors.inputAction &&
                  touched.inputAction && <Alert>{errors.inputAction}</Alert>}
              </CommitmentWrapper>
              {values.inputAction ? (
                <Actions>
                  <LogEvent
                    closeTab={() => setFieldValue("inputAction", null)}
                    action={values.inputAction}
                    providerId={providerId}
                    scopeId={scopeId}
                    addIntent={addIntent}
                    closeLogEvent={toggleModal}
                    inputs={inputs}
                    onInput={onInput}
                  />
                </Actions>
              ) : null}
              {inputs.map((i, j) => (
                <SentenceTemporary key={j}>
                  <Sentence>
                    {`${i.action} ${i.numericValue} ${i.unit.label} of ${
                      i.affectedResourceClassifiedAsId.label
                    }`}
                  </Sentence>
                  <SentenceNote>{i.note}</SentenceNote>
                </SentenceTemporary>
              ))}
              {outputs.map((i, j) => (
                <SentenceTemporary key={j}>
                  <Sentence>
                    {`${i.action} ${i.numericValue} ${i.unit.label} of ${
                      i.affectedResourceClassifiedAsId.label
                    }`}
                  </Sentence>
                  <SentenceNote>{i.note}</SentenceNote>
                </SentenceTemporary>
              ))}

              <CommitmentWrapper>
                <Field
                  name="outputAction"
                  render={({ field }) => (
                    <Select
                      isClearable
                      name={field.name}
                      onChange={val =>
                        setFieldValue("outputAction", val ? val.value : null)
                      }
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
                  )}
                />
                {errors.inputAction &&
                  touched.inputAction && <Alert>{errors.inputAction}</Alert>}
              </CommitmentWrapper>
              {values.outputAction ? (
                <Actions>
                  <LogEvent
                    closeTab={() => setFieldValue("outputAction", null)}
                    action={values.outputAction}
                    providerId={providerId}
                    scopeId={scopeId}
                    addIntent={addIntent}
                    closeLogEvent={toggleModal}
                    inputs={inputs}
                    onInput={onInput}
                  />
                </Actions>
              ) : null}
            </Actions>
          ) : null}
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
const SentenceTemporary = styled.div`
  background: #323b44d6;
  padding: 0 8px;
  color: #f0f0f0;
  margin-top: 8px;
  margin-left: 40px;
  position: relative;
  &: before {
    position: absolute;
    content: "";
    left: -30px;
    top: 0px;
    width: 14px;
    height: 14px;
    border-radius: 100px;
    display: block;
    background: green;
  }
  &: after {
    position: absolute;
    content: "";
    left: -24px;
    top: 10px;
    width: 1px;
    bottom: -20px;
    display: block;
    background: green;
  }
`;
const SentenceNote = styled.div`
  font-size: 14px;
  line-height: 20px;
  font-weight: 300;
  font-style: italic;
  color: #f0f0f0c9;
`;

const Sentence = styled.div`
  height: 30px;
  line-height: 30px;
  font-weight: 500;
  border-bottom: 1px solid #fafafa4d;
  font-size: 14px;
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
