import React from "react";
import styled from "styled-components";
import getReources from "../../queries/getInventory";
import { LoadingMini, ErrorMini } from "../../components/loading/index.tsx";
import { Query } from "react-apollo";
// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";


const columns = [
    {
      Header: "Name",
      columns: [
        {
          Header: "Id",
          accessor: "id"
        },
        {
          Header: "Name",
          id: "name",
          accessor: d => d.name
        }
      ]
    },
    {
      Header: "Current Quantity",
      columns: [
        {
          Header: "Quantity",
          accessor: "quantity"
        },
        {
          Header: "Unit",
          accessor: "unit"
        }
      ]
    },
    {
      Header: "Category",
      columns: [
        {
          Header: "Taxonomy",
          accessor: "taxonomy"
        },
        {
            Header: "Process Category",
            accessor: "processCategory"
        }
      ]
    }
  ];


const Inventory = props => {
    return (
  <Query
    query={getReources}
    variables={{
      token: localStorage.getItem("oce_token"),
      id: Number(props.providerId)
    }}
  >
    {({ loading, error, data, refetch, client }) => {
      if (loading) return <LoadingMini />;
      if (error)
        return (
          <ErrorMini refetch={refetch} message={`Error! ${error.message}`} />
        );
      var datat = data.viewer.agent.ownedEconomicResources.map(r => ({
          id: r.id,
          name: r.resourceClassifiedAs.name,
          quantity: r.currentQuantity.numericValue,
          unit: r.currentQuantity.unit.name,
          taxonomy: r.resourceClassifiedAs.category,
          processCategory: r.resourceClassifiedAs.processCategory
      }))
      console.log(data)
      return (
        <Body>
          <ReactTable
          data={datat}
          filterable
          defaultFilterMethod={(filter, row) =>
            String(row[filter.id]) === filter.value}
          columns={columns}
          defaultPageSize={10}
          className="-striped -highlight"
          style={{flex: 1}}
        />
        </Body>
      );
    }}
  </Query>
)};

const Body = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  margin: 8px;
  background: #fff;
`;

export default Inventory;
