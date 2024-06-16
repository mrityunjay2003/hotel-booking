import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import * as apiClient from "../api-client";
import { BsBuilding, BsMap } from "react-icons/bs";
import { BiHotel, BiMoney, BiStar } from "react-icons/bi";
import "./Card.css";

const MyHotels = () => {
  const { data: hotelData } = useQuery("fetchMyHotels", apiClient.fetchMyHotels, {
    onError: () => {},
  });

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
        <button className="btn btn-outline btn-primary mr-2">
          <Link to="/add-hotel">Add Hotel</Link>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {hotelData.map((hotel) => (
          <div key={hotel._id} className="parent perspective-1000 mx-auto my-4 w-full max-w-xs">
            <div className="card h-full rounded-3xl gradient-bg transition-all duration-500 ease-in-out transform-style-preserve shadow-lg">
              <div className="relative">
                <span className="circle circle1 absolute w-44 h-44 rounded-full top-2 right-2 circle-bg backdrop-blur transition-all duration-500 ease-in-out transform translate-z-20"></span>
                <span className="circle circle2 absolute w-36 h-36 rounded-full top-2.5 right-2.5 circle-bg backdrop-blur-sm transition-all duration-500 ease-in-out delay-400 transform translate-z-40"></span>
                <span className="circle circle3 absolute w-28 h-28 rounded-full top-4 right-4 circle-bg backdrop-blur transition-all duration-500 ease-in-out delay-800 transform translate-z-60"></span>
                <span className="circle circle4 absolute w-20 h-20 rounded-full top-5.5 right-5.5 circle-bg backdrop-blur transition-all duration-500 ease-in-out delay-1200 transform translate-z-80"></span>
                <span className="circle circle5 absolute w-12 h-12 rounded-full top-7.5 right-7.5 circle-bg backdrop-blur transition-all duration-500 ease-in-out delay-1600 transform translate-z-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 29.667 31.69" className="w-5 fill-white">
                    <path d="M12.827,1.628A1.561,1.561,0,0,1,14.31,0h2.964a1.561,1.561,0,0,1,1.483,1.628v11.9a9.252,9.252,0,0,1-2.432,6.852q-2.432,2.409-6.963,2.409T2.4,20.452Q0,18.094,0,13.669V1.628A1.561,1.561,0,0,1,1.483,0h2.98A1.561,1.561,0,0,1,5.947,1.628V13.191a5.635,5.635,0,0,0,.85,3.451,3.153,3.153,0,0,0,2.632,1.094,3.032,3.032,0,0,0,2.582-1.076,5.836,5.836,0,0,0,.816-3.486Z"></path>
                    <path d="M75.207,20.857a1.561,1.561,0,0,1-1.483,1.628h-2.98a1.561,1.561,0,0,1-1.483-1.628V1.628A1.561,1.561,0,0,1,70.743,0h2.98a1.561,1.561,0,0,1,1.483,1.628Z" transform="translate(-45.91 0)"></path>
                    <path d="M0,80.018A1.561,1.561,0,0,1,1.483,78.39h26.7a1.561,1.561,0,0,1,1.483,1.628v2.006a1.561,1.561,0,0,1-1.483,1.628H1.483A1.561,1.561,0,0,1,0,82.025Z" transform="translate(0 -51.963)"></path>
                  </svg>
                </span>
              </div>
              <div className="glass-bg absolute inset-0 rounded-3xl p-5"></div>
              <div className="content p-5 relative z-10 text-black">
                <span className="title text-xl font-bold block mb-2">{hotel.name}</span>
                <span className="text block mb-4">{hotel.description}</span>
                <div className="grid grid-cols-1 gap-2">
                  <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                    <BsMap className="mr-1" />
                    {hotel.city}, {hotel.country}
                  </div>
                  <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                    <BsBuilding className="mr-1" />
                    {hotel.type}
                  </div>
                  <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                    <BiMoney className="mr-1" />£{hotel.pricePerNight} per night
                  </div>
                  <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                    <BiHotel className="mr-1" />
                    {hotel.adultCount} adults, {hotel.childCount} children
                  </div>
                  <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                    <BiStar className="mr-1" />
                    {hotel.starRating} Star Rating
                  </div>
                </div>
              </div>
              <Link to={`/edit-hotel/${hotel._id}`} className="btn btn-outline btn-primary mr-2 ">
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
