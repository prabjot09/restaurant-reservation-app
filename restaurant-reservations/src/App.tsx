import React, { useState } from 'react';
import { Route, Routes } from "react-router-dom";
import { UserIF, Restaurant } from './component/models';

import { Entry } from './component/Entry';
import { UserHome } from './component/users/UserHome';
import { StaffBase } from './component/staff/StaffBase';
import { RestaurantCreate } from './component/create/RestaurantCreate';
import { getRestaurant } from './service/restaurantData';
import './App.css';
 
function App() {

  const [user, setUser] = useState<UserIF | null>(null);
  const [isStaff, setIsStaff] = useState<boolean>(false);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  window.addEventListener("load", async () => {
    await getRestaurant()
      .then((response) => {
        if (response[0] === true) {
          setRestaurant(response[1]);
        }
      });
    
    setIsLoaded(true);
  });

  return (
    <div className="App">
      <div className="p-4" id="appBase">
        <h1 >Restaurant Reservations App </h1>
      </div>
      <div id="routes">
        {isLoaded && (
          <Routes>

            <Route path="/" element={<Entry restaurantCreated={restaurant} />} />
            <Route path="/user//*" element={<UserHome user={user} setUser={setUser} restaurantName={restaurant ? restaurant.name: ''} />} />
            <Route path="/staff//*" element={<StaffBase isStaff={isStaff} setIsStaff={setIsStaff}/>} /> {
              /*
              <Route path="/login" element={<StaffLogin />} />
              <Route path="/create" element={<StaffCreate />} />
              <Route path="/overview" element={<RestaurantOverview />} />
              <Route path="/overview_table" element={<TableOverview />} />
              <Route path="/reservations" element={<ReservationsTable />} />
              */}
            <Route path="/restaurant_creation//*" element={<RestaurantCreate restaurant={restaurant} setRestaurant={setRestaurant} />} />
          </Routes>
          /*<Route path="/:id/reserve_new" element={<AddReservation />} />
            <Route path="/reserve_confirmation" element={<ConfirmReservation />} />
            <Route path="/reserve_all" element={<UserReservations />} /> } */
        )}
      </div>
    </div>
  );
}

export default App;
