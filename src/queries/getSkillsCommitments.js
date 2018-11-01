import gql from "graphql-tag";
import { event } from "../fragments/economicEvents";

export default gql`
  query($token: String, $id: Int) {
    viewer(token: $token) {
      person (id: $id) {
        id
        commitmentsMatchingSkills {
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
  }
  ${event}
`;
