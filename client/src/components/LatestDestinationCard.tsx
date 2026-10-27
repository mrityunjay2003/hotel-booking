import { Link } from "react-router-dom";
import { HotelType } from "../../../server/src/shared/types";

type Props = {
  hotel: HotelType;
};

const LatestDestinationCard = ({ hotel }: Props) => {
  const displayImage =
    hotel.imageUrls && hotel.imageUrls.length > 0
      ? hotel.imageUrls[0]
      : "/pexels-pixabay-258154.jpg";

  return (
    <Link
      to={`/detail/${hotel._id}`}
      className="relative cursor-pointer overflow-hidden rounded-md group"
    >
      <div className="h-[300px]">
        <img
          src={displayImage}
          alt={hotel.name}
          className="w-full h-full object-cover object-center transition duration-300 group-hover:scale-105"
        />
      </div>

      <div className="absolute bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent w-full rounded-b-md">
        <span className="text-white font-bold tracking-tight text-2xl">
          {hotel.name}
        </span>
        <div className="text-gray-300 text-sm">{hotel.city}, {hotel.country}</div>
      </div>
    </Link>
  );
};

export default LatestDestinationCard;
