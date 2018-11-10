import React from "react";
import styled, { css } from "styled-components";
import { clearFix, placeholder } from "polished";
import LogEvent from "../createReqInProcess/";
import Select from "react-select";
import { compose, withState, withHandlers } from "recompose";
import { withFormik, Field, Form } from "formik";
import * as Yup from "yup";
import moment from "moment";
import { graphql } from "react-apollo";
import Input from "../../atoms/input";
import Alert from "../alert";
import { outputReqs, inputReqs } from "./options";
import Button from "../../atoms/button";
import withNotif from "../notification";
import CreateProcess from "../../mutations/createProcess";
import CreateCommitment from "../../mutations/CreateCommitment";
import DateRangeSelect from "../dateRangeSelect";
import GroupSelect from "../groupSelect";
import AddNote from "../addNote";
import Gantt from "../gantt";
import { Icons } from "oce-components/build";

class NewProcess extends React.Component {
  render() {
    const {
      providerId,
      scopeId,
      errors,
      touched,
      deleteReq,
      setFieldValue,
      inputs,
      onInput,
      values,
      toggleModal,
      addIntent
    } = this.props;
    console.log(inputs);
    
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
            <GroupSelect setFieldValue={setFieldValue} />
            <DateRangeSelect
              setFieldValue={setFieldValue}
              start={values.start}
              due={values.due}
              errors={errors}
              touched={touched}
            />
          </ClearFix>
          <AddNote setFieldValue={setFieldValue} />
        </PlanWrapper>
        <Wrapper>
          {/* <Gantt /> */}
          {values.scope ? (
            <Actions>
              {inputs.map((i, j) => (
                <SentenceTemporary key={j}>
                  <Sentence>
                    {`${i.action} ${i.numericValue} ${i.unit.label} of ${
                      i.affectedResourceClassifiedAsId.label
                    }`}
                  </Sentence>
                  <SentenceNote>{i.note}</SentenceNote>
                  <span onClick={() => deleteReq(j)}><Icons.Trash width='16' height='16' color="#ffffff78" /></span>
                </SentenceTemporary>
              ))}
              
              <CommitmentWrapper>
                <Span>
                  <Icons.Plus width="20" height="20" color="f0f0f020" />
                </Span>
                <SelectInput>
                  <Field
                    name="inputAction"
                    render={({ field }) => (
                      <Select
                        isClearable
                        name={field.name}
                        onChange={val =>
                          setFieldValue("inputAction", val ? val.value : null)
                        }
                        placeholder="Add a new requirement"
                        options={inputReqs}
                      />
                    )}
                  />
                </SelectInput>
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
                    type={values.inputAction ? "input" : "output"}
                  />
                </Actions>
              ) : null}
            </Actions>
          ) : null}
        </Wrapper>

        <ActionsProcess>
          <Button type="submit">Publish</Button>
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
  withHandlers({
    deleteReq: props => (i) => {
      props.inputs.splice(i, 1)
      return props.onInput(props.inputs)
    }
  }),
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
      console.log(values);
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
            props.inputs
              .map(input => {
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
                  variables: inputVars
                });
              })
          );
        })
        .then(res => {
          console.log(res);
          return props.onSuccess();
        })
        .catch(err => {
          console.log(err);
          return props.onError();
        });
    }
  })
)(NewProcess);

const Actions = styled.div`
  ${clearFix()};
`;
const SelectInput = styled.div`
  flex: 1;
  margin-left: 8px;
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
  margin-left: 10px;
  margin-right: 10px;
  position: relative;
  border-radius: 4px;
  position: relative;
  & span {
    position: absolute;
    right: 10px;
    top: 7px;
    cursor: pointer;
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
  }
`;

const CommitmentWrapper = styled.div`
  margin: 10px;
  display: flex;
  align-items: center;
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
