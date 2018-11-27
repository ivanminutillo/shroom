import React from "react";
import styled from "styled-components";
import  Icons  from "../../atoms/icons";
import {NavLink} from 'react-router-dom'
import Agents from "./agents";
export default props => (
    <Wrapper>
        <Box>
            <ScopeImg style={{backgroundImage: `url(${props.scope.image})`}} />
            <NavLink to={`/agent/${props.scope.id}`}><Scope>by {props.scope.name}</Scope></NavLink>
            {props.plan ? 
            <Plan>in {props.plan.name}</Plan>
            : null}
        </Box>
        <WrapperInfo>
            <Title>{props.title}</Title>
            <Note>{props.note}</Note>
            <WrapperAction>
                <Date><span><Icons.Clock width='16' height='16' color='#F0F0F0' /></span> From {props.from} to {props.to}</Date>
            </WrapperAction>
            <Agents agents={props.agents} />
        </WrapperInfo>
    </Wrapper>
)


const Wrapper = styled.div`
display: grid;
grid-template-columns: 1fr 4fr;
grid-column-gap: 16px;
`
const Box = styled.div`
  border-right: 1px solid rgba(255,255,255, .2);
`
const ScopeImg = styled.div`
  width: 38px;
  height: 38px;
  background: ${props => props.theme.color.p200};
  border-radius: 4px;
  background-size: cover;
  margin-bottom: 8px;
`
const Scope = styled.h3`
font-weight: 500;
margin-top: 4px;
letter-spacing: 1px;
line-height: 18px;
color: ${props=>props.theme.color.p800}

`
const Plan = styled.h3`
  font-style: italic;
  margin-top: 8px;
  margin-bottom: 0;
  font-weight: 400;
  color: ${props=>props.theme.color.p800}
`
const WrapperInfo = styled.div``
const Title = styled.h1`
  font-size: 22px;
  color: ${props=>props.theme.color.p900}
  letter-spacing: 1px;
  margin-bottom: 0px;
  line-height: 40px;
`
const Note = styled.h2`
font-size: 15px;
line-height: 24px;
letter-spacing: .5px;
font-weight: 300;
color: ${props=>props.theme.color.p900}
`
const WrapperAction = styled.div`
margin-top: 8px;
`
const Date = styled.div`
  background: #40454C;
  border-radius: 3px;
  height: 26px;
  padding: 0 8px;
  line-height: 26px;
  color: #f0f0f0;
  display: inline-block;
  font-size: 13px;
  & span {
    margin-right: 4px;
    vertical-align: sub;
    display: inline-block;
  }
`
