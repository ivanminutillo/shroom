import React from "react";
import s from "styled-components";
import Icons from '../../atoms/icons'
import { Query } from "react-apollo";
import InfoForm from "./infoForm";
import gql from "graphql-tag";
import { LoadingMini, ErrorMini } from "../../components/loading";

const GET_AGENT = gql`
  query($token: String) {
    viewer(token: $token) {
      myAgent {
        id
        name
        email
        note
        image
      }
    }
  }
`;

export default ({ toggleInfo }) => (
  <Query
    query={GET_AGENT}
    variables={{
      token: localStorage.getItem("oce_token")
    }}
  >
    {({ loading, error, data, refetch, client }) => {
      if (loading) return <LoadingMini />;
      if (error)
        return (
          <ErrorMini refetch={refetch} message={`Error! ${error.message}`} />
        );
      return (
        <Wrapper>
          <Header>
            <Span onClick={toggleInfo}>
              <Icons.Left width="20" height="20" color="#8D8D8D" />
            </Span>
            <Title>Edit general information</Title>
          </Header>
          <InfoForm agent={data.viewer.myAgent}/>
        </Wrapper>
      );
    }}
  </Query>
);

const Wrapper = s.div`
position: absolute;
top: 0;
left: 0;
right: 0;
z-index: 999999999;
padding: 16px;
background: #F0F0F0;
`;
const Header = s.div`

`;

const Span = s.div`
  display: inline-block;
  vertical-align: sub;
  margin-right: 16px;
  cursor: pointer;
  `;

const Title = s.h3`  
  display: inline-block;
  color: ${props => props.theme.color.p900};
  letter-spacing: 0.5px;
  margin-bottom: 16px;
`;
