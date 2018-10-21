import React from "react";
import styled, { css } from "styled-components";
import { clearFix } from "polished";
import {Icons} from 'oce-components'
import moment from 'moment'

export default ({ data, toggleModal }) => {
  let duration = moment
    .duration(moment(data.due).diff(moment()))
    .asHours();
  return (
  <Wrapper onClick={()=>toggleModal(data.id)}>
    <First>
      <Sentence>{`${data.action} ${data.committedQuantity.numericValue} ${
        data.committedQuantity.unit.name
      } ${data.resourceClassifiedAs.name}`}</Sentence>
      <Note>{data.note}</Note>
    </First>
    <Second>
      <Date deadline={duration < 0 ? 'expired' : duration < 48 ? 'soon' : '' }>{moment(data.due).format("DD MMM")}</Date>
      {data.provider ? (
      <Agents>
        <Img style={{backgroundImage: `url(${data.provider.image})`}} />
      </Agents>
      ): null}
    </Second>
    <Infos>
    {data.inputOf ? (
      <ProcessContainer>
          <ContainerTitle><Icons.UpLeft width='13' height='13' color='#f0f0f0'/></ContainerTitle>
          <Content>#{data.inputOf.name}</Content>
      </ProcessContainer>
    ) : null}
    {data.outputOf ? (
      <ProcessContainer>
        <ContainerTitle><Icons.UpRight width='13' height='13' color='#f0f0f0'/></ContainerTitle>
          <Content>#{data.outputOf.name}</Content>
      </ProcessContainer>
    ) : null}
    </Infos>
  </Wrapper>
)}


const Agents = styled.div`
${clearFix()};
margin-top: 4px;
`
const Img = styled.div`
width: 24px;
height: 24px;
background: ${props => props.theme.color.p150};
border-radius: 2px;
margin-left: 2px;
float: left;
background-size: cover;
`

const Wrapper = styled.div`
  padding: 8px;
  padding-top: 4px;
  margin-bottom: 4px;
  border-bottom: 1px solid #22232680;
  position: relative;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background: #f9f1e320;
  }
`;

const First = styled.div`
  ${clearFix()};
  margin-bottom: 8px;
`;

const Second = styled.div`
  ${clearFix()};
  position: absolute;
  right: 8px;
  top: 8px;
`;
const ProcessContainer = styled.div`
  ${clearFix()};
  background: #2d3239;
display: inline-block;
border-radius: 100px;
padding: 0 6px;
margin-left: -3px;

`;
const ContainerTitle = styled.h3`
  ${clearFix()};
  display: inline-block;
vertical-align: middle;
`;
const Content = styled.div`
  ${clearFix()};
  display: inline-block;
color: #f0f0f0;
font-size: 12px;
margin-left: 4px;
`;

const Sentence = styled.h3`
  font-weight: 400;
  line-height: 20px;
  text-decoration: underline;
`;
const Infos = styled.div`
  font-weight: 400;
  line-height: 20px;
`;
const Date = styled.h3`
  color: #99adc6;
  font-weight: 500;
  font-size: 12px;
  letter-spacing: 1px;
  margin: 0;
  height: 20px;
  line-height: 20px;
  border-radius: 3px;
  ${props =>
    props.deadline === "soon" &&
    css`
      color: #ffffff;
      background: #ffab00;
      padding: 0 5px;
    `} ${props =>
    props.deadline === "expired" &&
    css`
      color: #ffffff;
      background: #ff5630;
      padding: 0 5px;
    `};
`;
const Note = styled.h3`
  margin-top: 8px;
  font-weight: 400;
  line-height: 18px;
  font-size: 13px;
  letter-spacing: .4px;
  color: ${props => props.theme.color.p150};
`;
