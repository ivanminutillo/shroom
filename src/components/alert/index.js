import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  border-radius: 4px;
  height: 26px;
  line-height: 26px;
  color: white;
  background: red;
  padding: 0 10px;
  font-size: 14px;
  margin-top: 2px;
`;
const Alert = ({ children }) => <Wrapper>{children}</Wrapper>;

export default Alert;
