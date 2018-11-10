import React from "react";
import styled from "styled-components";
import media from "styled-media-query";
import {Icons} from 'oce-components'

export default props => (
    <Wrapper>
        <Box>
            <ScopeImg />
            <Scope>by Demo group</Scope>
            <Plan>in New feature building</Plan>
        </Box>
        <WrapperInfo>
            <Title>Release the unit testing v.1.0.0 of shroom</Title>
            <Note>Research in advertising is done in order to produce better advertisements that are more efficient in motivating customers to buy a product or a service.</Note>
            <WrapperAction>
                <Date><span><Icons.Clock width='16' height='16' color='#F0F0F0' /></span> From 22 Jun to 12 Jul</Date>
            </WrapperAction>
        </WrapperInfo>
    </Wrapper>
)


const Wrapper = styled.div`
display: grid;
grid-template-columns: 1fr 4fr 1fr;
grid-column-gap: 16px;
`
const Box = styled.div`
  border-radius: 2px;
  border: 1px solid rgba(255,255,255, .5);
  padding: 10px;
  height: 110px;
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
`
const Plan = styled.h3`
  color: #F0F0F070;
  font-style: italic;
  margin-top: 8px;
  margin-bottom: 0;
  font-weight: 400;
`
const WrapperInfo = styled.div``
const Title = styled.h1`
  font-size: 32px;
  color: #E9EBED;
  letter-spacing: 1px;
  margin-bottom: 16px;
`
const Note = styled.h2`
font-size: 15px;
line-height: 24px;
letter-spacing: .5px;
font-weight: 300;
color: #f0f0f090;
`
const WrapperAction = styled.div`
margin-top: 16px;
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
