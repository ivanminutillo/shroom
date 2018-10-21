import React from "react";
import styled from "styled-components";
import { Icons } from "oce-components/build";
import { clearFix } from "polished";
import { Img, AvatarTitle, AvatarWrapper } from "../../atoms/avatar";
import { LoadingMini, ErrorMini } from "../../components/loading";
import getAgent from "../../queries/getAgent";
import { Query } from "react-apollo";
import media from 'styled-media-query'


const Wrapper = styled.div`
width: 420px;
display: flex;
flex-direction: column;
overflow-y: overlay;
height: 100vh;
background: #20232d;
transition: left 0.5s ease;
${media.lessThan('medium')`
width: 100%;
`}
`;
const Header = styled.div`
  height: 50px;
  ${clearFix()};
  padding: 0 10px;
`;

const Span = styled.div`
  float: right;
  margin-top: 14px;
  cursor: pointer;
`;

const Title = styled.h2`
  float: left;
  line-height: 50px;
`;
const Info = styled.div`
  border-bottom: 1px solid #99adc63b;
  margin-top: 16px;
`;

const Avatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 100%;
  margin: 0 auto;
  background: url(${props => props.src});
  background-color:  ${props => props.theme.color.p600};

`;

const Name = styled.h1`
  text-align: center;
  margin-top: 16px;
`;
const Bio = styled.p`
  padding: 16px;
`;

const SpanIcon = styled.span`
vertical-align: sub;
margin-right: 24px;
display: inline-block;
`;

const List = styled.div`
  padding: 20px;
  border-bottom: 1px solid #99adc63b;
`


const Text = styled.h2`
  display: inline-block;
  font-weight: 400;
`

const SectionTitle = styled.h3`
  display: inline-block;
  font-weight: 400;
  color: ${props => props.theme.color.p300};
`

const HeaderSection = styled.div`
  margin-bottom: 20px;
  margin-left: 8px;
`

const SectionSpan = styled.span`
  vertical-align: sub;
  margin-right: 8px;
`

const Item = styled.div`
  height: 40px;
  line-height: 40px;
  font-weight: 400;
  color: ${props => props.theme.color.p100};
`;

const RightPanel = ({ onTogglePanel, isOpen, id, match }) =>
  isOpen ? (
      <Query
        query={getAgent}
        variables={{
          token: localStorage.getItem("oce_token"),
          id: id ? id : Number(match.params.id)
        }}
      >
        {({ loading, error, data, refetch }) => {
          if (loading) return <LoadingMini />;
          if (error)
            return (
              <ErrorMini refetch={refetch} message={`Error! ${error.message}`} />
            );
          return (
    <Wrapper>
      <Header>
        <Title>Agent info</Title>
        <Span onClick={onTogglePanel}>
          <Icons.Cross width="22" color="#989BA0" />
        </Span>
      </Header>
      <Info>
        <Avatar src={data.viewer.agent.image} />
        <Name>{data.viewer.agent.name}</Name>
        <Bio>
          {data.viewer.agent.note}
        </Bio>
      </Info>
      <List>
        <Item><SpanIcon><Icons.Copy width='26' color='rgb(153, 173, 198)' /> </SpanIcon><Text>Plans</Text></Item>
        <Item><SpanIcon><Icons.Inventory width='26' color='rgb(153, 173, 198)' /> </SpanIcon><Text>Inventory</Text></Item>
        <Item><SpanIcon><Icons.Folder width='26' color='rgb(153, 173, 198)' /> </SpanIcon><Text>Wallet</Text></Item>
      </List>
      <List>
        <HeaderSection>
          <SectionSpan><Icons.Users width='20' color='rgb(153, 173, 198)' /> </SectionSpan>
          <SectionTitle>{data.viewer.agent.agentRelationships.length} Participants</SectionTitle>
        </HeaderSection>
        {data.viewer.agent.agentRelationships.map((agent, i) => (
        <AvatarWrapper key={i}>
            <Img src={agent.subject.image} />
            <AvatarTitle>{agent.subject.name}</AvatarTitle>
        </AvatarWrapper>
        ))}
      </List>
    </Wrapper>
     );
    }}
  </Query>
  ) : null;

export default RightPanel;
