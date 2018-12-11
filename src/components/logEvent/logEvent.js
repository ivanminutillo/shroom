import React from "react";
import Icons from '../../atoms/icons.tsx'
import Button from '../../atoms/button'
import Input from '../../atoms/input.tsx'
import Textarea from '../../atoms/textarea.tsx'
import DatePicker from "react-datepicker";
import { Form, Field } from "formik";
import { ApolloConsumer } from "react-apollo";
import { placeholder } from "polished";
import Log from "./styled";
import Select from "react-select";
import styled from "styled-components";
import Units from "./unit";
import Events from "./events";
import AsyncSelect from "react-select/lib/Async";
import Alert from "../alert";
import {getAllResources} from '../../helpers/asyncQueries'
require("react-datepicker/dist/react-datepicker-cssmodules.css");


const LogEvent = ({
  values,
  setFieldValue,
  handleMenuSelection,
  errors,
  touched,
  closeLogEvent,
  setFieldTouched,
  menuSelected,
  scopeId
}) => (
    <ApolloConsumer>
      {client => (
        <Form>
          <Log.Module>
            <Log.Log>
              <Row>
                <Action>
                  <Field
                    name={"action"}
                    render={({ field }) => {
                      return (
                        <Select
                          onChange={val =>
                            setFieldValue("action", {
                              value: val.value,
                              label: val.label
                            })
                          }
                          options={Events}
                          // styles={customStyles}
                          value={field.value}
                          placeholder="Select an event"
                        />
                      );
                    }}
                  />
                  {errors.action &&
                    touched.action && <Alert>{errors.action}</Alert>}
                </Action>
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
                    touched.numericValue && (
                      <Alert>{errors.numericValue}</Alert>
                    )}
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
                          placeholder="Select a unit"
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
                        // styles={customStyles}
                        onChange={val =>
                          setFieldValue(
                            "affectedResourceClassifiedAsId",
                            { value: val.value, label: val.label }
                          )
                        }
                        loadOptions={val => getAllResources(client, scopeId, val)}
                      />
                    )}
                  />
                  {errors.affectedResourceClassifiedAsId &&
                    touched.affectedResourceClassifiedAsId && (
                      <Alert>{errors.affectedResourceClassifiedAsId}</Alert>
                    )}
                </Resource>
              </Row>
            </Log.Log>
            {/* </div> */}
            <Log.Note>
              <NoteIcon><Icons.Text width='16' height='16' color='#b7bfc6' /></NoteIcon>
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
            </Log.Note>

            <Log.PublishActions>
              <StartDate
                value={values.date}
                onChange={setFieldValue}
                onBlur={setFieldTouched}
                error={errors.start}
                touched={touched.start}
              />
              <Button  type="submit">Publish</Button>
              {closeLogEvent ? <Button outline onClick={closeLogEvent}>Cancel</Button> : null}
            </Log.PublishActions>
          </Log.Module>
        </Form>
      )}
    </ApolloConsumer>
  );

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
  grid-template-columns: 2fr 1fr 2fr 3fr;
  grid-column-gap: 4px;
  & input {
    ${placeholder({ color: "#333" })};
  }
`;


const NoteIcon = styled.div`
    position: absolute;
    top: 17px;
    left: 0px;`

const StartDate = props => {
  const handleChange = value => {
    props.onChange("date", value);
  };
  return (
    <Log.ItemDate>
      <span>
        <Icons.Calendar  width='16' height='16' color='#b7bfc6' />
      </span>
      <DatePicker
        selected={props.value}
        onChange={handleChange}
        dateFormat={"DD MMM"}
        withPortal
      />
      {/* {props.error && props.touched && <Alert>{props.error}</Alert>} */}
    </Log.ItemDate>
  );
};


export default LogEvent;
