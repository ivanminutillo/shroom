import gql from "graphql-tag";

export const event = gql`
  fragment BasicEvent on EconomicEvent {
    id
    action
    start
    affectedQuantity {
      numericValue
      unit {
        id
        name
      }
    }
    note
    provider {
        id
        image
        name
      }
      affects {
        resourceClassifiedAs {
          name
          id
        }
        trackingIdentifier
    }
  }
`;
