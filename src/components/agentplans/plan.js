import React from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";

const Wrapper = styled.div`
height: 60px;
padding: 8px;
background: #f0f0f0;
border-radius: 4px;
margin-bottom: 8px;
box-shadow: 0 2px 2px rgba(0,0,0,.1);
border-bottom: 1px solid #222326;
`;

const Title = styled.h3`
font-weight: 500;
line-height: 20px;
letter-spacing: 1px;
text-decoration: none;
color: ${props => props.theme.color.p800}
`

export default ({ plan }) => (
  <NavLink to={"/plan/" + plan.id}>
    <Wrapper>
      <Title>{plan.name}</Title>
    </Wrapper>
  </NavLink>
);
