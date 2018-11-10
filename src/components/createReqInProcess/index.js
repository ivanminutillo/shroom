import React from "react";
import { Icons } from "oce-components/build";
import Button from "../../atoms/button";
import Input from "../../atoms/input";
import Textarea from "../../atoms/textarea";
import DatePicker from "react-datepicker";
import { Form, Field } from "formik";
import { ApolloConsumer } from "react-apollo";
import Select from "react-select";
import styled from "styled-components";
import Units from "../logEvent/unit";
import AsyncSelect from "react-select/lib/Async";
import Alert from "../alert";
import { clearFix, placeholder } from "polished";
import media from "styled-media-query";
import { getResourcesByAction } from "../../helpers/asyncQueries";
import { compose, withHandlers, withState } from "recompose";
import moment from "moment";
import { withFormik } from "formik";
import * as Yup from "yup";
import DateRangeSelect from "../dateRangeSelect";

require("react-datepicker/dist/react-datepicker-cssmodules.css");

export default compose(
  withFormik({
    mapPropsToValues: props => ({
      action: props.action,
      note: "",
      numericValue: "00.00" || "",
      unit: null,
      due: moment(),
      start: moment(),
      affectedResourceClassifiedAsId: null
    }),
    validationSchema: Yup.object().shape({
      action: Yup.object().required(),
      note: Yup.string(),
      numericValue: Yup.number(),
      unit: Yup.object().required(),
      due: Yup.string(),
      start: Yup.string(),
      affectedResourceClassifiedAsId: Yup.object().required(
        "Classification is a required field"
      )
    })
  }),
  withHandlers({
    onAdd: props => e => {
      e.preventDefault();
      let i = {
        action: props.action,
        start: props.values.start,
        due: props.values.due,
        note: props.values.note,
        numericValue: props.values.numericValue,
        unit: props.values.unit,
        affectedResourceClassifiedAsId:
          props.values.affectedResourceClassifiedAsId,
        type: props.type
      };
      props.inputs.push(i);
      props.onInput(props.inputs);
      return props.closeTab();
    }
  })
)(
  ({
    values,
    setFieldValue,
    errors,
    touched,
    setFieldTouched,
    closeLogEvent,
    action,
    onAdd,
    type
  }) => {
    return (
      <ApolloConsumer>
        {client => (
          <div>
            <Module>
              <Row>
                <Qty>
                  <Value>
                    <Field
                      name="numericValue"
                      render={({ field }) => (
                        <Input
                          name={field.name}
                          onChange={field.onChange}
                          type="number"
                          min="00.00"
                          max="100.00"
                          step="0.1"
                          placeholder="00.00"
                        />
                      )}
                    />
                  </Value>
                  {values.unit ? <Unit>{values.unit.label}</Unit> : null}
                </Qty>
                {errors.numericValue &&
                  touched.numericValue && <Alert>{errors.numericValue}</Alert>}
                {/* <Unit> */}
                {/* <Field
                  name={"unit"}
                  render={({ field }) => {
                    return (
                      <Select
                        onChange={val =>
                          setFieldValue("unit", {
                            value: val.value,
                            label: val.label
                          })
                        }
                        options={Units}
                        // styles={customStyles}
                        placeholder="Unit..."
                        value={field.value}
                      />
                    );
                  }}
                />
                {errors.unit && touched.unit && <Alert>{errors.unit}</Alert>} */}
                {/* </Unit> */}
                <Resource>
                  <Field
                    name="affectedResourceClassifiedAsId"
                    render={({ field }) => (
                      <AsyncSelect
                        placeholder="Select a classification..."
                        defaultOptions
                        cacheOptions
                        value={field.value}
                        onChange={val => {
                          setFieldValue("unit", {
                            value: val.value.unitId,
                            label: val.value.unitName
                          });
                          return setFieldValue(
                            "affectedResourceClassifiedAsId",
                            {
                              value: val.value.value,
                              label: val.label
                            }
                          );
                        }}
                        loadOptions={val =>
                          getResourcesByAction(client, action, val)
                        }
                      />
                    )}
                  />
                  {errors.affectedResourceClassifiedAsId &&
                    touched.affectedResourceClassifiedAsId && (
                      <Alert>{errors.affectedResourceClassifiedAsId}</Alert>
                    )}
                </Resource>
              </Row>
              <Note>
                <NoteIcon>
                  <Icons.Text width="16" height="16" color="#b7bfc6" />
                </NoteIcon>
                <Field
                  name="note"
                  render={({ field }) => (
                    <Textarea
                      value={field.value}
                      name={field.name}
                      onChange={field.onChange}
                      placeholder={"Type a note..."}
                    />
                  )}
                />
              </Note>

              <PublishActions>
                <DateRangeSelect
                  setFieldValue={setFieldValue}
                  start={values.start}
                  due={values.due}
                  errors={errors}
                  touched={touched}
                />
                {/* <StartDate
                value={values.date}
                onChange={setFieldValue}
                onBlur={setFieldTouched}
                error={errors.start}
                touched={touched.start}
              /> */}
                <Button onClick={onAdd} type="submit">
                  Publish
                </Button>
                <Button outline onClick={closeLogEvent}>
                  Cancel
                </Button>
              </PublishActions>
            </Module>
          </div>
        )}
      </ApolloConsumer>
    );
  }
);

const NoteIcon = styled.div`
  position: absolute;
  top: 17px;
  left: 0px;
`;

const Module = styled.div`
  ${clearFix()};
  background: #f6f8f9;
  padding: 10px;
  margin: 10px 0;
  border-radius: 4px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.15);
  position: relative;
  ${media.lessThan("medium")`
    width: 100%;
    left: 0;
    margin: 0;
  `};
`;

const PublishActions = styled.div`
  height: 36px;
  padding: 0 10px;
  ${clearFix} & button {
    float: right;
    width: 120px;
    margin: 0;
    box-shadow: none;
    margin-top: 2px;
    margin-left: 8px;
  }
`;

const Value = styled.div``;

const Qty = styled.div`
  max-height: 36px;
  text-align: center;
  display: flex;
  box-sizing: border-box;
  & input {
    width: 100%;
    float: left;
    text-align: left;
    color: #333;
    height: 34px;
    border: 0px solid #7d849a50;
    background: transparent;
    font-size: 16px;
    ${placeholder({ color: "hsl(0,0%,50%) !important", fontSize: "16px" })};
  }
`;

const Unit = styled.div`
  height: 34px;
  line-height: 34px;
  text-align: left;
  width: auto;
  flex: 1;
  font-size: 14px;
  padding: 0 12px;
  color: hsl(0, 0%, 100%);
  background: #0a3649;
  border-radius: 100px;
`;

const Resource = styled.div`
  margin-bottom: 8px;
`;
const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 4fr;
  grid-column-gap: 4px;
  & input {
    ${placeholder({ color: "#333" })};
  }
`;

const Note = styled.div`
position: relative;
border-top: 1px solid #e0e6e8;;
margin: 10px;
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

const ItemDate = styled.div`
  background: transparent;
  border-color: #b7bfc6;
  color: #646f79;
  fill: #848f99;
  align-items: center;
  border: 1px solid transparent;
  border-radius: 18px;
  display: inline-flex;
  flex: 1 1 auto;
  min-width: 1px;
  padding: 3px;
  padding-right: 10px;
  position: relative;
  transition: 0.2s box-shadow, 0.2s color;
  float: left;
  margin-bottom: 0px;
  cursor: pointer;
  &:hover {
    background-color: #f6f8f9;
    border-color: #646f79;
    border-style: solid;
    color: #222b37;
    fill: #222b37;
    cursor: pointer;
    & span {
      background-color: #f6f8f9;
      border-color: #646f79;
      border-style: solid;
      color: #222b37;
      fill: #222b37;
    }
  }
  & span {
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
  }

  & > div {
    display: inline-block;
    margin-top: 2px;
  }

  & input {
    border: none;
    font-size: 14px;
    padding: 0;
    height: 36px;
    width: 70px;
    font-weight: 500;
    background: transparent;
    margin: 0;
    margin-left: 10px;
    height: 30px;
    line-height: 30px;
    color: #757575;
    font-size: 13px;
    font-weight: 400;
  }
`;
