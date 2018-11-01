import React from "react";
import styled, { css } from "styled-components";
import { Input, Icons } from "oce-components/build";
import { Img, AvatarTitle, AvatarWrapper } from "../../atoms/avatar";
import { NavLink } from "react-router-dom";
import media from "styled-media-query";
import { placeholder } from "polished";
import Select from "react-select";
import { compose, withState, withHandlers } from "recompose";

const customStyles = {
  control: base => ({
    ...base,
    background: "#4F576C",
    border: "1px solid #7D849A50",
    color: "#f0f0f0"
  }),
  input: base => ({
    ...base,
    color: "#f0f0f0"
  }),
  singleValue: base => ({
    ...base,
    color: "#f0f0f0"
  }),
  placeholder: base => ({
    ...base,
    color: "#f0f0f0",
    fontSize: "14px"
  })
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
  border-bottom: 1px solid #1e2024;

  margin: 8px;
  border-radius: 4px;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.2);
  background-color: #21d4fd;
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
    background: ${props => props.theme.color.p600};
    color: #f0f0f0;
    ${placeholder({ color: "#f0f0f0" })};
  }
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

const Sidebar = compose(
  withState("group", "onGroup", "all"),
  withHandlers({
    handleGroup: props => val => {
      if (val.value !== "all") {
        props.history.push("/agent/" + val.value);
      } else {
        props.history.push("/");
      }
      return props.onGroup(val.value);
    }
  })
)(
  ({
    togglePanel,
    handleGroup,
    history,
    agents,
    group,
    data,
    isOpen,
    toggleSidebar
  }) => {
    let options = agents.map(a => ({
      value: a.object.id,
      label: a.object.name
    }));
    options.unshift({ value: "all", label: "All groups" });
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
        <WrapperSelect>
          <Select
            styles={customStyles}
            options={options}
            placeholder={"Select a group"}
            isSearchable
            onChange={handleGroup}
            value={{ value: "all", label: "All groups" }}
          />
        </WrapperSelect>
        <Events agent={group} />
        <List>
          <ListTitle>plans</ListTitle>
          <Item>Prepare a pie</Item>
          <Item>Example 1</Item>
          <Item>Exampple 2</Item>
        </List>
      </Wrapper>
    );
  }
);

const Events = ({ agent }) => {
  const checkActive = (match, location) => {
    //some additional logic to verify you are in the home URI
    if (!location) return false;
    const { pathname } = location;
    return pathname === "/";
  };
  return (
    <List>
      <ListTitle>Events</ListTitle>
      <Item>
        <NavLink
          isActive={checkActive}
          to={agent === "all" ? `/` : `/agent/${agent}/`}
          activeStyle={{
            position: "relative",
            marginLeft: "24px",
            color: "#f0f0f0"
          }}
        >
          Inbox
        </NavLink>
      </Item>
      <Item>
        <NavLink
          to={agent === "all" ? `/committed` : `/agent/${agent}/committed`}
          activeStyle={{
            position: "relative",
            marginLeft: "24px",
            color: "#f0f0f0"
          }}
        >
          Committed
        </NavLink>
      </Item>
      <Item>
        <NavLink
          to={agent === "all" ? `/matched` : `/agent/${agent}/matched`}
          activeStyle={{
            position: "relative",
            marginLeft: "24px",
            color: "#f0f0f0"
          }}
        >
          Matched
        </NavLink>
      </Item>
    </List>
  );
};

const WrapperSelect = styled.div`
  margin: 8px 16px 0px;
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
