import React from "react";
import LogStatus from "./smartSentence";
import { withState, withHandlers, compose } from "recompose";
import styled from "styled-components";
import Helper from "../helper";
import LogEvent from "../logEvent";
import TransferCurrency from "../transferAssets";

const Wrapper = styled.div`
  position: relative;
`;

const Smart = ({
  isOpen,
  menuSelected,
  handleMenuSelection,
  scopeId,
  providerId
}) => {
  return (
    <Wrapper>
      {menuSelected === "1" ? (
        <LogStatus handleMenuSelection={handleMenuSelection} menuSelected={menuSelected} />
      ) : menuSelected === "2" ? (
        <LogEvent
          scopeId={scopeId}
          providerId={providerId}
          handleMenuSelection={handleMenuSelection}
          menuSelected={menuSelected}
        />
      ) : menuSelected === "3" ? (
        <TransferCurrency
          handleMenuSelection={handleMenuSelection}
          id={"1"}
          agents={[]}
          menuSelected={menuSelected}
        />
      ) : (
        <LogStatus menuSelected={menuSelected} handleMenuSelection={handleMenuSelection} />
      )}
    </Wrapper>
  );
};

export default compose(
  withState("menuSelected", "onMenuSelection", "1"),
  withHandlers({
    handleMenuSelection: props => val => {
      props.onMenuSelection(val);
      return null;
    }
  })
)(Smart);
