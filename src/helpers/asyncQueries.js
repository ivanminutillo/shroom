import gql from "graphql-tag";
  import {getRerourcesByAction} from "../queries/getResources";
  const agentRelationships = gql`
  query($token: String) {
    viewer(token: $token) {
      myAgent {
        id
        agentRelationships {
          object {
            id
            name
          }
        }
      }
    }
  }
`;

  export const getResourcesByAction = (client, action, val) => {
    return client
      .query({
        query: getRerourcesByAction,
        variables: { 
            token: localStorage.getItem("oce_token"),
            action: action.toUpperCase()
        }
      })
      .then(res => {
        let options = res.data.viewer.resourceClassificationsByAction.map(
          resource => ({
            value: resource.id,
            label: resource.name
          })
        );
        let newOpt = options.filter(i =>
          i.label.toLowerCase().includes(val.toLowerCase())
        );
        return newOpt;
      });
  };


  export const getRelationships = (client, val) => {
    return client
      .query({
        query: agentRelationships,
        variables: {
          token: localStorage.getItem("oce_token")
        }
      })
      .then(res => {
        let options = res.data.viewer.myAgent.agentRelationships
          .map(plan => ({
            value: plan.object.id,
            label: plan.object.name
          }))
          .filter(i => i.label.toLowerCase().includes(val.toLowerCase()));
        return options;
      });
  };