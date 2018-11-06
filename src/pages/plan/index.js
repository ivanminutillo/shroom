import CytoscapeComponent from 'react-cytoscapejs';
import React from 'react'
const defaultStyle =  [
    {
      selector: 'node',
      style: {
        width: 20,
        height: 20,
        shape: 'rectangle'
      }
    },
    {
      selector: 'edge',
      style: {
        width: 15
      }
    }
  ]


export default (props) => {
    const elements = [
        { data: { id: 'one', label: 'Node 1' }, position: { x: 0, y: 0 } },
        { data: { id: 'two', label: 'Node 2' }, position: { x: 100, y: 0 } },
        { data: { source: 'one', target: 'two', label: 'Edge from Node1 to Node2' } }
     ];
    return (<CytoscapeComponent layout={{name: 'random'}} elements={elements} style={ { width: '600px', height: '600px' } } />)
}