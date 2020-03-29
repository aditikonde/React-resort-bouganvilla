import React, { Component } from "react";
// import items from "./data";
import Client from "./Contentful";

const RoomContext = React.createContext();

class RoomProvider extends Component {
  state = {
    rooms: [],
    sortedRooms: [],
    featuredRooms: [],
    loading: true,
    type: "all",
    capacity: 1,
    minPrice: 0,
    maxPrice: 0,
    price: 0,
    minSize: 0,
    maxSize: 0,
    breakfast: false,
    pets: false
  };

  //getdata

  getData = async () => {
    try {
      let response = await Client.getEntries({
        content_type: "bouganVillaResortProject",
        order: "fields.price"
      });
      let rooms = this.formatData(response.items);
      console.log(rooms);
      let featuredRooms = rooms.filter(room => room.featured === true);

      let maxPrice = Math.max(...rooms.map(item => item.price));
      let minPrice = Math.min(...rooms.map(item => item.price));

      let maxSize = Math.max(...rooms.map(item => item.size));

      this.setState({
        rooms,
        featuredRooms,
        sortedRooms: rooms,
        loading: false,
        price: maxPrice,
        maxPrice,
        minPrice,
        maxSize
      });
    } catch (error) {
      console.log("m here in error");
      console.log(error);
    }
  };

  componentDidMount() {
    console.log("in componentDidMount");
    this.getData();
  }

  formatData(items) {
    let i = 0;

    let tempItems = items.map(item => {
      let id = item.sys.id;
      i = i + 1;
      let images = item.fields.images.map(image => {
        return image.fields.file.url;
      });

      let room = { ...item.fields, images, id };
      console.log(`${i} ---, ${room}`);
      return room;
    });

    return tempItems;
  }

  getRoom = slug => {
    let tempRooms = [...this.state.rooms];
    const room = tempRooms.find(room => room.slug === slug);
    return room;
  };

  handleChange = event => {
    const target = event.target;
    const name = event.target.name;
    const value = target.type === "checkbox" ? target.checked : target.value;
    this.setState(
      {
        [name]: value
      },
      this.filterRooms
    );
  };

  filterRooms = () => {
    let {
      rooms,
      type,
      price,
      capacity,
      minSize,
      maxSize,
      breakfast,
      pets
    } = this.state;

    //get al the rooms
    let tempRooms = [...rooms];
    //transform value
    capacity = parseInt(capacity);
    price = parseInt(price);

    //filter by type of room
    if (type !== "all") {
      tempRooms = tempRooms.filter(room => room.type === type);
    }
    //filter by capacity
    if (capacity !== 1) {
      tempRooms = tempRooms.filter(room => room.capacity >= capacity);
    }

    //filter by price
    tempRooms = tempRooms.filter(room => room.price <= price);

    // filter by roomsize
    tempRooms = tempRooms.filter(
      room => room.size >= minSize && room.size <= maxSize
    );

    //filter y breakfast
    if (breakfast) {
      tempRooms = tempRooms.filter(room => room.breakfast === true);
    }

    //filter by pets
    if (pets) {
      tempRooms = tempRooms.filter(room => room.pets === true);
    }

    this.setState({ sortedRooms: tempRooms });
  };

  render() {
    return (
      <RoomContext.Provider
        value={{
          ...this.state,
          getRoom: this.getRoom,
          handleChange: this.handleChange
        }}
      >
        {this.props.children}
      </RoomContext.Provider>
    );
  }
}

const RoomConsumer = RoomContext.Consumer;

export function withRoomConsumer(Component) {
  return function ConsumerWrapper(props) {
    return (
      <RoomConsumer>
        {value => <Component {...props} context={value} />}
      </RoomConsumer>
    );
  };
}
export { RoomProvider, RoomConsumer, RoomContext };
