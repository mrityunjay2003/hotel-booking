import { FormEvent, useState } from "react";
import { useSearchContext } from "../contexts/SearchContext";
import { MdTravelExplore, MdSearch, MdExpandMore, MdDelete } from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const navigate = useNavigate();
  const search = useSearchContext();

  const [destination, setDestination] = useState<string>(search.destination);
  const [checkIn, setCheckIn] = useState<Date>(search.checkIn);
  const [checkOut, setCheckOut] = useState<Date>(search.checkOut);
  const [adultCount, setAdultCount] = useState<number>(0); // Initial value set to 0
  const [childCount, setChildCount] = useState<number>(0); // Initial value set to 0
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    search.saveSearchValues(
      destination,
      checkIn,
      checkOut,
      adultCount,
      childCount
    );
    navigate("/search");
  };

  const handleClear = () => {
    setDestination("");
    setCheckIn(new Date());
    setCheckOut(new Date());
    setAdultCount(0);
    setChildCount(0);
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);

 
  const isInputNotEmpty =
    destination ||
    checkIn !== search.checkIn ||
    checkOut !== search.checkOut ||
    adultCount !== 0 ||
    childCount !== 0;

  return (
    <div className="relative">
      <button
        onClick={toggleVisibility}
        className="flex items-center justify-center p-3 mx-auto text-black rounded-full hover:bg-gray-200 focus:outline-none"
      >
        <MdExpandMore size={30} />
      </button>

      {isVisible && (
        <form
          onSubmit={handleSubmit}
          className="p-3 bg-white rounded shadow-md grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 items-center gap-4 mt-4"
        >
          <div className="relative flex flex-1 bg-gray-100 p-2 rounded">
            <MdTravelExplore size={25} className="mr-2 text-black" />
            <input
              type="search"
              className="relative m-0 block flex-auto rounded border border-solid border-neutral-200 bg-transparent bg-clip-padding px-3 py-[0.25rem] text-black font-normal leading-[1.6] text-black outline-none transition duration-200 ease-in-out placeholder:text-black focus:z-[3] focus:border-primary focus:shadow-inset focus:outline-none motion-reduce:transition-none dark:border-white/10 dark:text-black dark:placeholder:text-black dark:autofill:shadow-autofill dark:focus:border-primary"
              placeholder="Where are you going?"
              aria-label="Search"
              value={destination}
              onChange={(event) => setDestination(event.target.value)}
            />
          </div>

          <div className="flex flex-row items-center bg-gray-100 p-2 rounded gap-2">
            <label className="flex items-center text-gray-600">
              Adults:
              <input
                className="w-full p-1 focus:outline-none font-bold"
                type="number"
                min={1}
                max={20}
                value={adultCount}
                onChange={(event) => setAdultCount(parseInt(event.target.value))}
              />
            </label>
            <label className="flex items-center text-gray-600">
              Children:
              <input
                className="w-full p-1 focus:outline-none font-bold"
                type="number"
                min={0}
                max={20}
                value={childCount}
                onChange={(event) => setChildCount(parseInt(event.target.value))}
              />
            </label>
          </div>

          <div className="flex items-center bg-gray-100 p-2 rounded">
            <DatePicker
              selected={checkIn}
              onChange={(date) => setCheckIn(date as Date)}
              selectsStart
              startDate={checkIn}
              endDate={checkOut}
              minDate={minDate}
              maxDate={maxDate}
              placeholderText="Check-in Date"
              className="min-w-full bg-white p-2 focus:outline-none"
              wrapperClassName="min-w-full"
            />
          </div>

          <div className="flex items-center bg-gray-100 p-2 rounded">
            <DatePicker
              selected={checkOut}
              onChange={(date) => setCheckOut(date as Date)}
              selectsEnd
              startDate={checkIn}
              endDate={checkOut}
              minDate={minDate}
              maxDate={maxDate}
              placeholderText="Check-out Date"
              className="min-w-full bg-white p-2 focus:outline-none"
              wrapperClassName="min-w-full"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex items-center justify-center text-blue-600 h-full p-2 rounded focus:outline-none"
            >
              <MdSearch size={25} />
            </button>
            {isInputNotEmpty && (
              <button
                type="button"
                onClick={handleClear}
                className="flex items-center justify-center text-red-600 h-full p-2 rounded focus:outline-none"
              >
                <MdDelete size={25} />
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
};

export default SearchBar;