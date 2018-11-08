import React from "react";
import styled, { css } from "styled-components";
import { clearFix, placeholder } from "polished";
import LogEvent from "../createReqInProcess/";
import Select from "react-select";
import { compose, withState } from "recompose";
import { withFormik, Field, Form } from "formik";
import * as Yup from "yup";
import moment from "moment";
import { graphql } from "react-apollo";
import { Icons } from "oce-components/build";
import Input from "../../atoms/input";
import Textarea from "../../atoms/textarea";
import Alert from "../alert";
import { outputReqs, inputReqs } from "./options";
import Button from "../../atoms/button";
import withNotif from "../notification";
import CreateProcess from "../../mutations/createProcess";
import CreateCommitment from "../../mutations/CreateCommitment";
import DateRangeSelect from '../dateRangeSelect'
import GroupSelect from "../groupSelect";


class NewProcess extends React.Component {
  render() {
    const {
      providerId,
      scopeId,
      errors,
      touched,
      focusedInput,
      onFocusedInput,
      setFieldValue,
      inputs,
      outputs,
      onInput,
      onOutput,
      values,
      toggleModal,
      addIntent
    } = this.props;
    return (
      <Form>
        <PlanWrapper>
          <ProcessInput>
            <Field
              name="title"
              render={({ field }) => (
                <Input
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Type the name of the process..."
                />
              )}
            />
            {errors.title && touched.title && <Alert>{errors.title}</Alert>}
          </ProcessInput>
          <ClearFix>
            <GroupSelect
              setFieldValue={setFieldValue}
            />
            <DateRangeSelect 
              setFieldValue={setFieldValue}
              start={values.start}
              due={values.due}
              errors={errors}
              touched={touched}
            />
          </ClearFix>
          <Note>
            <NoteIcon>
              <Icons.Text width="16" height="16" color="#b7bfc6" />
            </NoteIcon>
            <Field
              name="note"
              render={({ field }) => (
                <Textarea
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Type the note of the process"
                />
              )}
            />
          </Note>
        </PlanWrapper>
        <Wrapper>
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
                      options={inputReqs}
                    />
                  )}
                />
                {errors.inputAction &&
                  touched.inputAction && <Alert>{errors.inputAction}</Alert>}
              </CommitmentWrapper>
              {values.inputAction ? (
                <Actions style={{ margin: "0 10px" }}>
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
                <SentenceTemporary output={"true"} key={j}>
                  <Sentence output>
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
                      options={outputReqs}
                    />
                  )}
                />
                {errors.inputAction &&
                  touched.inputAction && <Alert>{errors.inputAction}</Alert>}
              </CommitmentWrapper>
              {values.outputAction ? (
                <Actions style={{ margin: "0 10px" }}>
                  <LogEvent
                    closeTab={() => setFieldValue("outputAction", null)}
                    action={values.outputAction}
                    providerId={providerId}
                    scopeId={scopeId}
                    addIntent={addIntent}
                    closeLogEvent={toggleModal}
                    inputs={outputs}
                    onInput={onOutput}
                  />
                </Actions>
              ) : null}
            </Actions>
          ) : null}
        </Wrapper>
        <ActionsProcess>
          <Button type='submit'>Publish</Button>
          <Button outline>Cancel</Button>
        </ActionsProcess>
      </Form>
    );
  }
}

export default compose(
  withNotif(
    "Process created successfully!",
    "Error! Process has not been created."
  ),
  withState("inputs", "onInput", []),
  withState("outputs", "onOutput", []),
  withState("focusedInput", "onFocusedInput", "startDate"),
  graphql(CreateProcess, { name: "createProcessMutation" }),
  graphql(CreateCommitment, { name: "CreateCommitmentMutation" }),
  withFormik({
    mapPropsToValues: props => ({
      scope: null,
      inputAction: null,
      outputAction: null,
      note: "",
      title: "",
      start: null,
      due: null
    }),
    validationSchema: Yup.object().shape({
      scope: Yup.object().required(),
      note: Yup.string(),
      due: Yup.object(),
      start: Yup.object(),
      title: Yup.string().required()
    }),
    handleSubmit: (values, { props, resetForm, setErrors, setSubmitting }) => {
      let due = moment(values.due).format("YYYY-MM-DD");
      let start = moment(values.start).format("YYYY-MM-DD");

      setSubmitting(true);
      let vars = {
        token: localStorage.getItem("oce_token"),
        name: values.title,
        note: values.note,
        scope: values.scope.value,
        due: due,
        start: start
      };
      return props
        .createProcessMutation({
          variables: vars
        })
        .then(res => {
          return Promise.all(
            props.inputs.map(input => {
            let date = moment(input.date).format("YYYY-MM-DD");
            let inputVars = {
              token: localStorage.getItem("oce_token"),
              action: input.action.toLowerCase(),
              due: date,
              note: input.note,
              committedResourceClassifiedAsId:
                input.affectedResourceClassifiedAsId.value,
              committedUnitId: input.unit.value,
              committedNumericValue: input.numericValue,
              inputOfId: res.data.createProcess.process.id,
              scopeId: values.scope.value
            };
            return props.CreateCommitmentMutation({
              variables: inputVars,
            })
          }).concat(props.outputs.map(input => {
            let date = moment(input.date).format("YYYY-MM-DD");
            let inputVars = {
              token: localStorage.getItem("oce_token"),
              action: input.action.toLowerCase(),
              due: date,
              note: input.note,
              committedResourceClassifiedAsId:
                input.affectedResourceClassifiedAsId.value,
              committedUnitId: input.unit.value,
              committedNumericValue: input.numericValue,
              outputOfId: res.data.createProcess.process.id,
              scopeId: values.scope.value
            };
            props.CreateCommitmentMutation({
              variables: inputVars,
            })
          })))
        })
        .then(res => {
          console.log(res)
          return props.onSuccess()
        })
        .catch(err => {
          console.log(err);
          return props.onError();
        });
    }
  })
)(NewProcess);


const NoteIcon = styled.div`
  position: absolute;
  top: 17px;
  left: 0px;
`;

const Note = styled.div`
position: relative;
border-top: 1px solid #e0e6e8;;
margin-bottom: 0px;
margin-top: 4px;
display: flex;
${clearFix()}
  & textarea {
    margin-left: 20px;
    margin-top: 10px;
    outline: none;
    float: left
    min-height: 30px;
    resize: none;
    font-size: 14px;
    line-height: 20px;
    clear: both;
    font-weight: 400;
    overflow: hidden;
    word-wrap: break-word;
    color: #333;
    border: none;
    margin: 0;
    background: transparent;
    box-sizing: border-box;
    text-indent: 10px;
    margin-top: 10px;
    margin-left: 20px;
    padding-left: 0;
    flex: 1;
    border: 1px solid transparent;
    &:hover {
      border: 1px solid #cccccc;
    }
    ${placeholder({ color: "#b2b2bc6" })};
  }
`;

const Actions = styled.div`
  ${clearFix()};
`;

const ActionsProcess = styled.div`
  ${clearFix()};
  margin: 8px 0;
  margin-right: 8px;
  & button {
    float: right;
    margin-left: 8px;
  }
`;
const ClearFix = styled.div`
  ${clearFix()};
`;
const SentenceTemporary = styled.div`
  background: ${props => props.theme.color.b100};
  padding: 0 8px;
  color: #f0f0f0;
  margin-top: 8px;
  margin-left: 40px;
  margin-right: 10px;
  position: relative;
  border-radius: 4px;
  ${props =>
    props.output &&
    css`
      background: #3871ac;
    `};
  &: before {
    position: absolute;
    content: "";
    left: -30px;
    top: 5px;
    width: 14px;
    height: 14px;
    border-radius: 100px;
    display: block;
    background: #dee1e4;
  }
  &: after {
    position: absolute;
    content: "";
    left: -24px;
    top: 10px;
    width: 1px;
    bottom: -20px;
    display: block;
    background: #dee1e4;
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
  font-size: 14px;
  position: relative;
  ${props =>
    props.output &&
    css`
      &:before {
        border-right: 10px solid #3871ac !important;
      }
    `};
  &:before {
    position: absolute;
    content: "";
    width: 0;
    left: -16px;
    height: 0;
    top: 4px;
    border-top: 8px solid transparent;
    border-bottom: 8px solid transparent;
    border-right: 10px solid #3497ff;
}
  }
`;

const CommitmentWrapper = styled.div`
  margin: 10px;
`;

const ProcessInput = styled.div``;

const PlanWrapper = styled.div`
  ${clearFix()};
  margin-top: 10px;
  display: flex;
  margin-left: 10px;
  flex-direction: column;
  & input {
    background: transparent;
    border: 1px solid transparent;
    font-size: 16px;
    color: #282b30;
    letter-spacing: 1px;
    ${placeholder({
      color: "#282B30",
      fontSize: "16px",
      letterSpacing: "1px"
    })};
  }
  & textarea {
  }
`;

const Wrapper = styled.div`
  ${clearFix()};
  margin-bottom: 5px;
  position: relative;
  z-index: 999999;
`;

const SelectContainer = styled.div`
  ${clearFix()};
  margin-top: 8px;
  position: relative;
  z-index: 9999;
`;
