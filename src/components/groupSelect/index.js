import React from "react";
import { getRelationships } from "../../helpers/asyncQueries";
import AsyncSelect from "react-select/lib/Async";
import { ApolloConsumer, graphql } from "react-apollo";
import Icons from '../../atoms/icons'
import { Field } from "formik";
import styled from 'styled-components'


export default props => (
  <GroupWrapper>
    <Span>
      <Icons.Card width="16" height="16" color="#b7bfc6" />
    </Span>
    <ApolloConsumer>
      {client => (
        <Field
          name="scope"
          render={({ field }) => (
            <AsyncSelect
              placeholder={"Select a group..."}
              defaultOptions
              cacheOptions
              styles={customStyles}
              value={field.label}
              onChange={val =>
                props.setFieldValue("scope", {
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
  </GroupWrapper>
);

const GroupWrapper = styled.div`
  background: transparent;
  border-color: #b7bfc6;
  color: #646f79;
  fill: #848f99;
  align-items: center;
  border: 1px solid transparent;
  display: inline-flex;
  flex: 1 1 auto;
  min-width: 1px;
  position: relative;
  transition: 0.2s box-shadow, 0.2s color;
  float: left;
  margin-bottom: 0px;
  cursor: pointer;
  z-index: 999999999999999999;

  & > div {
    display: inline-block;
    width: 100%;
    margin-top: 2px;
    margin-left: 8px;
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

const Span = styled.span`
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

const customStyles = {
    control: base => ({
      ...base,
      color: "#333",
      height: "30px"
    }),
    input: base => ({
      ...base,
      color: "#333",
      height: "30px"
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
  