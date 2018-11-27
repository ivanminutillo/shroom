import React from "react";
import styled from "styled-components";
import { compose, withState, withHandlers } from "recompose";
import Input from '../../atoms/input'
import Intent from '../../components/newCommitment'

export default compose(
  withState('note', 'onNote', ''),
  withHandlers({
    handleNote: props => event => {
      props.onNote(event.target.value)
    }
  })
)(props => (
  <SmartSentence isActive={props.isActive}>
    <Header><Title>Interact with the network</Title></Header>
    {props.isActive ? null : <Overlay onClick={props.handleSmartSentence} />}
    <UserInput>
      <Img />
      {props.isActive ? <SuperInput><Input onChange={props.handleNote} placeholder='Write a message...' /></SuperInput> : 'Write a message...'}
    </UserInput>
    <ContainerEconomicEvents>
    {props.activity === "replyCommitment" ? (
        <Intent note={props.note} scopeId={props.scopeId} avoidNote />
    ) : props.activity === "replyProcess" ? (
      <div>reply process</div>
    ) : null}
    </ContainerEconomicEvents>
    {props.isActive ? (
      <Box>
        <Item active={props.activity === "replyCommitment"} onClick={() => props.handleActivity('replyCommitment')} >Reply to a commitment</Item>
        <Item active={props.activity === "replyProcess"} onClick={() => props.handleActivity('replyProcess')}>Reply to a process</Item>
        <Item>Add a commitment</Item>
        <Item>Add a process</Item>
      </Box>
    ) : null}
  </SmartSentence>
));

const Box = styled.div`
  border-top: 1px solid #e8e8e8;
  display: grid;
  padding: 10px;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 16px;
  position: relative;
  z-index: 9999999
`;

const ContainerEconomicEvents = styled.div`
  position: relative;
  z-index: 99999999
`;
const Header = styled.div`
  background: #EBEEF3;
  height: 30px;
  background-color: #f5f6f7;
  border-bottom: 1px solid #dddfe2;
  border-radius: 2px 2px 0 0;
  font-weight: bold;
  padding: 0 10px;
`;
const Title = styled.div`
  display: inline-block;
  font-size: 13px;
  letter-spacing: .5px;
  font-weight: 500;
  line-height: 30px;
`;

const Item = styled.div`
  height: 32px;
  background: ${props => props.active ? '#3497ff29' : '#f5f6f7' };
  border-radius: 20px;
  font-size: 13px;
  color: #242322;
  margin-top: 8px;
  line-height: 32px;
  padding: 0 8px;
  font-weight: 500;
  cursor: pointer;

`;

const Img = styled.div`
  width: 34px;
  height: 34px;
  background: ${props => props.theme.color.p150};
  border-radius: 100px;
  display: inline-block;
  margin-right: 8px;
  margin-left: 16px;
  margin-top: 0px;
  vertical-align: middle;
  background-size: cover;
  margin-top: 20px;
`;

const SuperInput = styled.div`
margin-top: 20px !important;
margin-left: 10px !important;
`

const UserInput = styled.div`
  line-height: 70px;
  flex: 1;
  display: flex;
  height: 70px;
  padding: 0 10px;
`;

const Overlay = styled.div`
height: 100px;
position: absolute;
z-index: 99999999;
top: 0;
bottom: 0;
left: 0;
right: 0;
`

const SmartSentence = styled.div`
  height: ${props => (props.isActive ? "auto" : "100px")};
  display: flex;
  position: relative;
  z-index: ${props => (props.isActive ? "99999" : 1)};
  flex-direction: column;
  margin-bottom: 8px;
  font-size: 14px;
  color: #0000004d;
  font-weight: 500;
  letter-spacing: 0.5px;
  background: #fff;
  cursor: pointer;
  border: 1px solid #97979740;
  margin: 8px;
  border-radius: 2px;
  margin-top: 0;
  box-shadow: 0 1px 1px 0px rgba(0, 0, 0, .1);
`;
