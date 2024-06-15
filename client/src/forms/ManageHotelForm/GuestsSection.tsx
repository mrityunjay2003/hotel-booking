import { useFormContext } from "react-hook-form";
import { HotelFormData } from "./ManageHotelForm";

const GuestsSection = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<HotelFormData>();

  return (
    <div className="p-4 bg-white rounded shadow-md">
     <h2 className="text-2xl font-bold mb-3 relative border-b-2 border-blue-600">
  Guests
  <div className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600"></div>
</h2>
      <div className="grid grid-cols-2 gap-5">
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Adults</span>
          </label>
          <input
            className={`input input-bordered ${errors.adultCount ? 'input-error' : ''}`}
            type="number"
            min={1}
            {...register("adultCount", {
              required: "This field is required",
            })}
          />
          {errors.adultCount && (
            <span className="text-error text-sm font-bold">
              {errors.adultCount.message}
            </span>
          )}
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Children</span>
          </label>
          <input
            className={`input input-bordered ${errors.childCount ? 'input-error' : ''}`}
            type="number"
            min={0}
            {...register("childCount", {
              required: "This field is required",
            })}
          />
          {errors.childCount && (
            <span className="text-error text-sm font-bold">
              {errors.childCount.message}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuestsSection;
