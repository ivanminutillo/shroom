import gql from "graphql-tag";
import { event } from "../fragments/economicEvents";

const createCommitment = gql`
  mutation(
    $token: String!
    $inputOfId: Int
    $outputOfId: Int
    $committedUnitId: Int!
    $due: String!
    $start: String!
    $action: String!
    $planId: Int
    $note: String
    $committedNumericValue: String!
    $committedResourceClassifiedAsId: Int!
    $providerId: Int
    $scopeId: Int
  ) {
    createCommitment(
      token: $token
      inputOfId: $inputOfId
      outputOfId: $outputOfId
      committedUnitId: $committedUnitId
      due: $due
      plannedStart: $start
      action: $action
      note: $note
      committedResourceClassifiedAsId: $committedResourceClassifiedAsId
      planId: $planId
      scopeId: $scopeId
      committedNumericValue: $committedNumericValue
      providerId: $providerId
    ) {
      commitment {
        id
        isFinished
        fulfilledBy {
          fulfilledBy {
            ...BasicEvent
          }
        }
        provider {
          id
          image
          name
        }
        inputOf {
          id
          name
        }
        outputOf {
          id
          name
        }
        note
        action
        committedQuantity {
          numericValue
          unit {
            id
            name
          }
        }
        due
        resourceClassifiedAs {
          name
          id
        }
      }
    }
  }
  ${event}
`;

export default createCommitment;
