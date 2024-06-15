import { useFormContext } from "react-hook-form";
import { hotelFacilities } from "../../config/hotel-options-config";
import { HotelFormData } from "./ManageHotelForm";

const FacilitiesSection = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<HotelFormData>();

  return (
    <div className="p-4 bg-white rounded shadow-md">
     <h2 className="text-2xl font-bold mb-3 relative border-b-2 border-blue-600">
  Facilities
  <div className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600"></div>
</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {hotelFacilities.map((facility) => (
          <label key={facility} className="flex items-center gap-2 text-gray-700">
            <input
              type="checkbox"
              value={facility}
              className="checkbox checkbox-primary"
              {...register("facilities", {
                validate: (facilities) => {
                  if (facilities && facilities.length > 0) {
                    return true;
                  } else {
                    return "At least one facility is required";
                  }
                },
              })}
            />
            <span className="text-sm">{facility}</span>
          </label>
        ))}
      </div>
      {errors.facilities && (
        <span className="text-error text-sm font-bold">
          {errors.facilities.message}
        </span>
      )}
    </div>
  );
};

export default FacilitiesSection;
