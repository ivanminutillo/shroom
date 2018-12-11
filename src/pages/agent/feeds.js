import React from "react";
import styled from "styled-components";
import moment from "moment";
import Feed from "../../components/FeedItem/index.tsx";
import { LoadingMini, ErrorMini } from "../../components/loading/index.tsx";
import getFeed from "../../queries/getFeed";
import { Query } from "react-apollo";

const FeedItem = styled.div`
  font-size: ${props => props.theme.fontSize.h3};
  color: #f0f0f0bd;
`;

const B = styled.b`
  text-decoration: underline;
  font-weight: 500;
  color: ${props => props.theme.color.p100};
`;

const FeedList = styled.div`
  padding: 8px;
  margin: 16px;
  background: #333d47;
  margin-top: 0;
  margin-bottom: 0;
`;

export default ({ id, openValidationModal, providerId }) => (
  <Query
    query={getFeed}
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
        <FeedList>
          {data.viewer.agent.agentEconomicEvents.map((ev, i) => (
            <Feed
              scopeId={data.viewer.agent.id}
              image={ev.provider.image}
              commitmentId={ev.fulfills.length > 0 ? ev.fulfills.map(f => f.fulfills.id)[0] : null}
              key={i}
              id={ev.id}
              loggedUserId={providerId}
              providerId={ev.provider.id}
              withValidation
              withDelete
              validations={ev.validations}
              openValidationModal={openValidationModal}
              primary={
                <FeedItem>
                  <B>{ev.provider.name}</B>{" "}
                  {ev.action +
                    " " +
                    ev.affectedQuantity.numericValue +
                    " " +
                    ev.affectedQuantity.unit.name +
                    " of "}
                  <i>{ev.affects.resourceClassifiedAs.name}</i>
                </FeedItem>
              }
              secondary={ev.note}
              date={moment(ev.start).format("DD MMM")}
            />
          ))}
        </FeedList>
      );
    }}
  </Query>
);
