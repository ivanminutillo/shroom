import React from "react";
import styled from "styled-components";
import media from "styled-media-query";
import { clearFix } from "polished";
import { Icons } from "oce-components/build";
import { LoadingMini, ErrorMini } from "../../components/loading";
import getAgentInfo from "../../queries/getAgentInfo";
import { Query } from "react-apollo";
import { compose, withHandlers, withState } from "recompose";


const WrappedHeader = styled.div`
${clearFix()};
background: #2F3136;
position: relative;
`

const Header = styled.div`
  position: relative;
  height: 50px;
  color: ${props => props.theme.color.p100};
  background: #2F3136;
  border-bottom: 1px solid #1E2024;
  box-shadow: 0 1px 0 #373d45;
  z-index: 9999;
  ${clearFix()};
  ${media.lessThan("medium")`
    width: 100%;
  `};
`;

const AddPopup = styled.div`
display: ${props => props.visible ? 'block' :'none'};
background: #333d47;
border-bottom: 1px solid #373d45;
height: 40px;
${clearFix()};
`
const AddItem = styled.div`
float: left;
height: 20px;
cursor: pointer;
line-height: 20px;
border-right: 
margin-left: 16px;
padding-left: 16px;
padding-right: 16px;
color: ${props => props.theme.color.b100};
border-right: 1px solid
font-size: 14px;
margin-top: 10px;
&:last-of-type {
  border-right: 0;
}
`

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
  background: ${props => props.popup ? '#485562' : 'none'};
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

export default compose(
withState('popup', 'onPopup', false),
withHandlers({
  handlePopup: props => () => {
    props.onPopup(!props.popup)
  }
})
)(({id, toggleLeftPanel, togglePanel,openNewReq, popup, handlePopup}) => (
    <Query
    query={getAgentInfo}
    variables={{
      token: localStorage.getItem("oce_token"),
      id: id
    }}
  >
    {({ loading, error, data, refetch }) => {
      if (loading) return <LoadingMini />;
      if (error)
        return (
          <ErrorMini refetch={refetch} message={`Error! ${error.message}`} />
        );
      return (
        <WrappedHeader>
  <Header>
    <HeaderLeft>
      <HeaderSpan onClick={toggleLeftPanel}>
        <Icons.Left width="22" height="22" color="#99ADC6" />
      </HeaderSpan>
      <Img src={`${data.viewer.agent.image}`} />
      <Title>{data.viewer.agent.name}</Title>
    </HeaderLeft>
    <HeaderRight>
      <Span popup={popup} onClick={handlePopup}>
        <Icons.Plus width="20" height="20" color="#99ADC6" />
      </Span>
      <Span>
        <Icons.Search width="20" height="20" color="#99ADC6" />
      </Span>
      <Span onClick={togglePanel}>
        <Icons.Sidebar width="22" height='22' color="#99ADC6" />
      </Span>
    </HeaderRight>
  </Header>
    <AddPopup visible={popup} >
      <AddItem onClick={openNewReq}>Add a new requirement</AddItem>
      <AddItem>Add a new process</AddItem>
      <AddItem>Add a new Plan</AddItem>
    </AddPopup>
  </WrappedHeader>
      )}}
      </Query>
));
