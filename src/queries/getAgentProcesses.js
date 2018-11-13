import gql from "graphql-tag";

export default gql`
  query($token: String, $id: Int) {
    viewer(token: $token) {
      agent(id: $id) {
        id
        agentProcesses {
          id
          name
          scope {
              id
              name
          }
          isFinished
          note
          plannedStart
          plannedFinish
          processPlan {
            id
            name
          }
          committedInputs {
            note
            id
            action
            plannedStart
            due
            resourceClassifiedAs {
              name
              id
            }
            committedQuantity {
              unit {
                id
                name
              }
              numericValue
            }
          }

          committedOutputs {
            note
            id
            plannedStart
            action
            provider {
              id
              name
              image
            }
            due
            resourceClassifiedAs {
              name
              id
            }
            committedQuantity {
              unit {
                id
                name
              }
              numericValue
            }
          }
        }
      }
    }
  }
`;
