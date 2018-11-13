import React from "react";
import styled, { css } from "styled-components";
import { Icons } from "oce-components/build";
import { NavLink } from "react-router-dom";
import media from "styled-media-query";
import { Query } from "react-apollo";
import gql from "graphql-tag";

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
      <List>
        <ListTitle>Requirements</ListTitle>
        <Item>
          <NavLink
            {...props}
            isActive={(match, location) => {
              return (
                location.pathname === `/agent/${props.param}/` ||
                location.pathname === "/" ||
                location.pathname === `/agent/${props.param}`
              );
            }}
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
            to={props.param ? `/agent/${props.param}/committed` : `/committed`}
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
        {props.profile ? (
          <Item>
            <NavLink
              {...props}
              isActive={(match, location) =>
                location.pathname.includes("/matched")
              }
              to={props.param ? `/agent/${props.param}/matched` : `/matched`}
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
        ) : null}
      </List>
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
            to={props.param ? `/agent/${props.param}/processes` : `/processes`}
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
            {/* <Query query={getInbox}>
              {({ data: { inbox } }) => {
                return <Total>{inbox}</Total>;
              }}
            </Query> */}
          </NavLink>
        </Item>
        <Item>
          <NavLink
            {...props}
            to={props.param ? `/agent/${props.param}/processes/closed` : `/processes/closed`}
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
            {/* <Query query={getCommitted}>
              {({ data: { committed } }) => {
                return <Total>{committed}</Total>;
              }}
            </Query> */}
          </NavLink>
        </Item>
         
        </List>
    </Wrapper>
  );
};

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
  background: ${props => props.theme.color.p900};
  transition: margin-left 0.5s ease;
  height: 100%;
  min-height: 100vh;
  margin-bottom: -40px;
  border-right: 1px solid #121315;
  box-shadow: 1px 0 0 rgba(255, 255, 255, 0.1);
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
const ItemFull = styled.h3`
  margin-top: 8px;
  letter-spacing: 0.5px;
  font-weight: 400;
  background: #383c41;
  border-radius: 3px;
  padding: 2px;
  & a {
    text-decoration: none;
    color: #f0f0f09c;
    font-size: 13px;
    font-weight: 300;
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
