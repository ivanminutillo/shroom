import React from "react";
import styled from "styled-components";
import { clearFix, transitions } from "polished";
import Icons from '../../atoms/icons.tsx'
import Select from 'react-select'
import media from "styled-media-query";

const Module = styled.div`
  ${clearFix()};
  margin: 0 auto;
  position: relative;
  width: 620px;
  background: #fff;
  border-radius: 3px;
  position: absolute;
  top: ${props => (props.isOpen ? "10px" : "16px")};
  left: 50%;
  margin-left: -310px;
  visibility: ${props => (props.isOpen ? 'visibile' : 'hidden')};
  z-index: ${props => (props.isOpen ? 999999999999999 : 0)};
  opacity: ${props => (props.isOpen ? 1 : 0)};
  height: ${props => (props.isOpen ? 'auto' : 0)};
  ${transitions(
    "top 0.2s ease-in",
    "max-height 0.4s ease-in",
    "opacity 0.1s ease-in"
  )};
  ${media.lessThan("medium")`
    width: 100%;
    left: 0;
    margin: 0;
    top: 40px;
  `}
`;

const Header = styled.div`
  ${clearFix()};
  height: 60px;
`;

const Span = styled.div`
  float: right;
  margin-right: 10px;
  margin-top: 20px;
  cursor: pointer;
`;

const Title = styled.h2`
  margin-left: 10px;
  line-height: 60px;
  float: left;
  color: ${props => props.theme.color.p900};
  font-weight: 300;
`;

const Item = styled.div`
  font-size: ${props => props.theme.fontSize.h3};;
  color: ${props => props.theme.color.b100};
  font-weight: 500;
  letter-spacing: 0.5px;
`;

const List = styled.div`
  ${clearFix()};
`;

const ListItem = styled.div`
  ${clearFix()};
  padding: 8px;
  border-bottom: 1px solid #dadada59;
  cursor: pointer;
  &:hover {
      background: #208dfe1f
  }
  &:last-of-type {
      border-bottom: 0;
  }
`;


const Desc = styled.div`
  ${clearFix()};
  margin-top: 4px;
  font-weight: 400;
  font-style: italic;
  font-size: ${props => props.theme.fontSize.h3};
  color: ${props => props.theme.color.p200};
`;

const options = [
    { value: '1', label: 'Write a message' },
    { value: '2', label: 'Log an economic event' },
    { value: '3', label: 'Transfer a currency' }
  ]

const customStyles = {
    control: (base) => ({
        ...base,
        borderRadius: 0,
        border: 0,
        background: '#f3f6f9'
    })
}

const Helper = ({ isOpen, toggleModal, menuSelected, handleMenuSelection }) => {
    return (
  <Module isOpen={isOpen}>
    <Header>
      <Title>👩‍🚀 What are you looking for</Title>
      <Span onClick={toggleModal}>
        <Icons.Cross width="20" height="20" color="#dadada" />
      </Span>
    </Header>
    <List>
      <Select styles={customStyles} onChange={handleMenuSelection} autoFocus={true} options={options} placeholder='Select an action...' />
    </List>
  </Module>
)};

export default Helper