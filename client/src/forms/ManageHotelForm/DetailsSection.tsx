import { useFormContext } from "react-hook-form";
import { HotelFormData } from "./ManageHotelForm";

const DetailsSection = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<HotelFormData>();

  return (
    <div className="flex flex-col gap-4 p-4 bg-white rounded shadow-md relative">
      <h1 className="text-2xl font-bold mb-3 relative text-center">
        <span className="inline-block pb-1 border-b-4 border-blue-600">ADD HOTEL</span>
      </h1>
      
      <div className="form-control">
        <label className="label">
          <span className="label-text font-bold">Name</span>
        </label>
        <input
          type="text"
          placeholder="Enter hotel name"
          className={`input input-bordered ${errors.name ? 'input-error' : ''}`}
          {...register("name", { required: "This field is required" })}
        />
        {errors.name && (
          <span className="text-error mt-1">{errors.name.message}</span>
        )}
      </div>
      
      <div className="flex gap-4">
        <div className="form-control flex-1">
          <label className="label">
            <span className="label-text font-bold">City</span>
          </label>
          <input
            type="text"
            placeholder="Enter city"
            className={`input input-bordered ${errors.city ? 'input-error' : ''}`}
            {...register("city", { required: "This field is required" })}
          />
          {errors.city && (
            <span className="text-error mt-1">{errors.city.message}</span>
          )}
        </div>
        
        <div className="form-control flex-1">
          <label className="label">
            <span className="label-text font-bold">Country</span>
          </label>
          <input
            type="text"
            placeholder="Enter country"
            className={`input input-bordered ${errors.country ? 'input-error' : ''}`}
            {...register("country", { required: "This field is required" })}
          />
          {errors.country && (
            <span className="text-error mt-1">{errors.country.message}</span>
          )}
        </div>
      </div>
      
      <div className="form-control">
        <label className="label">
          <span className="label-text font-bold">Description</span>
        </label>
        <textarea
          rows={10}
          placeholder="Enter description"
          className={`textarea textarea-bordered ${errors.description ? 'textarea-error' : ''}`}
          {...register("description", { required: "This field is required" })}
        ></textarea>
        {errors.description && (
          <span className="text-error mt-1">{errors.description.message}</span>
        )}
      </div>
      
      <div className="form-control max-w-xs">
        <label className="label">
          <span className="label-text font-bold">Price Per Night</span>
        </label>
        <input
          type="number"
          min={1}
          placeholder="Enter price per night"
          className={`input input-bordered ${errors.pricePerNight ? 'input-error' : ''}`}
          {...register("pricePerNight", { required: "This field is required" })}
        />
        {errors.pricePerNight && (
          <span className="text-error mt-1">{errors.pricePerNight.message}</span>
        )}
      </div>
      
      <div className="form-control max-w-xs">
        <label className="label">
          <span className="label-text font-bold">Star Rating</span>
        </label>
        <select
          {...register("starRating", { required: "This field is required" })}
          className={`select select-bordered ${errors.starRating ? 'select-error' : ''}`}
        >
          <option value="" disabled>Select a rating</option>
          {[1, 2, 3, 4, 5].map((num) => (
            <option key={num} value={num}>{num} Stars</option>
          ))}
        </select>
        {errors.starRating && (
          <span className="text-error mt-1">{errors.starRating.message}</span>
        )}
      </div>
    </div>
  );
};

export default DetailsSection;
