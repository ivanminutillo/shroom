import React from "react";
import s from "styled-components";
import { NavLink } from "react-router-dom";
import { clearFix, ellipsis } from "polished";
import Icons from "../../atoms/icons";
import { compose, withState, withHandlers } from "recompose";
import OutsideClickHandler from "react-outside-click-handler";
import SkillsModal from "../../components/skillsModal";
import InfoModal from "../../components/infoModal";

export default compose(
  withState("isOpen", "handleMenu", false),
  withState("skills", "onSkills", false),
  withState("info", "onInfo", false),
  withHandlers({
    toggleMenu: props => () => {
      props.handleMenu(!props.isOpen);
    },
    toggleSkills: props => () => {
      props.handleMenu(false);
      props.onSkills(!props.skills)},
    toggleInfo: props => () => {
      props.handleMenu(false);
      props.onInfo(!props.info)
    },
    logout: props => event => {
      localStorage.removeItem("oce_token");
      window.location.reload();
    }
  })
)(
  ({
    history,
    isOpen,
    skills,
    info,
    toggleMenu,
    toggleSkills,
    toggleInfo,
    agents,
    providerImage,
    providerId,
    logout
  }) => (
    <React.Fragment>
      <HeaderWrapper>
        <Content>
          <LeftHeader>
            <Navigation>
              <button onClick={() => history.goBack()}>
                <Icons.Left width="18" height="18" color="#f0f0f0" />
              </button>
              <button onClick={() => history.goForward()}>
                <Icons.ArrowRight width="18" height="18" color="#f0f0f0" />
              </button>
            </Navigation>
          </LeftHeader>
          <Title>
            <NavLink to={'/'}><span role='img' aria-label='shroom'>🍄</span></NavLink>
          </Title>
          <WrapperNew>
            <Img
              onClick={toggleMenu}
              style={{ backgroundImage: `url(${providerImage})` }}
            />
            {isOpen ? (
              <OutsideClickHandler onOutsideClick={toggleMenu}>
                <Menu>
                  <List>
                    {agents.map((a, i) => (
                      <React.Fragment key={i}>
                        <NavLink
                          isActive={(match, location) => {
                            return (
                              location.pathname === `/agent/${a.object.id}/` ||
                              location.pathname === `/agent/${a.object.id}`
                            );
                          }}
                          activeStyle={{
                            background: "#ced7f6"
                          }}
                          to={"/agent/" + a.object.id}
                        >
                          <Item>{a.object.name}</Item>
                        </NavLink>
                      </React.Fragment>
                    ))}
                  </List>
                  <List>
                    <Item onClick={toggleInfo}>Edit profile</Item>
                    <Item onClick={toggleSkills}>Edit skills</Item>
                    <Item onClick={logout}>Logout</Item>
                  </List>
                </Menu>
              </OutsideClickHandler>
            ) : null}
          </WrapperNew>
        </Content>
      </HeaderWrapper>
      <SkillsModal
        toggleModal={toggleSkills}
        modalIsOpen={skills}
        providerId={providerId}
      />
      <InfoModal toggleModal={toggleInfo} modalIsOpen={info} />
    </React.Fragment>
  )
);

const Menu = s.div`
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 10px 15px 0 rgba(0,0,0,0.06);
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  position: absolute;
  top: 40px;
  right: 0px;
  border: 1px solid #d5dce0;
  width: 220px;
`;
const List = s.div`
padding: 5px 0;
border-bottom: 1px solid #e0e6e8;
& a {
  display: block;
  text-decoration: none;
}
&:last-of-type {
  border-bottom: 0px;
}
`;
const Item = s.div`
  color: ${props => props.theme.color.p900};
  padding: 0 10px;
  line-height: 36px;
  font-size: 14px;
  ${ellipsis("220px")};
  display: block;
  text-decoration: none;
  &:hover {
    background: #d6eaff;
  }

`;

const LeftHeader = s.div`
  ${clearFix()};
  width: 61px;
`;

const Img = s.div`
width: 28px;
height: 28px;
line-height: 32px;
max-width: 28px;
max-height: 28px;
border-radius: 100px;
background-color: #aac6e3;
background-size: cover;

`;

const Title = s.div`
margin-top: 4px;
text-align: center;
flex: 1;
a {
  text-decoration: none;
    width: 28px;
    height: 28px;
    border: 1px dashed #dadada;
    border-radius: 150px;
    background: rgba(240,240,240,.2);
    display: inline-block;
    &:hover {
      background: rgba(250,250,250,.3);
    }
}
& span {
  font-size: 16px;
  padding-left: 5px;
}
`;

const Navigation = s.div`
  vertical-align: middle;
  margin-top: 5px;
  & button {
    width: 30px;
    border: none;
    box-sizing: border-box;
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
const WrapperNew = s.div`
  cursor: pointer;
  margin-top: 4px;
  box-sizing: border-box;
  position: relative;
  z-index: 99999;
  width: 30px;
`;

const Content = s.div`
max-width: 1010px;
margin: 0 auto;
margin-top: 4px;
display: flex;
`;

const HeaderWrapper = s.div`
  height: 46px;
  ${clearFix()}
  // background: #fff;
  // border-bottom: 1px solid #d2d2d2;
  background: #096db0;
  border-bottom: 1px solid #063858;
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  z-index: 999999;;
  `;
