import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { HotelType } from "../../../../server/src/shared/types";
import DetailsSection from "./DetailsSection";
import FacilitiesSection from "./FacilitiesSection";
import GuestsSection from "./GuestsSection";
import ImagesSection from "./ImagesSection";
import TypeSection from "./TypeSection";
import { storage } from "./firebase-config";

export type HotelFormData = {
  name: string;
  city: string;
  country: string;
  description: string;
  type: string;
  pricePerNight: number;
  starRating: number;
  facilities: string[];
  imageFiles: FileList;
  imageUrls: string[];
  adultCount: number;
  childCount: number;
};

type Props = {
  hotel?: HotelType;
  onSave: (hotelFormData: FormData) => void;
  isLoading: boolean;
};

const ManageHotelForm = ({ onSave, isLoading, hotel }: Props) => {
  const formMethods = useForm<HotelFormData>();
  const { handleSubmit, reset } = formMethods;

  useEffect(() => {
    reset(hotel);
  }, [hotel, reset]);

  const uploadImagesToFirebase = async (imageFiles: FileList) => {
    const uploadedUrls: string[] = [];
    for (const file of Array.from(imageFiles)) {
      const storageRef = ref(storage, `images/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      uploadedUrls.push(downloadURL);
    }
    return uploadedUrls;
  };

  const onSubmit = handleSubmit(async (formDataJson: HotelFormData) => {
    const formData = new FormData();
    if (hotel) {
      formData.append("hotelId", hotel._id);
    }
    formData.append("name", formDataJson.name);
    formData.append("city", formDataJson.city);
    formData.append("country", formDataJson.country);
    formData.append("description", formDataJson.description);
    formData.append("type", formDataJson.type);
    formData.append("pricePerNight", formDataJson.pricePerNight.toString());
    formData.append("starRating", formDataJson.starRating.toString());
    formData.append("adultCount", formDataJson.adultCount.toString());
    formData.append("childCount", formDataJson.childCount.toString());

    formDataJson.facilities.forEach((facility, index) => {
      formData.append(`facilities[${index}]`, facility);
    });

    if (formDataJson.imageFiles && formDataJson.imageFiles.length > 0) {
      try {
        const imageUrls = await uploadImagesToFirebase(formDataJson.imageFiles);
        imageUrls.forEach((url, index) => {
          formData.append(`imageUrls[${index}]`, url);
        });
      } catch (error) {
        console.error("Error uploading images:", error);
      }
    } else {
      formDataJson.imageUrls.forEach((url, index) => {
        formData.append(`imageUrls[${index}]`, url);
      });
    }
    onSave(formData);
  });

  return (
    <div className="p-4 bg-white rounded shadow-md">
      <FormProvider {...formMethods}>
        <form className="flex flex-col gap-10" onSubmit={onSubmit}>
          <DetailsSection />
          <TypeSection />
          <FacilitiesSection />
          <GuestsSection />
          <ImagesSection />
          <span className="flex justify-end">
            <button
              disabled={isLoading}
              type="submit"
              className="btn btn-outline btn-primary mr-2"
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
          </span>
        </form>
      </FormProvider>
    </div>
  );
};

export default ManageHotelForm;
