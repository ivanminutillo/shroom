import React from "react";
import styled, { css } from "styled-components";
import RightPanel from "../../components/rightPanel/rightPanel";
import Component from "./agent";

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
  position: relative;
  width: 100%;
  height: 100%;
`;

const Agent = props => {
  const { match, data, id, providerId, scopeId } = props;
  return (
    <Wrapper>
      <Component
        match={match}
        id={id}
        togglePanel={props.onTogglePanel}
        toggleLeftPanel={props.toggleLeftPanel}
        isOpen={data.isOpen}
        scopeId={scopeId}
        providerId={providerId}
        providerName={data.data.name}
        providerImage={data.data.image}
      />
      <RightPanel
        id={id}
        match={match}
        onTogglePanel={data.onTogglePanel}
        isOpen={data.isOpen}
      />
    </Wrapper>
  );
};

export default Agent
