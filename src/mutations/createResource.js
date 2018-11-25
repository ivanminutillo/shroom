import gql from "graphql-tag";

export default gql`
  mutation(
    $token: String!
    $providerId: Int
    $receiverId: Int
    $action: String!
    $start: String
    $scopeId: Int!
    $inputOfId: Int
    $outputOfId: Int
    $note: String
    $commitmentId: Int
    $affectedNumericValue: String!
    $affectedUnitId: Int!
    $affectedResourceClassifiedAsId: Int
  ) {
    createEconomicEvent(
      token: $token
      action: $action
      start: $start
      fulfillsCommitmentId: $commitmentId
      inputOfId: $inputOfId
      outputOfId: $outputOfId
      providerId: $providerId
      receiverId: $receiverId
      scopeId: $scopeId
      note: $note
      createResource: true
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
        fulfills {
          fulfills {
            id
          }
        }
        url
        provider {
          id
        }
        scope {
          id
        }
        inputOf {
          id
          name
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
