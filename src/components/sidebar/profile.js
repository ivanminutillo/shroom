import React from "react";
import styled from "styled-components";
import { clearFix } from "polished";
import { AvatarTitle } from "../../atoms/avatar";
import Individual from "../../atoms/paw_print.png";
import Group from "../../atoms/paws.png";

const ProfileHeader = ({
  providerName,
  type,
}) => (
  <Profile>
    <Header>
      <Title>{providerName}</Title>
    </Header>
      <Type>
        {type === "Person" ? (
          <SpanIcon style={{ backgroundImage: `url(${Individual})` }} />
        ) : (
          <SpanIcon style={{ backgroundImage: `url(${Group})` }} />
        )}
        {type === "Person" ? 'Human' : type}
      </Type>
  </Profile>
);

const SpanIcon = styled.div`
  cursor: pointer;
  margin-right: 8px;
  display: inline-block;
  width: 18px;
  height: 18px;
  background-size: contain;
  vertical-align: sub;
`;

const Header = styled.div`
  ${clearFix()};
`;
const Type = styled.div`
  ${clearFix()};
  color: #f0f0f060;
  margin-top: 4px;
  margin-bottom: 10px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
`;

const Profile = styled.div``;

const Title = styled(AvatarTitle)`
  line-height: 26px;
  color: ${props => props.theme.color.p100};
  margin-left: 0;
  font-size: 18px;
  font-weight: 500;
`;

export default ProfileHeader;
