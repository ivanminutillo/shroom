import gql from "graphql-tag";

export const defaults = {
  notifications: [],
  agentPanel: "feed",
  plans: "active",
  inbox: null,
  committed: null,
  matched: null,
  txs: [
    {
      id: "3938483834",
      note: "",
      action: "transfer",
      provider: {
        id: "12111",
        __typename: "Person"
      },
      receiver: {
        id: "1311111",
        __typename: "Person"
      },
      affects: {
        __typename: "EconomicResource",
        resourceClassifiedAs: {
          id: '3939393',
          name: 'fakecoin',
          __typename: "ResourceClassification"
        }
      },
      affectedQuantity: {
        __typename: "QuantityValue",
        numericValue: '10',
        unit: {
          __typename: "Unit",
          name: 'Fakecoin'
        }
      },
      start: "01-01-1998",
      __typename: "EconomicEvent"
    }
  ]
};

let nextNotifId = 0;

export const resolvers = {
  Mutation: {
    setInbox:(_, {total}, {cache}) => {
      const query = gql`
        query getInbox {
          inbox @client
        }
      `
      const newinbox = {
        inbox: total
      };
      cache.writeQuery({query, data: newinbox})
    },
    setCommitted:(_, {total}, {cache}) => {
      const query = gql`
        query getCommitted {
          committed @client
        }
      `
      const newTotal = {
        committed: total
      };
      cache.writeQuery({query, data: newTotal})
    },
    setMatched:(_, {total}, {cache}) => {
      const query = gql`
        query getMatched {
          matched @client
        }
      `
      const newTotal = {
        matched: total
      };
      cache.writeQuery({query, data: newTotal})
    },
    addNotification: (_, { message, type }, { cache }) => {
      let newId = nextNotifId++;
      const query = gql`
        query GetNotifications {
          notifications @client {
            __typename
            id
            message
            type
          }
        }
      `;
      const previousState = cache.readQuery({ query });
      const newNotif = {
        id: newId,
        message,
        type,
        __typename: "Notification"
      };
      const data = {
        notifications: previousState.notifications.concat([newNotif])
      };
      cache.writeQuery({ query, data: data });
      return newNotif;
    },
    deleteNotification: (_, { id }, { cache }) => {
      const query = gql`
        query GetNotifications {
          notifications @client {
            __typename
            id
            message
            type
          }
        }
      `;
      const previousState = cache.readQuery({ query });
      const data = {
        notifications: previousState.notifications.filter(
          item => item.id !== id
        )
      };
      cache.writeQuery({ query, data });
      return data;
    },
    addTxsList: (_, { id, amount, from, to, date, tags }, { cache }) => {
      const query = gql`
       query GetTxs {
         txs @client {
           __typename
           id
           amount
           currency
           from-id
           to-id
           tags {
             name
           }
           timestamp
         }
       }
      `;
      return null;
    },
    setAgentPanel: (_, { type }, { cache }) => {
      const query = gql`
        query getAgentPanel {
          agentPanel @client
        }
      `;
      const newAgentPanel = {
        agentPanel: type
      };
      cache.writeQuery({ query, data: newAgentPanel });
      return type;
    }
  }
};
