import gql from "graphql-tag";
import { event } from "../fragments/economicEvents";

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
        action
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
            ...BasicEvent
          }
        }
        inputOf {
          id
        }
      }
    }
  }
  ${event}
`;

export default updateCommitment;
