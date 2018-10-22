import gql from "graphql-tag";
import { event } from "../fragments/economicEvents";

export default gql`
  query($token: String, $id: Int) {
    viewer(token: $token) {
      agent(id: $id) {
        id
        agentEconomicEvents(latestNumberOfDays: 30) {
          ...BasicEvent
          inputOf {
            name
            id
          }
          scope {
            id
          }
          fulfills {
            fulfills {
              id
            }
          }
          start
          isValidated
          validations {
            id
          }
          requestDistribution
        }
      }
    }
  }
  ${event}
`;