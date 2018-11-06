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
require("react-datepicker/dist/react-datepicker-cssmodules.css");


export default compose(
    withFormik({
      mapPropsToValues: props => ({
        action: props.action,
        note: "",
        numericValue: "00.00" || "",
        unit: null,
        date: moment(),
        affectedResourceClassifiedAsId: null
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
      })
    }),
    withState('inputs', 'onInput', []),
    withHandlers({
      onAdd: props => (e) => {
        e.preventDefault()
        console.log(props)
        let input = {
          action: props.action,
          date: props.values.date,
          note: props.values.note,
          numericValue: props.values.numericValue,
          unit: props.values.unit,
          affectedResourceClassifiedAsId: props.values.affectedResourceClassifiedAsId
        }
        let updatedInputs = props.inputs.push(input)
        return props.onInput(updatedInputs)
      }
    })
  )(({
  values,
  setFieldValue,
  errors,
  touched,
  setFieldTouched,
  closeLogEvent,
  action,
  onAdd
}) => {
  console.log(onAdd)
  return (
    <ApolloConsumer>
      {client => (
        <form>
          <Module>
            <Row>
              <Qty>
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
                {errors.numericValue &&
                  touched.numericValue && <Alert>{errors.numericValue}</Alert>}
              </Qty>
              <Unit>
                <Field
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
                {errors.unit && touched.unit && <Alert>{errors.unit}</Alert>}
              </Unit>
              <Resource>
                <Field
                  name="affectedResourceClassifiedAsId"
                  render={({ field }) => (
                    <AsyncSelect
                      placeholder="Select a classification..."
                      defaultOptions
                      cacheOptions
                      value={field.value}
                      onChange={val =>
                        setFieldValue("affectedResourceClassifiedAsId", {
                          value: val.value,
                          label: val.label
                        })
                      }
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
              <StartDate
                value={values.date}
                onChange={setFieldValue}
                onBlur={setFieldTouched}
                error={errors.start}
                touched={touched.start}
              />
              <Button onClick={onAdd} type="submit">
                Publish
              </Button>
              <Button gray onClick={closeLogEvent}>
                Cancel
              </Button>
            </PublishActions>
          </Module>
        </form>
      )}
    </ApolloConsumer>
  );
});

const Module = styled.div`
  ${clearFix()};
  position: relative;
  border-radius: 4px;
  z-index: 1;
  background: #e1e1e1;
  padding: 8px;
  margin-top: 8px;
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
    border: 0;
    border-radius: 0;
    margin-left: 8px;
  }
`;

const Action = styled.div``;
const Qty = styled.div`
  border-radius: 3px;
  max-height: 36px;
  text-align: center;
  ${placeholder({ color: "red" })};
  & input {
    width: 100%;
    text-align: center;
    color: #333;
    height: 38px;
    border: 1px solid #7d849a50;
    ${placeholder({ color: "red" })};
  }
`;
const Unit = styled.div``;
const Resource = styled.div`
  margin-bottom: 8px;
`;
const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 3fr;
  grid-column-gap: 4px;
  & input {
    ${placeholder({ color: "#333" })};
  }
`;

const Note = styled.div`
  margin-bottom: 8px;

  & textarea {
    outline: none;
    display: block;
    min-height: 30px;
    resize: none;
    width: 100%;
    font-size: 14px;
    line-height: 20px;
    clear: both;
    font-weight: 400;
    overflow: hidden;
    word-wrap: break-word;
    color: #333;
    border: none;
    margin: 0;
    padding: 8px 16px;
    border: 1px solid #cccccc;
    ${placeholder({ color: "#333" })};
  }
`;
const StartDate = props => {
  const handleChange = value => {
    props.onChange("date", value);
  };
  return (
    <ItemDate>
      <span>
        <Icons.Calendar width="18" height="18" color="#3B99FC" />
      </span>
      <DatePicker
        selected={props.value}
        onChange={handleChange}
        dateFormat={"DD MMM"}
        withPortal
      />
      {/* {props.error && props.touched && <Alert>{props.error}</Alert>} */}
    </ItemDate>
  );
};

const ItemDate = styled.div`
  width: auto;
  margin-right: 0 !important;
  margin-left: 10px;
  float: left;
  height: 36px;
  & span {
    display: inline-block;
    /* margin-top: 5px; */
    line-height: 36px;
    height: 36px;
    vertical-align: sub;
  }

  & > div {
    height: 30px !important;
    display: inline-block;
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
    color: #2587cf;
  }
`;

