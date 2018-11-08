import gql from "graphql-tag";

export default gql`
  mutation($token: String!, $due: String!, $start: String!, $name: String!, $scope: Int!, $note: String) {
    createProcess(token: $token,plannedStart: $start, plannedFinish: $due, name: $name, scopeId: $scope, note: $note) {
      process {
        id
        name
        note
        scope {
          id
          name
        }
      }
    }
  }
`;
