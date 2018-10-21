import React from 'react'
import styled from 'styled-components'

const Form = styled.form`
  background: ${props => props.theme.color.p900};
  position: absolute;
  z-index: 9;
  left: 0;
  right: 0;
  top: 36px;
`

const Item = styled.div`
height: 50px;
border-bottom: 1px solid rgba(240,240,240, .1);
line-height: 50px;
`

const Option = styled.div`
padding-left: 10px;
color: #f0f0f0;
font-size: 14px;
`

export default ({ onPlanQuery }) => (
    <Form>
      <Item>
        <Option>
          <input
            style={{marginRight: '10px'}}
            id="active"
            type="radio"
            name="plans"
            defaultChecked
            onChange={() => onPlanQuery("Active")}
          />
          <label htmlFor="active">Show only active plans</label>
        </Option>
      </Item>
      <Item>
        <Option>
          <input
          style={{marginRight: '10px'}}
            id="all"
            type="radio"
            name="plans"
            onChange={() => onPlanQuery("All")}
          />
          <label htmlFor="all">Show all plans</label>
        </Option>
      </Item>
      <Item>
        <Option>
          <input
          style={{marginRight: '10px'}}
            id="closed"
            type="radio"
            name="plans"
            onChange={() => onPlanQuery("Closed")}
          />
          <label htmlFor="closed">Show only closed plans</label>
        </Option>
      </Item>
    </Form>
  );