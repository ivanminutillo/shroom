import React from "react";
import styled from "styled-components";
import Header from "../agent/header";
import media from "styled-media-query";
import HeaderTitle from "../../components/agentSectionHeader";
import Intent from "../../components/agentintents/intents";
import { Query } from "react-apollo";
import { LoadingMini, ErrorMini } from "../../components/loading";
import getComms from "../../queries/getCommitments";
import getSkillsCommitments from "../../queries/getSkillsCommitments";
import Sidebar from "../../components/sidebar/sidebar";
const Body = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
`;

export default props => {
  return (
    <Body>
    <Sidebar
      isOpen={props.isSidebarOpen}
      param={props.match.params.id}
    />
    <Wrapper isOpen={props.isOpen}>
      <Header
        id={props.profile ? props.providerId : props.match.params.id}
        toggleLeftPanel={props.toggleLeftPanel}
        togglePanel={props.togglePanel}
      />
      <Content>
        <Inside>
          <Overview>
            <Query
              query={getSkillsCommitments}
              variables={{
                token: localStorage.getItem("oce_token"),
                id: props.providerId
              }}
            >
              {({ loading, error, data, client, refetch }) => {
                if (loading) return <LoadingMini />
                if (error) return <ErrorMini refetch={refetch} message={`Error! ${error.message}`}/>
                let intents = data.viewer.person.commitmentsMatchingSkills
                let allIntents = intents
                .filter(int =>
                    int.provider ? int.provider.id === props.providerId : null
                );
                let activeIntents = allIntents.filter(i => !i.isFinished)
                let completed = allIntents.filter(i => i.isFinished)
                return (
                  <EventsInfo>
                    <WrapperIntents>
                      <HeaderTitle title={`Matched (${activeIntents.length})`} />
                      <ContentIntents>
                        {activeIntents.map((intent, i) => (
                          <Intent
                            handleAddEvent={props.handleAddEvent}
                            addEvent={props.addEvent}
                            toggleModal={props.toggleModal}
                            key={i}
                            client={client}
                            data={intent}
                            scopeId={props.id}
                            myId={props.providerId}
                            providerImage={props.providerImage}
                          />
                        ))}
                      </ContentIntents>
                    </WrapperIntents>
                    <WrapperIntents>
                      <HeaderTitle title={`Completed (${completed.length})`} />
                      <ContentIntents>
                        {completed.map((intent, i) => (
                          <Intent
                            handleAddEvent={props.handleAddEvent}
                            addEvent={props.addEvent}
                            toggleModal={props.toggleModal}
                            key={i}
                            client={client}
                            data={intent}
                            scopeId={props.id}
                            myId={props.providerId}
                            providerImage={props.providerImage}
                          />
                        ))}
                      </ContentIntents>
                    </WrapperIntents>
                  </EventsInfo>
                );
              }}
            </Query>
          </Overview>
        </Inside>
      </Content>
    </Wrapper>
    </Body>
  );
};

const WrapperIntents = styled.div`
  position: relative;
`;

const ContentIntents = styled.div`
  overflow-y: scroll;
  margin: 0;
  padding: 0;
  width: 100%;
`;
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  position: relative;
  flex: 1;
  ${media.lessThan("medium")`
    display: ${props => (props.isOpen ? "none" : "flex")}
  `};
`;

const Content = styled.div`
  contain: strict;
  flex: 1 1 auto;
  will-change: transform;
  display: flex;
  flex: 1;
`;

const Inside = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-content: center;
  position: relative;
  overflow-y: overlay;
  position: relative;
  margin-top: 16px;
`;

const Overview = styled.div`
  flex: 1;
  ${media.lessThan("medium")`
  width: 100%;
  margin-top: 16px;
  `};
`;

const EventsInfo = styled.div`
  display: grid;
  column-gap: 16px;
  padding: 16px;
  padding-top: 0;
`;
