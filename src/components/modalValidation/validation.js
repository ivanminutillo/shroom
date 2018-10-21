import React from "react";
import { Button, Icons } from "oce-components/build";
import moment from "moment";
import styled from "styled-components";
import { Query } from "react-apollo";
import { LoadingMini, ErrorMini } from "../loading";
import GetEvent from "../../queries/getEvent";
import { NavLink } from "react-router-dom";
import { clearFix, placeholder } from "polished";

export default ({
  contributionId,
  createValidation,
  deleteValidation,
  myId,
  note
}) => {
  return (
    <Query
      query={GetEvent}
      variables={{
        token: localStorage.getItem("oce_token"),
        id: Number(contributionId)
      }}
    >
      {({ loading, error, data, refetch }) => {
        if (loading) return <LoadingMini />;
        if (error)
          return (
            <ErrorMini refetch={refetch} message={`Error! ${error.message}`} />
          );
        return (
          <div
            style={{ padding: "16px", paddingBottom: 0, marginBottom: "-20px" }}
          >
            <Title>Validate a contribution</Title>
            <Sentence>
              <Photo
                style={{
                  backgroundImage: `url(${
                    data.viewer.economicEvent.provider.image
                  })`
                }}
              />
              <SentenceInfo>
                <SentenceText>
                  <NavLink
                    to={`/agent/${data.viewer.economicEvent.provider.id}`}
                  >
                    {data.viewer.economicEvent.provider.name}
                  </NavLink>{" "}
                  {data.viewer.economicEvent.action}{" "}
                  <b>
                    {data.viewer.economicEvent.affectedQuantity.numericValue +
                      " " +
                      data.viewer.economicEvent.affectedQuantity.unit.name}
                  </b>{" "}
                  {data.viewer.economicEvent.inputOf ? 
                  `${<i>of</i>}  ${data.viewer.economicEvent.inputOf.name}`
                  : null}
                  
                </SentenceText>
                <Note>{data.viewer.economicEvent.note}</Note>
                <Secondary>
                  <Date>
                    {moment(data.viewer.economicEvent.start).format("DD MMM")}
                  </Date>
                  { data.viewer.economicEvent.inputOf && data.viewer.economicEvent.inputOf.processPlan ? (
                    <Plan>
                      <NavLink
                        to={`/plan/${
                           data.viewer.economicEvent.inputOf.processPlan.id
                        }`}
                      >
                        { data.viewer.economicEvent.inputOf.processPlan.name}
                      </NavLink>
                    </Plan>
                  ) : null}
                </Secondary>
              </SentenceInfo>
            </Sentence>

            <Validations>
              {data.viewer.economicEvent.validations.map((val, i) => {
                return (
                  <ValidationsItem key={i}>
                    <ValMain>
                      <span style={{ float: "left" }}>
                        <Icons.Check width="18" height="18" color="#36B37E" />
                      </span>
                      <ValMainName>
                        {val.validatedBy.name} validated
                      </ValMainName>
                    </ValMain>
                    <ValMainNote>{val.note}</ValMainNote>
                    {Number(val.validatedBy.id) === Number(myId) ? (
                      <Button
                        onClick={() =>
                          deleteValidation(data.viewer.economicEvent.id, val.id)
                        }
                      >
                        <span>
                          <Icons.Trash width="18" height="18" color="#f0f0f0" />
                        </span>
                        Delete validation
                      </Button>
                    ) : null}
                  </ValidationsItem>
                );
              })}
            </Validations>
            {data.viewer.economicEvent.validations.findIndex(
              item => Number(item.validatedBy.id) === Number(myId)
            ) !== -1 ? null : data.viewer.economicEvent.validations.length >=
            2 ? null : data.viewer.economicEvent.provider.id === myId ? null : (
              <div>
                <div
                  style={{
                    height: "100px",
                    marginTop: "0px",
                    marginBottom: "0px",
                    marginLeft: "-16px",
                    marginRight: "-16px"
                  }}
                >
                  {note}
                </div>

                <Footer>
                  <Button
                    style={{ float: "right", borderRadius: 0 }}
                    onClick={() =>
                      createValidation(data.viewer.economicEvent.id)
                    }
                  >
                    Validate
                  </Button>
                </Footer>
              </div>
            )}
          </div>
        );
      }}
    </Query>
  );
};

const Title = styled.h3`
  color: ${props => props.theme.color.p900};
  letter-spacing: 0.5px;
  margin-bottom: 16px;
`;

const Sentence = styled.div`
  ${clearFix()};
`;

const Photo = styled.div`
  float: left;
  width: 35px;
  height: 35px;
  border-radius: 3px;
  background: ${props => props.theme.color.p900};
  display: block;
  background-size: cover;
`;

const SentenceText = styled.div`
  font-size: 16px;
  font-weight: 400;
  color: ${props => props.theme.color.p900};
  letter-spacing: 0.5px;
  a {
    font-weight: 500;
    color: ${props => props.theme.color.p900};
  }
`;
const SentenceInfo = styled.div`
  float: left;
  margin-left: 8px;
`;
const Secondary = styled.div`
${clearFix()};
margin-top: 8px;
`;

const Date = styled.div`
  float: left;
  font-size: 13px;
  color: #73808f;
  line-height: 21px;
  font-weight: 300;
`;

const Note = styled.div`
  color: ${props => props.theme.color.p800};
  margin-top: 5px;
  font-size: 14px;
  letter-spacing: 0.5px;
`;

const Plan = styled.div`
float:left;
margin-left: 8px;
  font-weight: 500;
  letter-spacing: 0.5px;
  text-decoration: none;
  display: inline-block;
  a {
    font-size: 12px;
    color: ${props => props.theme.color.b100};
  }
`;

const Validations = styled.div`
  margin-top: 24px;
  background: #ebebeb;
  margin-left: -16px;
  margin-right: -16px;
`;

const ValidationsItem = styled.div`
  border-top: 1px solid #dedede;
  padding: 16px;
`;

const ValMain = styled.div`
  ${clearFix()};
`;
const ValMainName = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.theme.color.p900};
  margin-left: 8px;
  letter-spacing: 0.5px;
  float: left;
`;

const ValMainNote = styled.div`
  font-weight: 300;
  font-style: italic;
  font-size: 14px;
  margin-top: 4px;
  color: ${props => props.theme.color.p900};
  max-width: 480px;
`;

const Footer = styled.div`
  background: #e5e5e5;
  margin-right: -16px;
  lost-utility: clearfix;
`;
