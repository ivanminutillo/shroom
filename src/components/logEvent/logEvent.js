import React from "react";
import { Button, Input, Textarea, Icons } from "oce-components/build";
import DatePicker from "react-datepicker";
import { Form, Field } from "formik";
// import Alert from "../../alert";
import { ApolloConsumer } from "react-apollo";
import { placeholder } from "polished";
import Log from "./styled";
import Select from "react-select";
import styled from "styled-components";
import Units from "./unit";
import Events from "./events";
import AsyncSelect from "react-select/lib/Async";
import getResourcesQuery from "../../queries/getResources";
import Alert from "../alert";
import BoxHeader from "../smartSentence/boxHeader";
require("react-datepicker/dist/react-datepicker-cssmodules.css");

const StartDate = props => {
  const handleChange = value => {
    props.onChange("date", value);
  };
  return (
    <Log.ItemDate>
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
    </Log.ItemDate>
  );
};

const Action = styled.div`
  flex: 2;
  margin-right: 8px;
`;
const Qty = styled.div`
  flex: 1;
  border-radius: 3px;
  margin-right: 8px;
  max-height: 36px;
  text-align: center;
  & input {
    width: 100%;
    text-align: center;
    background: #4F576C;
    color: #f0f0f0;
    height: 38px;
    border: 1px solid #7D849A50;
    ${placeholder({ color: "#f0f0f0" })};
  }
`;
const Unit = styled.div`
  flex: 2;
`;
const Resource = styled.div`
  margin-bottom: 8px;
`;
const Row = styled.div`
  display: flex;
  padding: 8px 0;
  & input {
    ${placeholder({ color: "#f0f0f0" })};
  }
`;

const LogEvent = props => {
  const promiseOptions = (client, val) => {
    return client
      .query({
        query: getResourcesQuery,
        variables: { token: localStorage.getItem("oce_token") }
      })
      .then(res => {
        let options = res.data.viewer.allResourceClassifications.map(
          resource => ({
            value: resource.id,
            label: resource.name
          })
        );
        let newOpt = options.filter(i =>
          i.label.toLowerCase().includes(val.toLowerCase())
        );
        return newOpt;
      });
  };

  const customStyles = {
    control: base => ({
      ...base,
      background: '#4F576C',
      border: '1px solid #7D849A50',
      color: '#f0f0f0'
    }),
    placeholder: base => ({
      ...base,
      color: '#f0f0f0',
      fontSize: '14px'
    })
  };
  
  const {
    values,
    setFieldValue,
    handleMenuSelection,
    errors,
    touched,
    setFieldTouched,
    menuSelected
  } = props;
  return (
    <ApolloConsumer>
      {client => (
        <Form>
          <Log.Module>
            <BoxHeader
              menuSelected={menuSelected}
              handleMenuSelection={handleMenuSelection}
            />
            <Log.Log>
              <Row>
                <Action>
                  <Field
                    name={"action"}
                    render={({ field }) => (
                      <Select
                        onChange={val =>
                          props.setFieldValue("action", val.value)
                        }
                        options={Events}
                        styles={customStyles}
                      />
                    )}
                  />
                  {errors.action &&
                    touched.action && <Alert>{errors.action}</Alert>}
                </Action>
                <Qty>
                  <Field
                    name="numericValue"
                    render={({ field }) => (
                      <Input
                        value={field.value}
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
                    render={({ field }) => (
                      <Select
                        onChange={val => props.setFieldValue("unit", val.value)}
                        options={Units}
                        styles={customStyles}
                      />
                    )}
                  />
                  {errors.unit && touched.unit && <Alert>{errors.unit}</Alert>}
                </Unit>
              </Row>
              <Resource>
                <Field
                  name="affectedResourceClassifiedAsId"
                  render={({ field }) => (
                    <AsyncSelect
                      placeholder={"Select a classification..."}
                      defaultOptions
                      cacheOptions
                      styles={customStyles}
                      onChange={val =>
                        props.setFieldValue(
                          "affectedResourceClassifiedAsId",
                          val.value
                        )
                      }
                      loadOptions={val => promiseOptions(client, val)}
                    />
                  )}
                />
                {errors.affectedResourceClassifiedAsId &&
                  touched.affectedResourceClassifiedAsId && (
                    <Alert>{errors.affectedResourceClassifiedAsId}</Alert>
                  )}
              </Resource>
            </Log.Log>
            {/* </div> */}
            <Log.Note>
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
              <Button type="submit">Publish</Button>
            </Log.PublishActions>
          </Log.Module>
        </Form>
      )}
    </ApolloConsumer>
  );
};

export default LogEvent;
