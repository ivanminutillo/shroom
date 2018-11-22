import React from "react";
import styled, { css } from "styled-components";
import Icons  from '../../atoms/icons'
import { NavLink } from "react-router-dom";
import media from "styled-media-query";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import Profile from "./profile";
import { LoadingMini, ErrorMini } from "../loading";

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

const SidebarData = gql`
  query($token: String, $id: Int) {
    viewer(token: $token) {
      agent(id: $id) {
        id
        image
        name
      }
    }
  }
`;

const Sidebar = props => {
  return (
    <Wrapper isopen={props.isOpen}>
      <Query
        query={SidebarData}
        variables={{
          token: localStorage.getItem("oce_token"),
          id: props.param ? props.param : props.providerId
        }}
      >
        {({ loading, error, data, refetch, client }) => {
          if (loading) return <LoadingMini />;
          if (error)
            return (
              <ErrorMini
                refetch={refetch}
                message={`Error! ${error.message}`}
              />
            );
          return (
            <React.Fragment>
              <Profile
                providerName={data.viewer.agent.name}
                providerImage={data.viewer.agent.image}
                providerId={data.viewer.agent.id}
                location={props.location}
              />
              <Menu>
                {props.profile ? (
                  <List>
                    <ListTitle>Requirements</ListTitle>
                    <Item>
                      <NavLink
                        isActive={(match, location) =>
                          location.pathname.includes("/committed")
                        }
                        to={
                          props.param &&
                          props.location.pathname.includes("/agent/")
                            ? `/agent/${props.param}/requirements/committed`
                            : `/requirements/committed`
                        }
                        activeStyle={{
                          position: "relative",
                          marginLeft: "24px",
                          color: "#3B99FC"
                        }}
                      >
                        <SpanIcon>
                          <Icons.Star
                            width="14"
                            height="14"
                            color="#f0f0f0"
                          />
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
                        isActive={(match, location) =>
                          location.pathname.includes("/matched")
                        }
                        to={
                          props.param &&
                          props.location.pathname.includes("/agent/")
                            ? `/agent/${props.param}/requirements/matched`
                            : `/requirements/matched`
                        }
                        activeStyle={{
                          position: "relative",
                          marginLeft: "24px",
                          color: "#3B99FC"
                        }}
                      >
                        <SpanIcon>
                          <Icons.Eye width="14" height="14" color="#f0f0f0" />
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
                        isActive={(match, location) => {
                          return (
                            location.pathname ===
                              `/agent/${props.param}/requirements` ||
                            location.pathname === "/" ||
                            location.pathname ===
                              `/agent/${props.param}/requirements`
                          );
                        }}
                        to={
                          props.param &&
                          props.location.pathname.includes("/agent/")
                            ? `/agent/${props.param}/requirements`
                            : `/requirements`
                        }
                        activeStyle={{
                          position: "relative",
                          marginLeft: "24px",
                          color: "#3B99FC"
                        }}
                      >
                        <SpanIcon>
                          <Icons.Inbox
                            width="14"
                            height="14"
                            color="#f0f0f0"
                          />
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
                        to={
                          props.param &&
                          props.location.pathname.includes("/agent/")
                            ? `/agent/${props.param}/requirements/committed`
                            : `/requirements/committed`
                        }
                        isActive={(match, location) =>
                          location.pathname.includes("/committed")
                        }
                        activeStyle={{
                          position: "relative",
                          marginLeft: "24px",
                          color: "#3B99FC"
                        }}
                      >
                        <SpanIcon>
                          <Icons.Star
                            width="14"
                            height="14"
                            color="#f0f0f0"
                          />
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
                      isActive={(match, location) => {
                        return (
                          location.pathname ===
                            `/agent/${props.param}/processes/` ||
                          location.pathname === "/processes" ||
                          location.pathname ===
                            `/agent/${props.param}/processes`
                        );
                      }}
                      to={
                        props.param &&
                        props.location.pathname.includes("/agent/")
                          ? `/agent/${props.param}/processes`
                          : `/processes`
                      }
                      activeStyle={{
                        position: "relative",
                        marginLeft: "24px",
                        color: "#3B99FC"
                      }}
                    >
                      <SpanIcon>
                        <Icons.Inbox width="14" height="14" color="#f0f0f0" />
                      </SpanIcon>
                      Inbox
                    </NavLink>
                  </Item>
                  <Item>
                    <NavLink
                      to={
                        props.param &&
                        props.location.pathname.includes("/agent/")
                          ? `/agent/${props.param}/processes/closed`
                          : `/processes/closed`
                      }
                      isActive={(match, location) =>
                        location.pathname.includes("/closed")
                      }
                      activeStyle={{
                        position: "relative",
                        marginLeft: "24px",
                        color: "#3B99FC"
                      }}
                    >
                      <SpanIcon>
                        <Icons.Star width="14" height="14" color="#f0f0f0" />
                      </SpanIcon>
                      Closed
                    </NavLink>
                  </Item>
                </List>
              </Menu>
            </React.Fragment>
          );
        }}
      </Query>
    </Wrapper>
  );
};

const Menu = styled.div`
  background: #36393F;
  border-bottom-left-radius: 2px;
  border-bottom-right-radius: 2px;
`;

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
  font-size: 11px;
  letter-spacing: 1px;
  color: #BEBEBE;
  & a {
    font-size: 12px;
    text-decoration: none;
    color: #2a3546;
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
  margin-top: 8px;
  letter-spacing: 0.5px;
  font-weight: 400;
  font-size: 12px;
  & a {
    text-decoration: none;
    color: ${props => props.theme.color.p100};
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
