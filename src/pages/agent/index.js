import React from "react";
import styled, { css } from "styled-components";
import RightPanel from "../../components/rightPanel/rightPanel";
import Component from "./agent";
import { compose, lifecycle } from "recompose";
import getList, { getTxs } from "../../xhr/socialwallet";

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

export default compose(
  lifecycle({
    componentDidMount() {
      getList(
        {
          blockchain: "mongo"
        },
        getTxs
      ).then(res => res.json())
      .then(res => console.log(res))
      .catch(err => console.log(err))
    }
  })
)(Agent);
