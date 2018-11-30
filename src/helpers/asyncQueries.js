import gql from "graphql-tag";
import getResourcesQuery, {
  getRerourcesByAction
} from "../queries/getResources";

import getResourcesByContext, {getResourcesByContextByAction} from '../queries/getResourcesByContext'
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

export const getResourcesByAction = (client, action, id, val) => {
  return client
    .query({
      query: getResourcesByContextByAction,
      variables: {
        token: localStorage.getItem("oce_token"),
        action: action.toLowerCase(),
        id: id
      }
    })
    .then(res => {
      let options = res.data.viewer.agent.agentDefinedResourceClassifications.map(
        resource => {
          return (
            {
              value: {
                value: resource.id,
                unitId: resource.unit ? resource.unit.id : 2,
                unitName: resource.unit ? resource.unit.name : 'hour'
              },
              label: resource.name
            }
          )}
      );
      let newOpt = options.filter(i =>
        i.label.toLowerCase().includes(val.toLowerCase())
      );
      return newOpt;
    });
};

export const getAllResources = (client,id, val) => {
  return client
    .query({
      query: getResourcesByContext,
      variables: { token: localStorage.getItem("oce_token"), id: id}
    })
    .then(res => {
      let options = res.data.viewer.agent.agentDefinedResourceClassifications.map(
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
