import { BiHotel, BiMoney, BiStar } from "react-icons/bi";
import { BsBuilding, BsMap } from "react-icons/bs";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import * as apiClient from "../api-client";

const MyHotels = () => {
  const { data: hotelData, isLoading } = useQuery(
    "fetchMyHotels",
    apiClient.fetchMyHotels
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!hotelData || hotelData.length === 0) {
    return (
      <div className="text-center py-16 space-y-4">
        <h2 className="text-2xl font-bold text-gray-700">No Hotels Found!</h2>
        <p className="text-gray-500">You haven't listed any hotels yet.</p>
        <Link to="/add-hotel" className="btn btn-primary">
          Add Your First Hotel
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between mb-6 items-center">
        <h1 className="text-3xl font-bold border-b-2 border-blue-600 pb-2">
          My Hotels
        </h1>
        <Link
          to="/add-hotel"
          className="btn btn-primary"
        >
          Add Hotel
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {hotelData.map((hotel) => {
          const displayImage =
            hotel.imageUrls && hotel.imageUrls.length > 0
              ? hotel.imageUrls[0]
              : "/pexels-pixabay-258154.jpg";

          return (
            <div
              key={hotel._id}
              className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200 flex flex-col justify-between transition duration-300 hover:shadow-xl"
            >
              <div>
                <img
                  src={displayImage}
                  alt={hotel.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 space-y-3">
                  <h2 className="text-xl font-bold text-gray-800 line-clamp-1">
                    {hotel.name}
                  </h2>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {hotel.description}
                  </p>
                  <div className="space-y-1 text-sm text-gray-700">
                    <div className="flex items-center">
                      <BsMap className="mr-2 text-blue-600" />
                      {hotel.city}, {hotel.country}
                    </div>
                    <div className="flex items-center">
                      <BsBuilding className="mr-2 text-blue-600" />
                      {hotel.type}
                    </div>
                    <div className="flex items-center">
                      <BiMoney className="mr-2 text-blue-600" />₹
                      {hotel.pricePerNight} per night
                    </div>
                    <div className="flex items-center">
                      <BiHotel className="mr-2 text-blue-600" />
                      {hotel.adultCount} adults, {hotel.childCount} children
                    </div>
                    <div className="flex items-center">
                      <BiStar className="mr-2 text-yellow-500" />
                      {hotel.starRating} Star Rating
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 pt-0">
                <Link
                  to={`/edit-hotel/${hotel._id}`}
                  className="btn btn-outline btn-primary btn-block"
                >
                  Edit / View Details
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyHotels;
