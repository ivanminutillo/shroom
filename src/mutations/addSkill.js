import gql from "graphql-tag";

export default gql`
mutation ($token: String!, $agentId: Int!, $skillId: Int!) {
    createAgentResourceClassification(token: $token, agentId: $agentId, resourceClassificationId: $skillId) {
      agentResourceClassification {
        id
        agent {
          name
        }
        resourceClassification {
          name
          id
        }
        action
      }
    }
  }
`;


