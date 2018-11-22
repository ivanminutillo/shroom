import React from "react";
import styled from "styled-components";
import Textarea from '../../atoms/textarea'
import Icons from '../../atoms/icons'
import { clearFix, placeholder } from "polished";
import { Field } from "formik";

export default props => (
  <Note>
    <NoteIcon>
      <Icons.Text width="16" height="16" color="#b7bfc6" />
    </NoteIcon>
    <Field
      name="note"
      render={({ field }) => (
        <Textarea
          name={field.name}
          value={field.value}
          onChange={field.onChange}
          placeholder="Type the note of the process"
        />
      )}
    />
  </Note>
);


const NoteIcon = styled.div`
  position: absolute;
  top: 17px;
  left: 0px;
`;

const Note = styled.div`
position: relative;
border-top: 1px solid #e0e6e8;;
margin-bottom: 0px;
margin-top: 4px;
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
