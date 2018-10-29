import React from "react";
import s from "styled-components";
import { Icons } from "oce-components";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import { LoadingMini, ErrorMini } from "../../components/loading";
import SkillSelect from "./skillSelect";

const GET_SKILLS = gql`
  query($token: String) {
    viewer(token: $token) {
      myAgent {
        id
        agentSkills {
          id
          name
        }
      }
    }
  }
`;

export default ({ toggleSkills, providerId }) => (
  <Wrapper>
    <Header>
      <Span onClick={toggleSkills}>
        <Icons.Left width="20" height="20" color="#8D8D8D" />
      </Span>
      <Title>Edit skills</Title>
    </Header>
    <Body>
      <Query
        query={GET_SKILLS}
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
          let skills = data.viewer.myAgent.agentSkills.map(s => ({
            value: s.id,
            label: s.name
          }));
          console.log(skills)
          return (
          <SkillsWrapper>
            <SkillSelect providerId={providerId} client={client} skills={skills} />
          </SkillsWrapper>
          )
        }}
      </Query>
    </Body>
  </Wrapper>
);

const Skill = s.div`
border: 1px solid #2687d1;
    padding: 5px;
    border-radius: 2px;
    color: #3B99FC;
    font-size: 13px;
    font-weight: 400;
    margin-right: 8px;
    display: inline-block;
    margin-bottom: 8px;
`;

const Body = s.div`
  
`;

const SkillsWrapper = s.div`
  
`;

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
