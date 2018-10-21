import React from "react";
import { Icons } from "oce-components/build";
import styled from "styled-components";
import { clearFix } from "polished";
import { MentionsInput, Mention } from "react-mentions";
import defaultStyle from "./defaultStyle";

const Wrapper = styled.div`
  ${clearFix()};
  margin-left: 40px;
  margin-right: 60px;
  min-height: 50px;
`;

const SpanRight = styled.div`
  width: 30px;
  text-align: center;
  position: absolute;
  right: 16px;
  top: 15px;
  cursor: pointer;
`;

const SpanLeft = styled.div`
  width: 30px;
  text-align: center;
  position: absolute;
  left: 8px;
  top: 15px;
  cursor: pointer;
`;

const Module = styled.div`
  border-radius: 0px;
  min-height: 80px;
`;

const SentenceContainer = styled.div`
  background: #f0f0f0;
  border-radius: 4px;
  border: 1px solid #dadada;
  position: relative;
  min-height: 50px;
  margin: 16px;
  margin-bottom: 0;
`;

const SmartSentence = ({
  value,
  onTaxonomies,
  onEvents,
  toggleModal,
  onAddTaxonomy,
  onAddProcess,
  onAddEvent,
  handleChange,
  economicEvent,
  onProcesses,
  toggleHelpModal
}) => {
  return (
    <Module>
      <SentenceContainer>
        <Wrapper>
          <SpanLeft onClick={toggleHelpModal}>
            <Icons.Grid width="20" color="#989BA0" />
          </SpanLeft>
          <MentionsInput
            value={value}
            style={defaultStyle}
            placeholder="Message"
            onChange={handleChange}
            markup="@[__type__ __id__ : __display__]@"
          >
            <Mention
              type="taxonomy"
              trigger="#"
              data={onTaxonomies}
              onAdd={onAddTaxonomy}
              style={{ backgroundColor: "rgb(224, 233, 196)" }}
            />
            <Mention
              type="process"
              trigger=">"
              data={onProcesses}
              onAdd={onAddProcess}
              style={{ backgroundColor: "rgb(224, 200, 196)" }}
            />
            <Mention
              type="event"
              trigger="!"
              data={onEvents}
              onAdd={onAddEvent}
              style={{ backgroundColor: "#b5f6b4" }}
            />
          </MentionsInput>
        </Wrapper>
          <SpanRight onClick={toggleModal}>
            <Icons.Send width="20" color="#989BA0" />
          </SpanRight>
      </SentenceContainer>
    </Module>
  );
};

export default SmartSentence;
