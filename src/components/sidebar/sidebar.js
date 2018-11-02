import React from "react";
import styled, { css } from "styled-components";
import { Icons } from "oce-components/build";
// import { Img, AvatarTitle, AvatarWrapper } from "../../atoms/avatar";
import { NavLink } from "react-router-dom";
import media from "styled-media-query";
// import { placeholder } from "polished";

const Sidebar = (props) => {
  return (
    <Wrapper isOpen={props.isOpen}>
      <List>
      <ListTitle>Events</ListTitle>
      <Item>
        <NavLink
          {...props}
          isActive={(match, location) => {
            return location.pathname === `/agent/${props.param}/` || location.pathname === '/' || location.pathname === `/agent/${props.param}`
          }
          }
          to={props.param ? `/agent/${props.param}/` : `/`}
          activeStyle={{
            position: "relative",
            marginLeft: "24px",
            color: "#f0f0f0"
          }}
        >
          <SpanIcon>
            <Icons.Inbox width="14" height="14" color="#f0f0f0bd" />
          </SpanIcon>
          Inbox
        </NavLink>
      </Item>
      <Item>
        <NavLink
          {...props}
          to={
            props.param
              ? `/agent/${props.param}/committed`
              : `/committed`
          }
          isActive={(match, location) =>
            location.pathname.includes("/committed")
          }
          activeStyle={{
            position: "relative",
            marginLeft: "24px",
            color: "#f0f0f0"
          }}
        >
          <SpanIcon>
            <Icons.Star width="14" height="14" color="#f0f0f0bd" />
          </SpanIcon>
          Committed
        </NavLink>
      </Item>
      <Item>
        <NavLink
          {...props}
          isActive={(match, location) => location.pathname.includes("/matched")}
          to={
            props.param
              ? `/agent/${props.param}/matched`
              : `/matched`
          }
          activeStyle={{
            position: "relative",
            marginLeft: "24px",
            color: "#f0f0f0"
          }}
        >
          <SpanIcon>
            <Icons.Eye width="14" height="14" color="#f0f0f0bd" />
          </SpanIcon>
          Matched
        </NavLink>
      </Item>
    </List>
    </Wrapper>
  );
};

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
  height: 100%;
  min-height: 100vh;
  margin-bottom: -40px;
  border-right: 1px solid #121315;
  box-shadow: 1px 0 0 rgba(255,255,255, .1);
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

const SpanIcon = styled.div`
  vertical-align: middle;
  cursor: pointer;
  margin-right: 8px;
  display: inline-block;
`;

const List = styled.div`
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 16px;
  padding: 16px;
  margin-top: 8px;
  & a {
    display: block;
  }
`;


const ListTitle = styled.h3`
  text-transform: uppercase;
  font-size: 12px;
  letter-spacing: 0.4px;
  color: #bebebe;
`;
const Item = styled.h3`
  margin-top: 16px;
  letter-spacing: 0.5px;
  font-weight: 400;
  & a {
    text-decoration: none;
    color: #f0f0f0bd;
    &:after {
      position: absolute;
      content: "";
      width: 20px;
      height: 2px;
      background: ${props => props.theme.color.b100};
      display: block;
      top: 5px;
      left: -24px;
    }
  }
`;

export default Sidebar;
