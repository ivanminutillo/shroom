import React, { Component } from "react";
import styled, { css, createGlobalStyle, ThemeProvider } from "styled-components";
import Sidebar from "./components/sidebar/sidebar";
import Main from "./components/main/main";
import { withState, withHandlers, compose } from "recompose";
import LeftPanel from './components/leftPanel/leftPanel'



const Overlay = styled.div`
  position: absolute;
  z-index: 9;
  top: 0;
  bottom: 0;
  left: 270px;
  right: 0;
  background: rgba(0, 0, 0, 0.2);
  cursor: pointer;
`;

const App = props => (
  
    <Surface>
      <Wrapper>
        <Sidebar togglePanel={props.onTogglePanel} />
        <Main />
        <LeftPanel togglePanel={props.onTogglePanel} active={props.isOpen} />
        {props.isOpen ? <Overlay onClick={props.onTogglePanel} /> : null}
      </Wrapper>
    </Surface>

);

export default compose(
  withState("isOpen", "togglePanel", false),
  withHandlers({
    onTogglePanel: props => () => props.togglePanel(!props.isOpen)
  })
)(App);
