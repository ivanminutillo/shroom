import React from "react";
import s from "styled-components";
import Select from "react-select";
import {withRouter} from 'react-router-dom'
import { clearFix, placeholder } from "polished";
import gql from "graphql-tag";
import { Icons } from "oce-components/build";
import { Query } from "react-apollo";
import { LoadingMini, ErrorMini } from "../../components/loading";
import { Img, AvatarTitle, AvatarWrapper } from "../../atoms/avatar";
import {compose, withState, withHandlers} from 'recompose'
export default withRouter(compose(
  withState('route', 'onRoute', '/'),
)(({
  handleGroup,
  match, location, history,
  togglePanel,
  providerImage,
  togglenewRequirementModal,
  togglenewProcessModal,
  providerName
}) => {
  console.log(match)
  console.log(location)
  
  console.log(history)
  
  const openStuff = (val) => {
    if (val.value === 'requirement') {
      return togglenewRequirementModal()
    } else if (val.value === 'process') {
      return togglenewProcessModal()
    }
  }
  return (
  <HeaderWrapper>
    <Header>
      <Span onClick={togglePanel}>
        <Icons.Menu width="18" color="#f0f0f0" />
      </Span>
      <SpanInput>
        <AvatarWrapper>
          <Img small src={`${providerImage}`} />
          <AvatarTitle>{providerName}</AvatarTitle>
        </AvatarWrapper>
      </SpanInput>
    </Header>
    <Navigation>
      <button disabled={history.entries.length > 1 ? false : true} onClick={() => history.goBack()}><Icons.Left width='18' height='18' color={history.entries.length > 1 ? '#f0f0f0' : '#f0f0f080'} /></button>
      <button onClick={() => history.goForward()}><Icons.ArrowRight width='18' height='18' color='#f0f0f0' /></button>
    </Navigation>
    <WrapperSelect>
      <Query
        query={agentRelationships}
        variables={{
          token: localStorage.getItem("oce_token")
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

          let options = data.viewer.myAgent.agentRelationships.map(a => ({
            value: a.object.id,
            label: a.object.name
          }));
          options.unshift({ value: "all", label: "All groups" });
          let defaultValue
          let defaultLabel;
          if (location.pathname.includes('/agent/')) {
            console.log('sto dentro')
            defaultValue = history.location.pathname.replace(/\D/g, "");
            defaultLabel = data.viewer.myAgent.agentRelationships.filter(
              a => a.object.id === defaultValue
            );
            defaultLabel = defaultLabel[0].object.name;
          } else {
            (defaultLabel = "All groups"), (defaultValue = "all");
          }
          let defaultOption = {
            value: defaultValue,
            label: defaultLabel
          };
          return (
            <GroupSelect
              defaultValue={defaultOption}
              handleGroup={handleGroup}
              options={options}
              client={client}
            />
          );
        }}
      </Query>
    </WrapperSelect>
    <WrapperNew>
        <Select
          styles={customStylesTwo}
          onChange={openStuff}
          value={{value: null, label: 'Add new...'}}
          options={[{value: 'requirement', label: 'Add a new requirement'}, {value: 'process', label: 'Add a new process'}]}
        />
      {/* <SpanNew><Icons.Plus width='18' height='18' color='#f0f0f0' /></SpanNew>
      <Title>Add new requirement</Title> */}
    </WrapperNew>
  </HeaderWrapper>
)}));

const agentRelationships = gql`
  query($token: String) {
    viewer(token: $token) {
      myAgent {
        id
        agentRelationships {
          object {
            id
            name
          }
        }
      }
    }
  }
`;

const Header = s.div`
  height: 36px;
  width: 270px;
  float: left;
  ${clearFix()}
  background: #277BD5;
  border-right: 1px solid #1e68b8;
    box-shadow: 1px 0px 0px rgba(250,250,250,0.1);
`;

const Span = s.div`
  vertical-align: middle;
  cursor: pointer;
  margin-left: 16px;
  float:left;
  margin-top: 5px;
`;
const Navigation = s.div`
  vertical-align: middle;
  float:left;
  margin-top: 5px;
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
  const WrapperNew= s.div`
  cursor: pointer;
  float: right;
  margin-right: 16px;
  margin-top: 3px;
  box-sizing: border-box;
  width: 180px;
  position: relative;
  z-index: 99999;
`
const Title = s.h3`
font-size: 13px;
line-height: 26px;
margin-left: 4px;
float: left;
`

const SpanInput = s.div`
  margin-right: 8px;
  float: left;
`;

const customStyles = {
  control: base => ({
    ...base,
    background: "rgba(250,250,250, .8)",
    border: "none",
    color: "#3B99FC",
    fontWeight: 500,
    fontSize: "13px",
    minHeight: "30px",
    height: "30px",
    borderRadius: "6px"
  }),
  input: base => ({
    ...base,
    color: "#3B99FC",
    fontWeight: 500,
    fontSize: "13px",
    height: "30px"
  }),
  singleValue: base => ({
    ...base,
    color: "#3B99FC",
    fontWeight: 500,
    fontSize: "13px"
  }),
  option: base => ({
    ...base,
    fontSize: "13px"
  }),
  menuList: base => ({
    ...base,
    fontSize: "13px"
  }),
  placeholder: base => ({
    ...base,
    color: "#3B99FC",
    fontWeight: 500,
    fontSize: "13px"
  })
};
const customStylesTwo = {
  control: base => ({
    ...base,
    background: '#2d81d9',
    border: '1px solid #396ea6',
    color: "#f0f0f0",
    fontWeight: 500,
    fontSize: "13px",
    minHeight: "30px",
    height: "30px",
    borderRadius: "6px"
  }),
  input: base => ({
    ...base,
    color: "#f0f0f0",
    fontWeight: 500,
    fontSize: "13px",
    height: "30px"
  }),
  singleValue: base => ({
    ...base,
    color: "#f0f0f0",
    fontWeight: 500,
    fontSize: "13px"
  }),
  option: base => ({
    ...base,
    fontSize: "13px"
  }),
  menuList: base => ({
    ...base,
    fontSize: "13px"
  }),
  placeholder: base => ({
    ...base,
    color: "#f0f0f0",
    fontWeight: 500,
    fontSize: "13px"
  })
};

const WrapperSelect = s.div`
    float: left;
    margin: 0;
    width: 200px;
    margin-top: 3px;
    margin-left: 8px;
    position: relative;
    z-index: 9999999;
  `;

const HeaderWrapper = s.div`
  height: 36px;
  ${clearFix()}
  background: ${props => props.theme.color.b100};
  `;


const GroupSelect = props => {
  return (
    <Select
      placeholder="Select a group..."
      // value={field.value}
      styles={customStyles}
      defaultValue={props.defaultValue}
      onChange={val => props.handleGroup(val)}
      options={props.options}
    />
  );
};
