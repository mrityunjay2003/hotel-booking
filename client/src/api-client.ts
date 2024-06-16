import { HotelType } from "../../server/src/shared/types";
import { RegisterFormData } from "./pages/Register";
import { SignInFormData } from "./pages/SignIn";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export const register = async (formData: RegisterFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/users/registeration`, {
    method: "POST",
    credentials: "include", //set cookies
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const responseBody = await response.json();

  if (!response.ok) {
    throw new Error(responseBody.message);
  }
};

export const signIn = async (formData: SignInFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const responseBody = await response.json();
  if (!response.ok) {
    throw new Error(responseBody.message);
  }
};

export const validateToken = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Token invalid");
    }

    return response.json();
  } catch (error) {
    console.error("Error validating token:", error);
    throw new Error("Error validating token");
  }
};

export const signOut = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
    credentials: "include",
    method: "POST",
  });
  if (!response.ok) {
    throw new Error("Error during sign out");
  }
};

export const addMyHotel = async (hotelFormData: FormData) => {
  console.log(hotelFormData);
  const formDataObject: any = Object.fromEntries(hotelFormData);

  formDataObject.facilities = [];
  formDataObject.imageUrls = [];

  for (const [key, value] of hotelFormData.entries()) {
    if (key.startsWith("facilities[")) {
      formDataObject.facilities.push(value);
    } else if (key.startsWith("imageUrls[")) {
      formDataObject.imageUrls.push(value);
    }
  }
  const response = await fetch(`${API_BASE_URL}/api/my-hotels`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formDataObject),
  });

  if (!response.ok) {
    throw new Error("Failed to add hotel");
  }

  return response.json();
};


export const fetchMyHotels = async ():Promise<HotelType[]> => {
  const response = await fetch(`${API_BASE_URL}/api/my-hotels`,
    {
      credentials: "include",
    }
  );

  
  if (!response.ok) {
    throw new Error("Error fetching Hotel");
  }

  return response.json();
};
