import React from "react";
import styled from "styled-components";
import { clearFix } from "polished";
import { Img, AvatarTitle, AvatarWrapper } from "../../atoms/avatar";
import { NavLink } from "react-router-dom";
const ProfileHeader = ({ providerImage, providerName, providerId, location }) => (
  <Profile>
    <Header>
      <AvatarWrapper>
        <RoundedImg src={`${providerImage}`} />
        <Title>{providerName}</Title>
      </AvatarWrapper>
    </Header>
    <List>
      <NavLink
        isActive={(match, location) => {
          return (
            location.pathname === `/agent/${providerId}/` ||
            location.pathname === "/" ||
            location.pathname === `/agent/${providerId}`
          );
        }}
        to={
          providerId && location.pathname.includes("/agent/")
            ? `/agent/${providerId}/`
            : `/`
        }
        activeStyle={{
          position: "relative",
          color: "#3B99FC"
        }}
      >
        <Item>Home</Item>
      </NavLink>
      <NavLink
        isActive={(match, location) => {
          return (
            location.pathname === `/agent/${providerId}/relationships` ||
            location.pathname === "/relationships" ||
            location.pathname === `/agent/${providerId}/relationships/`
          );
        }}
        to={
          providerId && location.pathname.includes("/agent/")
            ? `/agent/${providerId}/relationships`
            : `/relationships`
        }
        activeStyle={{
          position: "relative",
          marginLeft: "24px",
          color: "#3B99FC"
        }}
      >
        <Item>Relationships</Item>
      </NavLink>
      <NavLink 
       isActive={(match, location) => {
        return (
          location.pathname === `/agent/${providerId}/inventory` ||
          location.pathname === "/inventory" ||
          location.pathname === `/agent/${providerId}/inventory/`
        );
      }}
      to={
        providerId && location.pathname.includes("/agent/")
          ? `/agent/${providerId}/inventory`
          : `/inventory`
      }
      activeStyle={{
        position: "relative",
        marginLeft: "24px",
        color: "#3B99FC"
      }}
      >
        <Item>Inventory</Item>
      </NavLink>
    </List>
  </Profile>
);

const List = styled.div`
  padding: 5px 0;
  & a {
    display: block;
    text-decoration: none;
  }
  &:last-of-type {
    border-bottom: 0px;
  }
`;
const Item = styled.div`
  color: inherit;
  padding: 0 10px;
  display: block;
  text-decoration: none;
  line-height: 32px;
  font-size: 13px;
  letter-spacing: 0.5px;
`;

const Header = styled.div`
  ${clearFix()};
  margin-top: 16px;
`;

const Profile = styled.div`
  background: #454b54;
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
`;

const RoundedImg = styled(Img)`
  border-radius: 100px;
  height: 26px;
  width: 26px;
  background-color: #71757f;
`;

const Title = styled(AvatarTitle)`
  line-height: 26px;
`;

export default ProfileHeader;
