// import React from "react";
// import styled from 'styled-components'
// import * as Gantt from "frappe-gantt";
// import moment from 'moment'
// require("frappe-gantt/dist/frappe-gantt.css");

// let tasks = [
//   {
//     id: "Task 1",
//     name: "Redesign website",
//     start: "2016-12-28",
//     end: "2016-12-31",
//     progress: 20,
//     dependencies: ""
//   },
//   {
//     id: "Task 2",
//     name: "Redesign website",
//     start: "2017-01-04",
//     end: "2017-01-11",
//     progress: 20,
//     dependencies: "Task 1"
//   },
//   {
//     id: "Task 3",
//     name: "Redesign website",
//     start: "2017-01-11",
//     end: "2017-01-13",
//     progress: 20,
//     dependencies: "Task 1, Task 2"
//   },

// ];

// class SomePlugin extends React.Component {
//     constructor(props) {
//         super(props);

//         this.state = {
//             tasks: this.props.tasks
//         };
//       }
//   componentDidMount() {
//     this.gantt = new Gantt.default(this.el, tasks, {});
//     }

// //   componentDidUpdate(prevProps, prevState) {
// //       let newTasks = this.props.tasks.map((t, i) => ({
// //         id: i,
// //         name: `${t.action} ${t.numericValue} ${t.unit.label} of ${t.affectedResourceClassifiedAsId.label}` ,
// //         start: moment(t.start).format("YYYY-MM-DD"),
// //         end: moment(t.end).format("YYYY-MM-DD"),
// //         progress: 100,
// //         dependencies: ""
// //     }))
// //   }

//   componentWillUnmount() {
//   }

//   render() {
//     console.log(this.state.tasks)
//     return (
//       <Wrapper>
//         <svg ref={el => (this.el = el)} />
//       </Wrapper>
//     );
//   }
// }


// const Wrapper = styled.div`
// margin: 10px;
// `

// export default SomePlugin
