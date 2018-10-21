import gql from "graphql-tag";

const updateCommitment = gql`
  mutation(
    $token: String!
    $id: Int!
    $providerId: Int
    $note: String
    $due: String
    $committedResourceClassifiedAsId: Int
    $committedUnitId: Int
    $committedNumericValue: String
    $action: String
    $isFinished: Boolean
  ) {
    updateCommitment(
      token: $token
      note: $note
      id: $id
      due: $due
      providerId: $providerId
      isFinished: $isFinished
      action: $action
      committedResourceClassifiedAsId: $committedResourceClassifiedAsId
      committedUnitId: $committedUnitId
      committedNumericValue: $committedNumericValue
    ) {
      commitment {
        id
        note
        isFinished
        due
        provider {
          id
          name
        }
        involvedAgents {
          id
          name
          image
        }
        committedQuantity {
          unit {
            id
            name
          }
          numericValue
        }
        resourceClassifiedAs {
          category
          name
          id
        }
        fulfilledBy {
          fulfilledBy {
            action
            start
            id
            requestDistribution
            note
            provider {
              id
              name
              image
            }
          }
        }
        inputOf {
          id
        }
      }
    }
  }
`;

export default updateCommitment;
