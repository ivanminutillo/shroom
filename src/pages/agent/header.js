import React from "react";
import styled from "styled-components";
import media from "styled-media-query";
import { clearFix } from "polished";
import { Icons } from "oce-components/build";
import Select from "react-select";
import {withRouter} from 'react-router-dom'
export default withRouter(({
  toggleLeftPanel,
  history,
  togglePanel,
  handleEvent,
  togglenewRequirementModal,
  togglenewProcessModal,
  name,
  image
}) => {
 
  return (
    <WrappedHeader>
      <Header>
        <Navigation>
          <button
            disabled={history.entries.length > 1 ? false : true}
            onClick={() => history.goBack()}
          >
            <Icons.Left
              width="18"
              height="18"
              color={history.entries.length > 1 ? "#f0f0f0" : "#f0f0f080"}
            />
          </button>
          <button onClick={() => history.goForward()}>
            <Icons.ArrowRight width="18" height="18" color="#f0f0f0" />
          </button>
        </Navigation>
        <HeaderLeft>
          <HeaderSpan onClick={toggleLeftPanel}>
            <Icons.Left width="22" height="22" color="#99ADC6" />
          </HeaderSpan>
          <Img src={image} />
          <Title>{name}</Title>
        </HeaderLeft>
      </Header>
      {/* <Filter>
        <Item>
          <Select
            styles={customStyles}
            options={[
              { value: "all", label: "All event types" },
              { value: "work", label: "Show only work type" },
              { value: "cite", label: "Show only cite type" },
              { value: "consume", label: "Show only consume type" },
              { value: "produce", label: "Show only produce type" }
            ]}
            defaultValue={{ value: "all", label: "All event types" }}
            onChange={handleEvent}
          />
        </Item>
      </Filter> */}
    </WrappedHeader>
  );
});

const customStyles = {
  control: base => ({
    ...base,
    background: "rgba(250,250,250,0)",
    border: "none",
    color: "#3B99FC",
    fontWeight: 500,
    fontSize: "13px",
    minHeight: "22px",
    height: "22px",
    borderRadius: "4px"
  }),
  input: base => ({
    ...base,
    color: "#3B99FC",
    fontWeight: 500,
    fontSize: "13px",
    height: "22px"
  }),
  singleValue: base => ({
    ...base,
    color: "#3B99FC",
    fontWeight: 500,
    fontSize: "13px"
  }),
  option: base => ({
    ...base,
    fontSize: "13px",
    color: "#333"
  }),
  menuList: base => ({
    ...base,
    fontSize: "13px",
    color: "#333"
  }),
  placeholder: base => ({
    ...base,
    color: "#3B99FC",
    fontWeight: 500,
    fontSize: "13px"
  })
};

const Navigation = styled.div`
  vertical-align: middle;
  float:left;
  margin-top: 12px;
  margin-left: 8px;
  & button {
    width: 30px;
    border: none;
    height: 25px;
    display: inline-block;
    text-align: center;
    background: #3487dd;
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
    cursor: pointer;
    &[disabled] {
      background: #7d8d9ead;
      &:hover {
        background: #7d8d9ead; 
      }
    }
    &:hover {
      background: #6e5ddf;
    }
    &:last-of-type {
      border-radius: 0;
      border-top-right-radius: 3px;
      border-bottom-right-radius: 3px;
      margin-left: 1px;
    }
    & svg {
      margin-top: 3px;
    }
  }
  `;

const Filter = styled.div`
  ${clearFix()};
  height: 30px;
  margin-left: 8px;
`;
const Item = styled.div`
  float: left;
  margin-right: 4px;
  border-radius: 3px;
  height: 22px;
  background: #40454c;
  margin-top: 4px;
  line-height: 22px;
  font-size: 13px;
  color: #f0f0f0;
  width: 180px;
  cursor: pointer;
`;
const WrappedHeader = styled.div`
  ${clearFix()};
  background: #2f3136;
  position: relative;
`;

const Header = styled.div`
  position: relative;
  height: 50px;
  color: ${props => props.theme.color.p100};
  background: #2f3136;
  border-bottom: 1px solid #1e2024;
  box-shadow: 0 1px 0 #373d45;
  z-index: 9999;
  ${clearFix()};
  ${media.lessThan("medium")`
    width: 100%;
  `};
`;

const HeaderLeft = styled.div`
  float: left;
  margin-left: 8px;
  ${clearFix()};
`;

const HeaderSpan = styled.div`
  float: left;
  vertical-align: sub;
  margin-top: 14px;
  margin-left: 0px;
  cursor: pointer;
  display: none;
  ${media.lessThan("medium")`
    display: block;
    margin-right: 8px;
  `};
`;

const WrapperNew = styled.div`
cursor: pointer;
float: right;
margin-right: 8px;
margin-top: 10px;
box-sizing: border-box;
width: 180px;
position: relative;
z-index: 99999;
`;

const HeaderRight = styled.div`
  float: right;
  ${clearFix()};
  margin-right: 8px;
`;

const Span = styled.div`
  margin-right: 0px;
  cursor: pointer;
  float: left;
  margin-left: 24px;
  background: ${props => (props.popup ? "#485562" : "none")};
  width: 30px;
  height: 30px;
  vertical-align: middle;
  text-align: center;
  border-radius: 100%;
  margin-top: 10px;
  & svg {
    margin-top: 5px;
  }
  &:hover {
    background: #485562;
  }
`;

const Img = styled.div`
  float: left;
  background: url(${props => props.src});
  border-radius: ${props => props.theme.avatar.radius};
  width: ${props => props.theme.avatar.mini};
  height: ${props => props.theme.avatar.mini};
  margin-top: 11px;
  margin-left: 0px;
  background-size: cover;
  background-color: ${props => props.theme.color.p600};
`;
const Title = styled.h2`
  float: left;
  margin-left: 8px;
  line-height: 50px;
`;

