import gql from "graphql-tag";

export default gql`
  query($token: String, $id: Int) {
    viewer(token: $token) {
      agent(id: $id) {
        id
        image
        name
        email
        note
        txs @client {
           note
           action
           provider {
             id
           }
           receiver {
             id
           }
        }
        agentEconomicEvents(latestNumberOfDays: 30) {
          note
          action
          provider {
            image
            name
            id
          }
          inputOf {
            name
          }
          receiver {
            name
          }
          start
          requestDistribution
          note
          affects {
            resourceClassifiedAs {
              name
              category
            }
            trackingIdentifier
          }
          affectedQuantity {
            numericValue
            unit {
              name
            }
          }
        }
      }
    }
  }
`;
