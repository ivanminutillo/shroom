import React, {SFC} from 'react'
import styled from 'styled-components'
import {placeholder} from 'polished'

const TextArea = styled.textarea`
  width: 100%;
  direction: ltr;
  border-radius: 4px;
  display: block;
  box-sizing: border-box;
  margin: 0;
  color: #282c37;
  background: #fff;
  padding: 5px;
  font-family: inherit;
  background: '#fff'; 
  font-size: 14px;
  resize: none;
  border: 0;
  outline: 0;
  height: 100%;
  ${placeholder({
    color: '#757575'
  })}
`


interface Props {
  onChange: any;
  name: string;
  placeholder: string;
  value: string;
}


const Textarea: SFC<Props> = ({placeholder, name, onChange, value}) => (
  <TextArea onChange={onChange} name={name} placeholder={placeholder} value={value} />
)

export default Textarea
