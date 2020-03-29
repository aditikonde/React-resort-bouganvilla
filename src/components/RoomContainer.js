import React from "react";
import RoomFilter from "../components/RoomFilter";
import RoomList from "../components/RoomList";
import { withRoomConsumer } from "../context";
import Loading from "../components/Loading";

function RoomContaimer({ context }) {
  const { loading, sortedRooms, rooms } = context;
  if (loading) {
    return <Loading></Loading>;
  }
  return (
    <div>
      <RoomFilter rooms={rooms} />
      <RoomList rooms={sortedRooms} />
    </div>
  );
}

export default withRoomConsumer(RoomContaimer);

//Another way of using RoomConsumer

// import React from "react";
// import RoomFilter from "../components/RoomFilter";
// import RoomList from "../components/RoomList";
// import { RoomConsumer } from "../context";
// import Loading from "../components/Loading";

// export default function RoomContainer() {
//   return (
//     <RoomConsumer>
//       {value => {
//         console.log(value);
//         const { loading, sortedRooms, rooms } = value;
//         if (loading) {
//           return <Loading></Loading>;
//         }
//         return (
//           <div>
//             Hello from Room RoomContainer
//             <RoomFilter rooms={rooms} />
//             <RoomList rooms={sortedRooms} />
//           </div>
//         );
//       }}
//     </RoomConsumer>
//   );
// }
