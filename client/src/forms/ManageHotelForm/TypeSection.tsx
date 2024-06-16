import { useFormContext } from "react-hook-form";
import { hotelTypes } from "../../config/hotel-options-config";
import { HotelFormData } from "./ManageHotelForm";

const TypeSection = () => {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<HotelFormData>();

  const typeWatch = watch("type");

  return (
    <div className="p-4 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-3 relative border-b-2 border-blue-600">
        Type
        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600"></div>
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
        {hotelTypes.map((type) => (
          <label
            key={type}
            className={`cursor-pointer ${
              typeWatch === type
                ? "bg-blue-300 text-white"
                : "bg-gray-300 text-gray-700"
            } text-sm rounded-full px-4 py-2 font-semibold flex items-center justify-center`}
          >
            <input
              type="radio"
              value={type}
              {...register("type", {
                required: "This field is required",
              })}
              className="hidden"
            />
            <span>{type}</span>
          </label>
        ))}
      </div>
      {errors.type && (
        <span className="text-error text-sm font-bold">
          {errors.type.message}
        </span>
      )}
    </div>
  );
};

export default TypeSection;
