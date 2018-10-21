import React from "react";
import styled from "styled-components";
import { clearFix } from "polished";

const Header = styled.div`
  height: 36px;
  background: #333d47;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  border-bottom: 1px solid #242a30;
  ${clearFix()};
`;
const SectionTitle = styled.h3`
float: left;
line-height: 36px;
font-weight: 500;
margin-left: 8px;
color: #f0f0f0e6;
letter-spacing: .5px;
`;
const Right = styled.div`
  float: right;
`;

export default ({ title, actions }) => (
  <Header>
    <SectionTitle>{title}</SectionTitle>
    <Right>{actions}</Right>
  </Header>
);
