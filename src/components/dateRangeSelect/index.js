import React from "react";
import styled from "styled-components";
import {Icons} from 'oce-components/build'
import {placeholder} from 'polished'
import DatePicker from "react-datepicker";
require("react-datepicker/dist/react-datepicker-cssmodules.css");


export default props => (
  <ItemDate>
    <span>
      <Icons.Calendar width="16" height="16" color="#b7bfc6" />
    </span>
    <StartDate
      value={props.start}
      onChange={props.setFieldValue}
      error={props.errors.start}
      touched={props.touched.start}
      end={props.due}
    />
    <SpanArrow>
      <Icons.Right width="20" height="20" color="#b7bfc6" />
    </SpanArrow>
    <DueDate
      start={props.start}
      value={props.due}
      onChange={props.setFieldValue}
      error={props.errors.due}
      touched={props.touched.due}
    />
  </ItemDate>
);


const StartDate = props => {
    const handleChange = value => {
      props.onChange("start", value);
    };
    return (
      <DatePicker
        selectsStart
        startDate={props.value}
        endDate={props.end}
        selected={props.value}
        onChange={handleChange}
        placeholderText="Start date"
        dateFormat={"DD MMM"}
      />
    );
  };
  const DueDate = props => {
    const handleChange = value => {
      props.onChange("due", value);
    };
    return (
      <DatePicker
        selectsEnd
        startDate={props.start}
        endDate={props.value}
        selected={props.value}
        onChange={handleChange}
        placeholderText="Due date"
        dateFormat={"DD MMM"}
      />
    );
  };
  

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
  margin-top: 4px;
  margin-left: 8px;
  z-index: 999999999999999999;
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
    padding: 0;
    background: transparent;
    height: 30px;
    line-height: 30px;
    color: #757575;
    font-size: 13px !important;
    font-weight: 400;
    text-align: center;
    margin: 0;
    width: 80px;
    ${placeholder({
      fontSize: '13px !important'
    })}
  }
`;


const SpanArrow = styled.i`
  box-sizing: border-box;
  text-align: center;
  vertical-align: sub;
  display: inline-flex;

`;
