import React from "react";
import styled from "styled-components";
import { clearFix } from "polished";
import { Img, AvatarTitle } from "../../atoms/avatar";
import { NavLink } from "react-router-dom";
const ProfileHeader = ({ providerImage, providerName, providerId, location }) => (
  <Profile>
    <Header>
        <Title>{providerName}</Title>
    </Header>
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
  // margin-top: 16px;
`;

const Profile = styled.div`
  // background: #36393F;
  // border-top-left-radius: 2px;
  // border-top-right-radius: 2px;
`;

const RoundedImg = styled(Img)`
  border-radius: 100px;
  height: 26px;
  width: 26px;
  background-color: #71757f;
`;

const Title = styled(AvatarTitle)`
  line-height: 26px;
  color: ${props => props.theme.color.p100};
  margin-left:0;
  font-size: 18px;
  font-weight: 500;
`;

export default ProfileHeader;
