import gql from "graphql-tag";

export default gql`
  mutation(
    $token: String!
    $providerId: Int
    $receiverId: Int
    $action: String!
    $start: String
    $scopeId: Int!
    $note: String
    $affectedNumericValue: String!
    $affectedUnitId: Int!
    $affectedResourceClassifiedAsId: Int
  ) {
    createEconomicEvent(
      token: $token
      action: $action
      start: $start
      providerId: $providerId
      receiverId: $receiverId
      scopeId: $scopeId
      note: $note
      affectedNumericValue: $affectedNumericValue
      affectedUnitId: $affectedUnitId
      affectedResourceClassifiedAsId: $affectedResourceClassifiedAsId
    ) {
      economicEvent {
        action
        requestDistribution
        start
        id
        note
        url
        provider {
          name
          image
          id
        }
        scope {
          id
        }
        affects {
          trackingIdentifier
          resourceClassifiedAs {
            name
            id
          }
          note
        }
        affectedQuantity {
          numericValue
          unit {
            id
            name
          }
        }
      }
    }
  }
`;
