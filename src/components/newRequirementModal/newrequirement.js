import React from "react";
import styled from "styled-components";
import { clearFix } from "polished";
import LogEvent from "../createReqInProcess/logEvent";
import { compose, withState } from "recompose";
import { withFormik, Field } from "formik";
import * as Yup from "yup";
import moment from "moment";
import { graphql } from "react-apollo";
import ProcessSelect from "./processSelect";
import withNotif from "../notification";
import CreateCommitment from "../../mutations/CreateCommitment";
import getCommitments from "../../queries/getCommitments";
import GroupSelect from "../groupSelect";
import { inputReqs } from "../newProcessModal/options";
import { Icons } from "oce-components/build";
import Select from "react-select";

export default compose(
  withNotif("Commitment is successfully created", "Commitment is not created"),
  graphql(CreateCommitment, { name: "createCommitment" }),
  withState("inputs", "onInput", []),
  withFormik({
    mapPropsToValues: props => ({
      scope: null,
      process: "",
      action: null,
      note: "",
      numericValue: "00.00" || "",
      unit: "",
      start: moment(),
      due: moment(),
      affectedResourceClassifiedAsId: ""
    }),
    validationSchema: Yup.object().shape({
      action: Yup.string().required(),
      scope: Yup.object().required(),
      note: Yup.string(),
      numericValue: Yup.number().required(),
      unit: Yup.object(),
      start: Yup.string().required(),
      due: Yup.string().required(),
      affectedResourceClassifiedAsId: Yup.object().required()
    }),
    handleSubmit: (values, { props, resetForm, setErrors, setSubmitting }) => {

      let date = moment(values.due).format("YYYY-MM-DD");
      let start = moment(values.start).format("YYYY-MM-DD");
      setSubmitting(true);
      let MutationVariables = {
        token: localStorage.getItem("oce_token"),
        action: values.action.toLowerCase(),
        start: start,
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
                id: values.scope.value
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
    inputs,
    onInput,
    providerId,
    isValidating,
    isSubmitting,
    scopeId,
    errors,
    touched,
    setFieldValue,
    setFieldTouched,
    values,
    toggleModal,
    addIntent,
    handleSubmit
  }) => {
    return (
      <div>
        <Title>Create a new requirement</Title>
        <Wrapper>
          <GroupSelect setFieldValue={setFieldValue} />
          <PlanWrapper>
            {values.scope ? (
              <SelectContainer>
                <Field
                  name="process"
                  render={({ field }) => (
                    <ProcessSelect
                      scopeId={values.scope.value}
                      setFieldValue={setFieldValue}
                      field={field}
                    />
                  )}
                />
              </SelectContainer>
            ) : null}
          </PlanWrapper>
        </Wrapper>
        {values.scope ? (
          <div>
            <CommitmentWrapper>
              <Span>
                <Icons.Plus width="20" height="20" color="#b7bfc6" />
              </Span>
              <SelectInput>
                <Field
                  name="action"
                  render={({ field }) => (
                    <Select
                      isClearable
                      name={field.name}
                      onChange={val =>
                        setFieldValue("action", val ? val.value : null)
                      }
                      placeholder="Add a new requirement"
                      options={inputReqs}
                    />
                  )}
                />
              </SelectInput>
            </CommitmentWrapper>
            {values.action ? (
              <Actions style={{ margin: "0 10px" }}>
                <LogEvent
                  closeTab={() => setFieldValue("action", null)}
                  action={values.action}
                  providerId={providerId}
                  scopeId={scopeId}
                  addIntent={addIntent}
                  closeLogEvent={toggleModal}
                  inputs={inputs}
                  onInput={onInput}
                  type={values.action ? "input" : "output"}
                  values={values}
                  setFieldValue={setFieldValue}
                  errors={errors}
                  touched={touched}
                  setFieldTouched={setFieldTouched}
                  handleSubmit={() => handleSubmit()}
                />
              </Actions>
            ) : null}
          </div>)
        : null}
      </div>
    );
  }
);


const SelectInput = styled.div`
  flex: 1;
  margin-left: 8px;
`;


const CommitmentWrapper = styled.div`
  margin: 10px;
  display: flex;
  align-items: center;
`;


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
  padding-top: 2px;
  height: 38px;
`;

const Wrapper = styled.div`
  ${clearFix()};
  margin: 0 10px;
  margin-bottom: 10px;
  position: relative;
  z-index: 999999;
  display: grid;
  grid-template-columns: 2fr 2fr;
  grid-column-gap: 8px;
`;

const SelectContainer = styled.div`
  ${clearFix()};
  position: relative;
  z-index: 9999;
`;

const Span = styled.span`
  ${clearFix()};
  box-sizing: border-box;
  color: #848f99;
  fill: #848f99;
  flex: 0 0 auto;
  font-size: 13px;
  height: 30px;
  line-height: 1;
  transition: 200ms box-shadow, 200ms color, 200ms background, 200ms fill;
  width: 30px;
  background: #fff;
  border: 1px solid #b7bfc6;
  border-radius: 50%;
  align-items: center;
  border-style: dashed;
  display: flex;
  flex-shrink: 0;
  justify-content: center;
  transition: none;
`;
