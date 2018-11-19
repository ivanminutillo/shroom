import React from "react";
import s from "styled-components";
import Select from "react-select";
import {withRouter} from 'react-router-dom'
import { clearFix } from "polished";
import { Icons } from "oce-components/build";
export default withRouter(({
  history,
  togglenewRequirementModal,
  togglenewProcessModal,
}) => {
  const openStuff = (val) => {
    if (val.value === 'requirement') {
      return togglenewRequirementModal()
    } else if (val.value === 'process') {
      return togglenewProcessModal()
    }
  }
  return (
  <HeaderWrapper>
    <Navigation>
      <button disabled={history.entries.length > 1 ? false : true} onClick={() => history.goBack()}><Icons.Left width='18' height='18' color={history.entries.length > 1 ? '#f0f0f0' : '#f0f0f080'} /></button>
      <button onClick={() => history.goForward()}><Icons.ArrowRight width='18' height='18' color='#f0f0f0' /></button>
    </Navigation>
    
    <WrapperNew>
        <Select
          styles={customStylesTwo}
          onChange={openStuff}
          value={{value: null, label: 'Add new...'}}
          options={[{value: 'requirement', label: 'Add a new requirement'}, {value: 'process', label: 'Add a new process'}]}
        />
    </WrapperNew>
  </HeaderWrapper>
)});

const Navigation = s.div`
  vertical-align: middle;
  float:left;
  margin-top: 5px;
  margin-left: 8px;
  & button {
    width: 30px;
    border: none;
    height: 25px;
    display: inline-block;
    text-align: center;
    background: #3487dd;
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
    cursor: pointer;
    &[disabled] {
      background: #7d8d9ead;
      &:hover {
        background: #7d8d9ead; 
      }
    }
    &:hover {
      background: #6e5ddf;
    }
    &:last-of-type {
      border-radius: 0;
      border-top-right-radius: 3px;
      border-bottom-right-radius: 3px;
      margin-left: 1px;
    }
    & svg {
      margin-top: 3px;
    }
  }
  `;
  const WrapperNew= s.div`
  cursor: pointer;
  float: right;
  margin-right: 16px;
  margin-top: 3px;
  box-sizing: border-box;
  width: 180px;
  position: relative;
  z-index: 99999;
`

const customStylesTwo = {
  control: base => ({
    ...base,
    background: '#2d81d9',
    border: '1px solid #396ea6',
    color: "#f0f0f0",
    fontWeight: 500,
    fontSize: "13px",
    minHeight: "30px",
    height: "30px",
    borderRadius: "6px"
  }),
  input: base => ({
    ...base,
    color: "#f0f0f0",
    fontWeight: 500,
    fontSize: "13px",
    height: "30px"
  }),
  singleValue: base => ({
    ...base,
    color: "#f0f0f0",
    fontWeight: 500,
    fontSize: "13px"
  }),
  option: base => ({
    ...base,
    fontSize: "13px"
  }),
  menuList: base => ({
    ...base,
    fontSize: "13px"
  }),
  placeholder: base => ({
    ...base,
    color: "#f0f0f0",
    fontWeight: 500,
    fontSize: "13px"
  })
};

const HeaderWrapper = s.div`
  height: 36px;
  ${clearFix()}
  background: ${props => props.theme.color.b100};
  `;

