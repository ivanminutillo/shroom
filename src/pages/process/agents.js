import React from "react";
import styled, {css} from "styled-components";
import {Icons} from 'oce-components/build'

export default props => (
    <Wrapper>
        <Title>
            <span><Icons.Users width='16' height='16' color='#BEBEBE' /></span>
            {props.agents.length} Agents involved
        </Title>
        <Content>
            {props.agents.map((a,i) => (
             <React.Fragment key={i}>
                <Img key={i} style={{backgroundImage: `url(${a.image})`}} />
             </React.Fragment>    
            ))}
        </Content>
    </Wrapper>
)

const Wrapper = styled.div`
  
`
const Content = styled.div`
  margin-top: 16px;
`
const Title = styled.div`
margin-top: 16px;
color: ${props => props.theme.color.p100};
font-size: 14px;
letter-spacing: .5px;
& span {
    margin-right: 8px;
    vertical-align: sub;
    display: inline-block;
  }
`
const Img = styled.div`
  display: inline-block;
  height: 24px;
  width: 24px;
  border-radius: 40px;
  background-size: cover;
  background-color: ${props => props.theme.color.p600};
  margin-right: 4px;
  margin-bottom: 4px;
`
