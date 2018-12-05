import React from "react";
import styled from "styled-components";
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
import { inputReqs } from "../../atoms/eventTypes";
import Button from "../../atoms/button";
import withNotif from "../notification";
import CreateProcess from "../../mutations/createProcess";
import CreateCommitment from "../../mutations/CreateCommitment";
import DateRangeSelect from "../dateRangeSelect";
// import Timeline from "./timeline";
import Requirement from '../../atoms/shining_star.png'
import Process from '../../atoms/shooting_star.png'

class NewProcess extends React.Component {
  render() {
    const {
      providerId,
      scopeId,
      errors,
      touched,
      setFieldValue,
      inputs,
      onInput,
      values,
      toggleModal,
      addIntent
    } = this.props;
    return (
      <Form>
        <PlanWrapper>
          <ProcessInput>
             <SpanIcon style={{backgroundImage: `url(${Process})`}}/>
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
          <Grid>
            <DateRangeSelect
              setFieldValue={setFieldValue}
              start={values.start}
              due={values.due}
              errors={errors}
              touched={touched}
            />
          </Grid>
        </PlanWrapper>
        <Wrapper>
            <Actions>
              <CommitmentWrapper>
                <SpanIcon style={{backgroundImage: `url(${Requirement})`}}/>
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
                    closeLogEvent={() => setFieldValue("inputAction", null)}
                    action={values.inputAction}
                    providerId={providerId}
                    scopeId={scopeId}
                    addIntent={addIntent}
                    inputs={inputs}
                    onInput={onInput}
                    type={values.inputAction ? "input" : "output"}
                  />
                </Actions>
              ) : null}
              {inputs.length > 0 ? (
                null
                // <Timeline
                //   onInput={onInput}
                //   start={values.start}
                //   end={values.due}
                //   deleteReq={deleteReq}
                //   inputs={inputs}
                // />
              ) : null}
            </Actions>
        </Wrapper>
        {values.inputAction ? null : (
          <ActionsProcess>
            <Button type="submit">Create process</Button>
            <Button outline onClick={toggleModal}>
              Cancel
            </Button>
          </ActionsProcess>
        )}
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
    deleteReq: props => i => {
      props.inputs.splice(i, 1);
      return props.onInput(props.inputs);
    }
  }),
  graphql(CreateProcess, { name: "createProcessMutation" }),
  graphql(CreateCommitment, { name: "CreateCommitmentMutation" }),
  withFormik({
    mapPropsToValues: props => ({
      scope: props.scopeId,
      inputAction: null,
      outputAction: null,
      title: "",
      start: moment(),
      due: moment()
    }),
    validationSchema: Yup.object().shape({
      due: Yup.object().required(),
      start: Yup.object().required(),
      title: Yup.string().required()
    }),
    handleSubmit: (values, { props, resetForm, setErrors, setSubmitting }) => {
      let due = moment(values.due).format("YYYY-MM-DD");
      let start = moment(values.start).format("YYYY-MM-DD");
      setSubmitting(true);
      let vars = {
        token: localStorage.getItem("oce_token"),
        name: values.title,
        note: props.note,
        scope: props.scopeId,
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
              let due = moment(input.due).format("YYYY-MM-DD");
              let start = moment(input.start).format("YYYY-MM-DD");
              let inputVars = {
                token: localStorage.getItem("oce_token"),
                action: input.action.toLowerCase(),
                due: due,
                start: start,
                note: input.note,
                committedResourceClassifiedAsId:
                  input.affectedResourceClassifiedAsId.value,
                committedUnitId: input.unit.value,
                committedNumericValue: input.numericValue,
                inputOfId: res.data.createProcess.process.id,
                scopeId: props.scopeId
              };
              return props.CreateCommitmentMutation({
                variables: inputVars
              });
            })
          );
        })
        .then(res => {
          let processId = res[0].data.createCommitment.commitment.inputOf
            ? res[0].data.createCommitment.commitment.inputOf.id
            : res[0].data.createCommitment.commitment.outputOf.id
            props.onSuccess();
          props.toggleModal()
          props.history.push("/process/" + processId);
          return null;
        })
        .catch(err => {
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
  position: relative;
  z-index: 999999999999999999999999999999999999999;
`;

const SpanIcon = styled.span`
  ${clearFix()};
  cursor: pointer;
  margin-right: 8px;
  display: inline-block;
  width: 18px;
  height: 18px;
  background-size: contain;
  vertical-align: sub;
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
const Grid = styled.div`
  ${clearFix()};
  margin-left: -10px;
`;

const CommitmentWrapper = styled.div`
  margin: 10px;
  display: flex;
  align-items: center;
`;

const ProcessInput = styled.div`
  margin-right: 10px;
  display: flex;
  & span {
    width: 18px;
  }
  & input {
    flex: 1;
    margin-top: -8px;
    ${placeholder({
      color: "#282B30",
      fontSize: "14px",
      letterSpacing: ".5px"
    })};
  }
`;

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
  z-index: 99999;
`;
