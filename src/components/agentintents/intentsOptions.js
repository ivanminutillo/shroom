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

export default ({ onIntentQuery, value, profile }) => (
    <Form>
      <Item>
        <Option>
          <input
            style={{marginRight: '10px'}}
            id="All"
            value="All"
            type="radio"
            name="intents"
            checked={'All' === value}
            onChange={() => onIntentQuery("All")}
          />
          <label htmlFor="All">Show all requirements</label>
        </Option>
      </Item>
      {profile ? null :
        <Item>
        <Option>
          <input
          style={{marginRight: '10px'}}
            id="Available"
            value="Available"
            type="radio"
            checked={'Available' === value}
            name="intents"
            onChange={() => onIntentQuery("Available")}
          />
          <label htmlFor="Available">Show available requirements</label>
        </Option>
      </Item>
      }
      {profile ? null :
      <Item>
      <Option>
        <input
        style={{marginRight: '10px'}}
          id="Taken"
          value="Taken"
          type="radio"
          checked={'Taken' === value}
          name="intents"
          onChange={() => onIntentQuery("Taken")}
        />
        <label htmlFor="Taken">Show taken requirements</label>
      </Option>
    </Item>
      }
      
      <Item>
        <Option>
          <input
          style={{marginRight: '10px'}}
            id="Completed"
            value="Completed"
            type="radio"
            name="intents"
            checked={'Completed' === value}
            onChange={() => onIntentQuery("Completed")}
          />
          <label htmlFor="Completed">Show completed requirements</label>
        </Option>
      </Item>
    </Form>
  );