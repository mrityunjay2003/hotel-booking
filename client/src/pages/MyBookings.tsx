import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import * as apiClient from "../api-client";

const MyBookings = () => {
  const { data: hotels, isLoading } = useQuery(
    "fetchMyBookings",
    apiClient.fetchMyBookings
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!hotels || hotels.length === 0) {
    return (
      <div className="text-center py-16 space-y-4">
        <h2 className="text-2xl font-bold text-gray-700">You don't have any Bookings yet.</h2>
        <p className="text-gray-500">Ready to plan your next adventure?</p>
        <Link to="/search" className="btn btn-primary">
          Explore Destinations
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Bookings</h1>
      {hotels.map((hotel) => {
        const displayImage =
          hotel.imageUrls && hotel.imageUrls.length > 0
            ? hotel.imageUrls[0]
            : "/pexels-pixabay-258154.jpg";

        return (
          <div
            key={hotel._id}
            className="grid grid-cols-1 lg:grid-cols-[1fr_3fr] border border-slate-300 rounded-lg p-6 gap-6 shadow-sm bg-white"
          >
            <div className="lg:w-full h-[220px]">
              <img
                src={displayImage}
                alt={hotel.name}
                className="w-full h-full object-cover object-center rounded-md"
              />
            </div>
            <div className="flex flex-col gap-4 overflow-y-auto max-h-[300px]">
              <div className="text-2xl font-bold">
                {hotel.name}
                <div className="text-sm font-normal text-gray-600">
                  {hotel.city}, {hotel.country}
                </div>
              </div>
              {hotel.bookings.map((booking) => (
                <div
                  key={booking._id}
                  className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-1"
                >
                  <div>
                    <span className="font-bold mr-2 text-gray-700">Dates:</span>
                    <span>
                      {new Date(booking.checkIn).toDateString()} -{" "}
                      {new Date(booking.checkOut).toDateString()}
                    </span>
                  </div>
                  <div>
                    <span className="font-bold mr-2 text-gray-700">Guests:</span>
                    <span>
                      {booking.adultCount} adult{booking.adultCount > 1 ? "s" : ""}, {booking.childCount} child{booking.childCount !== 1 ? "ren" : ""}
                    </span>
                  </div>
                  {booking.totalCost && (
                    <div>
                      <span className="font-bold mr-2 text-gray-700">Total Paid:</span>
                      <span className="font-semibold text-green-700">₹{booking.totalCost}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MyBookings;
