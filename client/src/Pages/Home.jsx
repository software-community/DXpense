import React from "react";
import TripCard from "../components/TripCard";
import CreateTrip from "../components/CreateTrip";

const Home = () => {
  const trips = [
    { id: "1", name: "Manali" },
    { id: "2", name: "Shimla" },
    { id: "3", name: "Kasauli" },
    { id: "4", name: "Amritsar" },
  ];
  return (
    <>
      <div className="trips-grid">
        {trips.map((trip) => (
          <TripCard trip={trip} key={trip.id} />
        ))}
      </div>
      <CreateTrip/>
    </>
  );
};

export default Home;
