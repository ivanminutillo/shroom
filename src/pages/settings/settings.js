import React from "react";
import styled from "styled-components";
import { clearFix } from "polished";
import { Icons } from "oce-components";
import EditSkills from '../../components/skillsModal/skill'
import EditInfo from './info'
import { compose, withState, withHandlers } from "recompose";

export default compose(
    withState('skills', 'onSkills', false),
    withState('info', 'onInfo', false),
    withHandlers({
        toggleSkills: props => () => (
            props.onSkills(!props.skills)
        ),
        toggleInfo: props => () => (
            props.onInfo(!props.info)
        )
    })
)(({toggleSkills, toggleInfo,providerId, info, skills}) => (
  <div style={{ padding: "16px", paddingBottom: 0, position: 'relative' }}>
    <Title>Settings</Title>
    <Wrapper>
      <List>
        <Item onClick={toggleInfo}>
          <Span>
            <Icons.User width="24" height="24" color="#8D8D8D" />
          </Span>
          <ItemTitle>General information</ItemTitle>
        </Item>
        {/* <Item>
          <Span>
            <Icons.Settings width="24" height="24" color="#8D8D8D" />
          </Span>
          <ItemTitle>Notifications</ItemTitle>
        </Item> */}
        <Item onClick={toggleSkills}>
          <Span>
            <Icons.User width="24" height="24" color="#8D8D8D" />
          </Span>
          <ItemTitle>Edit Skills</ItemTitle>
        </Item>
      </List>
    </Wrapper>
    { skills ? <EditSkills providerId={providerId} toggleSkills={toggleSkills} /> : null}
    { info ? <EditInfo toggleInfo={toggleInfo} /> : null}
  </div>
));

const List = styled.div``;

const Item = styled.div`
  ${clearFix()};
  background: #e5e5e5;
  border-radius: 4px;
  margin-bottom: 8px;
  height: 45px;
  line-height: 45px;
  padding: 0 16px;
  cursor: pointer;
  &:hover {
    background:  ${props => props.theme.color.p150};
  }
`;
const Span = styled.div`
   display: inline-block
    margin-right: 16px;
    vertical-align: sub;
`;
const ItemTitle = styled.h3`
 display: inline-block
  color: ${props => props.theme.color.p900};
  line-height: 45px;
`;

const Wrapper = styled.div`
  ${clearFix()};
  margin-bottom: 16px;
  position: relative;
  z-index: 999999;
`;

const Title = styled.h3`
  color: ${props => props.theme.color.p900};
  letter-spacing: 0.5px;
  margin-bottom: 16px;
`;
