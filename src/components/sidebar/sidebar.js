import React from "react";
import styled, { css } from "styled-components";
import Icons  from '../../atoms/icons'
import { NavLink } from "react-router-dom";
import media from "styled-media-query";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import Profile from "./profile";
import { LoadingMini, ErrorMini } from "../loading";
import Overview from '../../atoms/astronaut_y2.png'
import Flail from '../../atoms/flail.png'
import Requirement from '../../atoms/shining_star.png'
import Process from '../../atoms/shooting_star.png'
import Money from '../../atoms/moneybag.png'
import Exchange from '../../atoms/handshake_hmn_y2.png'
import Matched from '../../atoms/eyes.png'

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
        type
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
                type={data.viewer.agent.type}
              />
              <Menu>  
                  <List>
                    <Item>
                      <NavLink
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
                          color: "#fff",
                          fontWeight: '500',
                          borderRadius: '2px',
                          background: 'rgba(252, 254, 255, 0.14)',
                          border: '1px solid rgba(221, 223, 226, 0.16)'
                        }}
                      >
                        <SpanIcon style={{backgroundImage: `url(${Overview})`}}/>
                        Overview
                      </NavLink>
                    </Item>
                    <Item>
                      <NavLink
                        isActive={(match, location) => {
                          return (
                            location.pathname === `/agent/${props.param}/inventory` ||
                            location.pathname === "/inventory" ||
                            location.pathname === `/agent/${props.param}/inventory/`
                          );
                        }}
                        to={
                          props.param && props.location.pathname.includes("/agent/")
                            ? `/agent/${props.param}/inventory`
                            : `/inventory`
                        }
                        activeStyle={{
                          color: "#fff",
                          fontWeight: '500',
                          borderRadius: '2px',
                          background: 'rgba(252, 254, 255, 0.14)',
                          border: '1px solid rgba(221, 223, 226, 0.16)'
                        }}
                      >
                        <SpanIcon style={{backgroundImage: `url(${Flail})`}}/>
                        Inventory
                      </NavLink>
                    </Item>
                    <Item>
                      <NavLink
                        isActive={(match, location) => {
                          return (
                            location.pathname ===
                              `/agent/${props.param}/requirements` ||
                            location.pathname === "/requirements" ||
                            location.pathname ===`/agent/${props.param}/requirements/`
                          );
                        }}
                        to={
                          props.param &&
                          props.location.pathname.includes("/agent/")
                            ? `/agent/${props.param}/requirements`
                            : `/requirements`
                        }
                        activeStyle={{
                          color: "#fff",
                          fontWeight: '500',
                          borderRadius: '2px',
                          background: 'rgba(252, 254, 255, 0.14)',
                          border: '1px solid rgba(221, 223, 226, 0.16)'
                        }}
                      >
                        <SpanIcon style={{backgroundImage: `url(${Requirement})`}}/>
                        Requirements
                      </NavLink>
                    </Item>
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
                        color: "#fff",
                        fontWeight: '500',
                        borderRadius: '2px',
                        background: 'rgba(252, 254, 255, 0.14)',
                        border: '1px solid rgba(221, 223, 226, 0.16)'
                      }}
                    >
                      <SpanIcon style={{backgroundImage: `url(${Process})`}}/>
                      Processes
                    </NavLink>
                  </Item>
                  <Item>
                      <NavLink to={'#'}>
                        <SpanIcon style={{backgroundImage: `url(${Exchange})`}}/>
                        Exchange
                      </NavLink>
                    </Item>
                    <Item>
                      <NavLink to={'#'}>
                        <SpanIcon style={{backgroundImage: `url(${Money})`}}/>
                        Wallet
                      </NavLink>
                    </Item>
                  {props.profile ? <Item>
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
                          color: "#fff",
                          fontWeight: '500',
                          borderRadius: '2px',
                          background: 'rgba(252, 254, 255, 0.14)',
                          border: '1px solid rgba(221, 223, 226, 0.16)'
                        }}
                      >
                        <SpanIcon style={{backgroundImage: `url(${Matched})`}}/>
                        Matched
                        <Query query={getMatched}>
                          {({ data: { matched } }) => {
                            return <Total>{matched}</Total>;
                          }}
                        </Query>
                      </NavLink>
                    </Item> : null }
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
  // background: #36393F;
  // border-bottom-left-radius: 2px;
  // border-bottom-right-radius: 2px;
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
  // background: rgb(224, 226, 230);
  // padding: 8px;
  border-radius: 4px;
  // background: #3c4a58;
  padding: 8px;
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
  cursor: pointer;
  margin-right: 8px;
  display: inline-block;
  width: 18px;
  height: 18px;
  background-size: contain;
  vertical-align: sub;
`;

const List = styled.div`
  & a {
    display: block;
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
    font-size: 14px;
    text-decoration: none;
    height: 30px;
    line-height: 30px;
    padding: 0 8px;
    margin-left: -8px;
  }
`;

export default Sidebar;
