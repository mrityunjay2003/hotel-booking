import { BiHotel, BiMoney, BiStar } from "react-icons/bi";
import { BsBuilding, BsMap } from "react-icons/bs";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import * as apiClient from "../api-client";

const MyHotels = () => {
  const { data: hotelData } = useQuery(
    "fetchMyHotels",
    apiClient.fetchMyHotels,
    {
      onError: () => {},
    }
  );

  if (!hotelData) {
    return <span>No Hotels found!</span>;
  }

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold mb-3 relative border-b-2 border-blue-600">
          My Hotels
          <div className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600"></div>
        </h1>
        <Link
          to="/add-hotel"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Add Hotel
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {hotelData.map((hotel) => (
          <div
            key={hotel._id}
            className="perspective-1000 mx-auto my-4 w-full max-w-xs"
          >
            <div className="relative bg-white rounded-3xl shadow-lg transition duration-500 transform hover:scale-105">
              <div className="absolute inset-0 rounded-3xl p-5 bg-white bg-opacity-50"></div>
              <div className="content p-5 relative z-10 text-gray-800">
                <img
                  src={hotel.imageUrls[0]}
                  alt="hotel-image"
                  className="h-1/2"
                />
                <span className="title text-xl font-bold block mb-2">
                  {hotel.name}
                </span>
                <span className="text block mb-4">{hotel.description}</span>
                <div className="grid grid-cols-1 gap-2">
                  <div className="border border-gray-300 rounded-md p-3 flex items-center">
                    <BsMap className="mr-1" />
                    {hotel.city}, {hotel.country}
                  </div>
                  <div className="border border-gray-300 rounded-md p-3 flex items-center">
                    <BsBuilding className="mr-1" />
                    {hotel.type}
                  </div>
                  <div className="border border-gray-300 rounded-md p-3 flex items-center">
                    <BiMoney className="mr-1" />₹ {hotel.pricePerNight} per
                    night
                  </div>
                  <div className="border border-gray-300 rounded-md p-3 flex items-center">
                    <BiHotel className="mr-1" />
                    {hotel.adultCount} adults, {hotel.childCount} children
                  </div>
                  <div className="border border-gray-300 rounded-md p-3 flex items-center">
                    <BiStar className="mr-1" />
                    {hotel.starRating} Star Rating
                  </div>
                </div>
              </div>
              <Link
                to={`/edit-hotel/${hotel._id}`}
                className=" relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mx-5 mb-5 z-10"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyHotels;
