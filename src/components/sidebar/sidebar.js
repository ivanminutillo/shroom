import React from "react";
import styled, { css } from "styled-components";
import { Icons } from "oce-components/build";
import { NavLink } from "react-router-dom";
import media from "styled-media-query";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import Profile from "./profile";


const getInbox = gql`
  query getInbox {
    inbox @client
  }
`;
const getCommitted = gql`
  query getCommitted {
    committed @client
  }
`;
const getMatched = gql`
  query getMatched {
    matched @client
  }
`;

const Sidebar = props => {
  return (
    <Wrapper isopen={props.isOpen}>
      <Profile
        togglePanel={props.togglePanel}
        location={props.location}
        providerName={props.providerName}
        handleGroup={props.handleGroup}
      />
      <Menu>
      <List>
        <ListTitle>
          <NavLink
            {...props}
            isActive={(match, location) => {
              return (
                location.pathname === `/agent/${props.param}/` ||
                location.pathname === "/" ||
                location.pathname === `/agent/${props.param}`
              );
            }}
            to={
              props.param && props.location.pathname.includes("/agent/")
                ? `/agent/${props.param}/`
                : `/`
            }
            activeStyle={{
              position: "relative",
              marginLeft: "24px",
              color: "#f0f0f0"
            }}
          >
            <SpanIcon>
              <Icons.User width="14" height="14" color="#f0f0f0bd" />
            </SpanIcon>
            Overview
          </NavLink>
        </ListTitle>
      </List>

      {props.profile ? (
        <List>
          <ListTitle>Requirements</ListTitle>
          <Item>
            <NavLink
              {...props}
              isActive={(match, location) =>
                location.pathname.includes("/committed")
              }
              to={
                props.param && props.location.pathname.includes("/agent/")
                  ? `/agent/${props.param}/requirements/committed`
                  : `/requirements/committed`
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
              <Query query={getCommitted}>
                {({ data: { committed } }) => {
                  return <Total>{committed}</Total>;
                }}
              </Query>
            </NavLink>
          </Item>
          <Item>
            <NavLink
              {...props}
              isActive={(match, location) =>
                location.pathname.includes("/matched")
              }
              to={
                props.param && props.location.pathname.includes("/agent/")
                  ? `/agent/${props.param}/requirements/matched`
                  : `/requirements/matched`
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
              <Query query={getMatched}>
                {({ data: { matched } }) => {
                  return <Total>{matched}</Total>;
                }}
              </Query>
            </NavLink>
          </Item>
        </List>
      ) : (
        <List>
          <ListTitle>Requirements</ListTitle>
          <Item>
            <NavLink
              {...props}
              isActive={(match, location) => {
                return (
                  location.pathname === `/agent/${props.param}/requirements` ||
                  location.pathname === "/" ||
                  location.pathname === `/agent/${props.param}/requirements`
                );
              }}
              to={
                props.param && props.location.pathname.includes("/agent/")
                  ? `/agent/${props.param}/requirements`
                  : `/requirements`
              }
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
              <Query query={getInbox}>
                {({ data: { inbox } }) => {
                  return <Total>{inbox}</Total>;
                }}
              </Query>
            </NavLink>
          </Item>
          <Item>
            <NavLink
              {...props}
              to={
                props.param && props.location.pathname.includes("/agent/")
                  ? `/agent/${props.param}/requirements/committed`
                  : `/requirements/committed`
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
              <Query query={getCommitted}>
                {({ data: { committed } }) => {
                  return <Total>{committed}</Total>;
                }}
              </Query>
            </NavLink>
          </Item>
        </List>
      )}

      <List>
        <ListTitle>Processes</ListTitle>
        <Item>
          <NavLink
            {...props}
            isActive={(match, location) => {
              return (
                location.pathname === `/agent/${props.param}/processes/` ||
                location.pathname === "/processes" ||
                location.pathname === `/agent/${props.param}/processes`
              );
            }}
            to={
              props.param && props.location.pathname.includes("/agent/")
                ? `/agent/${props.param}/processes`
                : `/processes`
            }
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
              props.param && props.location.pathname.includes("/agent/")
                ? `/agent/${props.param}/processes/closed`
                : `/processes/closed`
            }
            isActive={(match, location) =>
              location.pathname.includes("/closed")
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
            Closed
          </NavLink>
        </Item>
      </List>
      </Menu>
    </Wrapper>
  );
};

const Menu = styled.div`
background: #36393F;
border-radius: 2px;
margin-top: 8px;
`

const Total = styled.span`
  float: right;
  margin-top: 0px;
  font-size: 13px;
  color: #3497ff;
  font-weight: 300;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  white-space: nowrap;
  position: relative;
  width: 270px;
  box-sizing: border-box;
  overflow-y: hidden;
  overflow: hidden;
  transition: margin-left 0.5s ease;
  ${media.lessThan("medium")`
  margin-left: -270px
  ${props =>
    props.isopen &&
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
  margin: 16px;
  & a {
    display: block;
  }
`;

const ListTitle = styled.h3`
  text-transform: uppercase;
  font-size: 12px;
  letter-spacing: 0.4px;
  color: #bebebe;
  & a {
    font-size: 12px;
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
