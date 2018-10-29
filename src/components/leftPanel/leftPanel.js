import React from "react";
import styled, { css } from "styled-components";
import { Icons } from "oce-components/build";
import { Img, AvatarTitle, AvatarWrapper } from "../../atoms/avatar";
import { NavLink } from "react-router-dom";
import { compose, withHandlers } from "recompose";
import media from "styled-media-query";

const LeftPanel = styled.section`
  position: absolute;
  z-index: 9;
  left: -270px;
  top: 0;
  bottom: 0;
  width: 270px;
  background: ${props => props.theme.color.p800};
  transition: left 0.5s ease;
  ${props =>
    props.active &&
    css`
      left: 0;
      ${media.lessThan("medium")`
      width: 90%;
      z-index: 999999;
      `};
    `};
`;

const Header = styled.div`
  padding: 10px;
  background: ${props => props.theme.color.b100};
`;

const Span = styled.div`
  display: inline-block;
  margin-right: 10px;
  vertical-align: middle;
  cursor: pointer;
`;

const List = styled.div`
  margin-top: 16px;
`;

const Item = styled.div`
  cursor: pointer;
  padding: 8px 16px;
  &:hover {
    background: ${props => props.theme.color.b200};
  }
`;

const Title = styled.h3`
  display: inline-block;
  font-size: 14px;
  font-weight: 400;
  margin-left: 16px;
`;

const Bottom = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
  padding: 20px;
  font-weight: 400;
`;

const First = styled.h3`
  font-weight: 400;
  margin-bottom: 10px;
  color: ${props => props.theme.color.p200};
`;
const Second = styled.h3`
  font-weight: 300;
  color: ${props => props.theme.color.p200};
`;

const Sidebar = ({ togglePanel, toggleSettings, active, data, logout }) => (
  <LeftPanel onClick={togglePanel} active={active}>
    <Header>
      <AvatarWrapper>
        <Img src={`${data.image}`} />
        <AvatarTitle>{data.name}</AvatarTitle>
      </AvatarWrapper>
    </Header>
    <List>
      <NavLink to={"/"}>
        <Item>
          <Span>
            <Icons.User color="#99ADC6" width="18" />
          </Span>
          <Title>Profile</Title>
        </Item>
      </NavLink>
      {/* <Item>
        <Span>
          <Icons.Users color="#99ADC6" width="18" />
        </Span>
        <Title>Network</Title>
      </Item> */}
      <Item>
        <Span>
          <Icons.Edit2 color="#99ADC6" width="18" />
        </Span>
        <Title>Create a new plan</Title>
      </Item>
      {/* <Item>
        <Span>
          <Icons.Star color="#99ADC6" width="18" />
        </Span>
        <Title>Validate</Title>
      </Item> */}
      {/* <NavLink to={"/wallet"}>
        <Item>
          <Span>
            <Icons.Folder color="#99ADC6" width="18" />
          </Span>
          <Title>Wallet</Title>
        </Item>
      </NavLink> */}
      <Item onClick={toggleSettings}>
        <Span>
          <Icons.Settings color="#99ADC6" width="18" />
        </Span>
        <Title>Settings</Title>
      </Item>
      <Item onClick={logout}>
        <Span>
          <Icons.Power color="#99ADC6" width="18" />
        </Span>
        <Title>Log out</Title>
      </Item>
    </List>
    <Bottom>
      <First>Economic Pub</First>
      <Second>v. 0.0.1 - About</Second>
    </Bottom>
  </LeftPanel>
);

export default compose(
  withHandlers({
    // onTogglePopup: props => (popup) => {
    //   props.togglePopup(popup)
    // },
    onCreatePlanFromRecipe: props => event => {
      props.toggleCreatePlanFromRecipe(!props.createPlanFromRecipe);
    },
    logout: props => event => {
      localStorage.removeItem("oce_token");
      window.location.reload();
    }
  })
)(Sidebar);
