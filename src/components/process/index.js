import React from "react";
import styled, { css } from "styled-components";
import { clearFix } from "polished";
import { compose, withState, withHandlers } from "recompose";
import EditDueDate from "../editDueDate";
import Timeline from "./timeline";
import Crystal from '../../atoms/crystal_ball.png'

export default compose(
  withState("popup", "isOpen", false),
  withState("addEvent", "onAddEvent", false),
  withState("isNoteOpen", "onNoteOpen", false),
  withState("isTimelineOpen", "onTimelineOpen", false),
  withState("isSentenceOpen", "onSentenceOpen", false),
  withHandlers({
    handlePopup: props => () => props.isOpen(!props.popup),
    handleAddEvent: props => () => props.onAddEvent(!props.addEvent),
    handleNoteOpen: props => () => {
      props.isOpen(false);
      props.onNoteOpen(!props.isNoteOpen);
    },
    toggleTimeline: props => () => {
      props.onTimelineOpen(!props.isTimelineOpen);
    },
    handleSentenceOpen: props => () => {
      props.isOpen(false);
      props.onSentenceOpen(!props.isSentenceOpen);
    }
  })
)(({ data, toggleTimeline, isTimelineOpen, handleProcess }) => {
  let inputs = data.committedInputs.concat(data.committedOutputs);
  return (
    <Intent >
      <Infos>
        {data.processPlan ? (
          <ProcessContainer>
            <Content>{data.processPlan.name}</Content>
          </ProcessContainer>
        ) : null}
      </Infos>
      <Wrapper>
        <First  onClick={() => handleProcess(data.id)}>
            <Sentence>{data.name}</Sentence>
          <Note>{data.note}</Note>
        </First>
        <Second>
          <FirstInfo>
            <EditDueDate due={data.plannedFinish} intentId={data.id} />
          </FirstInfo>
        </Second>
        {isTimelineOpen ? (
          <Timeline
            end={data.plannedFinish}
            start={data.plannedStart}
            inputs={inputs}
          />
        ) : null}
      </Wrapper>
      <Actions>
        {inputs.length > 0 ? (
          <TimelineBtn onClick={toggleTimeline}>
            <SpanIcon style={{backgroundImage: `url(${Crystal})`}}/>
            Toggle timeline
          </TimelineBtn>
        ) : null}
      </Actions>
    </Intent>
  );
});


const SpanIcon = styled.span`
  ${clearFix()};
  cursor: pointer;
  margin-right: 8px;
  display: inline-block;
  width: 18px;
  height: 18px;
  background-size: contain;
  vertical-align: sub;
`;


const Actions = styled.div`
  padding-bottom: 0px;
  position:relative;
  z-index: 999999;
  background: #e0f5fcde;
  height: 28px;
  ${clearFix()};
`;

const TimelineBtn = styled.span`
  cursor: pointer;
  margin: 0;
  float: left;
  height: 24px;
  line-height: 24px;
  border-radius: 3px;
  margin-left: 4px;
  padding: 0 5px;
  font-size: 12px;
  font-weight: 500;
  color: #60757d;
  margin-top: 3px;
  letter-spacing: .5px;
`;

const Intent = styled.div`
  ${clearFix()};
  margin-top: 0;
  border-radius: 4px;
  margin: 8px;
  border-radius: 4px;
  ${props =>
    props.isFinished &&
    css`
      background: #7cff8a14;
      border: 1px solid #007a1c;
    `};
`;

const Wrapper = styled.div`
  padding: 8px;
  position: relative;
  background: #fffffff7;
`;

const First = styled.div`
  ${clearFix()};
  cursor: pointer;
`;

const Second = styled.div`
  ${clearFix()};
  position: absolute;
  right: 8px;
  top: 8px;
`;

const FirstInfo = styled.div`
  ${clearFix()};
`;

const ProcessContainer = styled.div`
  ${clearFix()};
  background: #fffffff7;
  height: 40px;
  padding: 0 8px;
`;

const Content = styled.div`
  ${clearFix()};
  display: inline-block;
  color: ${props => props.theme.color.b100};
  font-size: 13px;
  margin-left: 4px;
  border-bottom: 3px solid;
  line-height: 26px;
  margin-top: 4px;
`;

const Sentence = styled.h3`
  font-weight: 500;
  line-height: 24px;
  letter-spacing: 1px;
  font-size: 14px;
  text-transform: capitalize;
  color: #32211B;
  display: inline-block;
  text-decoration: none;
  ${props =>
    props.isFinished &&
    css`
      text-decoration: line-through;
    `};

  & input {
    vertical-align: text-bottom;
    margin-right: 8px;
    margin-top: 0px;
  }
`;
const Infos = styled.div`
  font-weight: 400;
  line-height: 20px;
`;

const Note = styled.h3`
  margin-top: 5px;
  font-weight: 400;
  line-height: 18px;
  font-size: 13px;
  letter-spacing: 0.4px;
  color: #32211b80;
  padding-left: 8px;
  border-left: 1px solid;
`;
