import React from "react";
import styled, { css } from "styled-components";
import { Input, Icons } from "oce-components/build";
import { Img, AvatarTitle, AvatarWrapper } from "../../atoms/avatar";
import { NavLink } from "react-router-dom";
import media from "styled-media-query";
import { placeholder } from "polished";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  white-space: nowrap;
  position: relative;
  width: 270px;
  box-sizing: border-box;
  overflow-y: hidden;
  overflow: hidden;
  background: ${props => props.theme.color.p900};
  transition: margin-left 0.5s ease;
  ${media.lessThan("medium")`
  margin-left: -270px
  ${props =>
    props.isOpen &&
    css`
    margin-left: 0px
      width: 100%;
    `};
  `};
`;

const Header = styled.div`
  height: 50px;
  display: flex;
  align-items: center;
  background: ${props => props.theme.color.p700};
  border-bottom: 1px solid #1E2024;

  margin: 8px;
  border-radius: 4px;
  box-shadow: 0 2px 20px rgba(0,0,0,.2);
  background-color: #21D4FD;
  background-image: linear-gradient(45deg, #31c5e7 0%, #a146cf 100%);
`;

const Span = styled.div`
  vertical-align: middle;
  cursor: pointer;
  flex: 1;
  text-align: center;
  margin-left: 16px;
`;

const SpanInput = styled.div`
  flex: 10;
  margin-right: 8px;
  & input {
    background: ${props => props.theme.color.p600};;
    color: #f0f0f0;
    ${placeholder({ color: "#f0f0f0" })};
  }
`;

const List = styled.div`
  & a {
    display: block;
    &:hover {
      background: ${props => props.theme.color.b200};
    }
  }
`;

const Sidebar = ({ togglePanel, agents, data, isOpen, toggleSidebar }) => {
  return (
    <Wrapper isOpen={isOpen}>
      <Header>
        <Span onClick={togglePanel}>
          <Icons.Menu width="18" color="#f0f0f0" />
        </Span>
        <SpanInput>
          <NavLink
            onClick={toggleSidebar}
            to={"/"}
            exact
            activeStyle={{ background: "#2F4F70" }}
          >
            <AvatarWrapper>
              <Img small src={`${data.image}`} />
              <AvatarTitle>{data.name}</AvatarTitle>
            </AvatarWrapper>
          </NavLink>
        </SpanInput>
      </Header>
      <List>
       
        {agents.map((a, i) => (
          <NavLink
            activeStyle={{ background: "#2F4F70" }}
            to={`/agent/${a.object.id}`}
            key={i}
            onClick={toggleSidebar}
          >
            <AvatarWrapper>
              <Img src={`${a.object.image}`} />
              <AvatarTitle>{a.object.name}</AvatarTitle>
            </AvatarWrapper>
          </NavLink>
        ))}
      </List>
    </Wrapper>
  );
};

export default Sidebar;
