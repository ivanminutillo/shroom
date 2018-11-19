import React from 'react'
import styled from 'styled-components'
import { LoadingMini, ErrorMini } from "../../components/loading";
import Select from "react-select";
import {clearFix} from 'polished'
import { Query } from "react-apollo";
import { Icons } from "oce-components/build";
import gql from "graphql-tag";

const ProfileHeader = (props) => (
    <Profile>
        <Header>
        <Span onClick={props.togglePanel}>
          <Icons.Menu width="18" color="#f0f0f0" />
        </Span>
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
              options.unshift({ value: "profile", label: props.providerName });
              let defaultValue;
              let defaultLabel;
              if (props.location.pathname.includes("/agent/")) {
                defaultValue = props.location.pathname.replace(/\D/g, "");
                defaultLabel = data.viewer.myAgent.agentRelationships.filter(
                  a => a.object.id === defaultValue
                );
                defaultLabel = defaultLabel[0].object.name;
              } else {
                (defaultLabel = props.providerName), (defaultValue = "profile");
              }
              let defaultOption = {
                value: defaultValue,
                label: defaultLabel
              };
              return (
                <GroupSelect
                  defaultValue={defaultOption}
                  handleGroup={props.handleGroup}
                  options={options}
                  client={client}
                />
              );
            }}
          </Query>
        </WrapperSelect>
        </Header>
        <ProfileInfo>
          <Data>
            <DataTitle>Relationships</DataTitle>
            <DataNumber>193</DataNumber>
          </Data>
          <Data>
            <DataTitle>Inventory</DataTitle>
            <DataNumber>19</DataNumber>
          </Data>
        </ProfileInfo>
      </Profile>
)



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

const ProfileInfo = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 8px;
  margin-top: 20px;
`
const Header = styled.div`
${clearFix()}`
const Data = styled.div``


const DataTitle = styled.h3`
font-size: 13px;
letter-spacing: .5px;
margin-bottom: 8px;
color: #ACD2FB;
text-align: center;
`
const DataNumber = styled.h1`
font-size: 22px;
letter-spacing: 1px;
text-align: center;
`

const WrapperSelect = styled.div`
  float: left;
  margin: 0;
  width: 225px;
  margin-top: 3px;
  margin-left: 8px;
  position: relative;
  z-index: 9999999;
  & span {
    background-color: transparent !important;
  }
`;

const Span = styled.div`
  vertical-align: middle;
  cursor: pointer;
  margin-left: 16px;
  float: left;
  margin-top: 5px;
`;
const Profile = styled.div`
  height: 110px;
  background: ${props => props.theme.color.b100};
  border-radius: 2px;
  margin-top: 8px;
`;



const customStyles = {
    control: base => ({
      ...base,
      background: "transparent",
      border: "none",
      color: "#f0f0f0",
      fontWeight: 500,
      fontSize: "14px",
      minHeight: "30px",
      height: "30px",
      borderRadius: "0px"
    }),
    input: base => ({
      ...base,
      color: "#f0f0f0",
      fontWeight: 500,
      fontSize: "14px",
      height: "30px"
    }),
    singleValue: base => ({
      ...base,
      color: "#f0f0f0",
      fontWeight: 500,
      fontSize: "14px"
    }),
    option: base => ({
      ...base,
      fontSize: "14px"
    }),
    menuList: base => ({
      ...base,
      fontSize: "14px"
    }),
    placeholder: base => ({
      ...base,
      color: "#3B99FC",
      fontWeight: 500,
      fontSize: "14px"
    })
  };
  
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
  

  export default ProfileHeader