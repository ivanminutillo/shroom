import gql from "graphql-tag";
import { event } from "../fragments/economicEvents";

export default gql`
  query($token: String, $id: Int) {
    viewer(token: $token) {
      agent(id: $id) {
        id
        name
        image
        commitmentsMatchingSkills {
          id
          isDeletable
          isFinished
          scope {
            id
            name
          }
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
        agentCommitments(latestNumberOfDays: 30) {
          id
          isDeletable
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
          scope {
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
  }
  ${event}
`;
