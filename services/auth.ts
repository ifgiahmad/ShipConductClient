import { Token } from "@/lib/type";
import axios from "axios";
import { UserLogin } from "../lib/type";
import Cookies from "js-cookie";

// Definisikan tipe untuk login response dan login form
interface LoginResponse {
  token: Token;
  succeeded: boolean;
  message?: string;
}

interface LoginForm {
  username: string;
  password: string;
}

// Fungsi login yang mengirimkan username dan password dan menyimpan token JWT di localStorage
export const login = async (
  username: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const response = await axios.post<LoginResponse>(
      process.env.NEXT_PUBLIC_API_URL + "api/auth/signin",
      {
        username,
        password,
      }
    );
    if (response.data.token) {
      setToken(response.data.token);
      setTokenCookies(response.data.token);
    } else {
      console.error("Token tidak ditemukan di respons");
    }
    return response.data;
  } catch (error) {
    console.error("Login failed", error);
    throw error;
  }
};

//Fungsi untuk set token
export const setToken = (tokenDTO: Token) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", JSON.stringify(tokenDTO));
  }
};

export const setUser = (_userLogin: UserLogin) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("user", JSON.stringify(_userLogin));
  }
};

export const setTokenCookies = (tokenDTO: Token) => {
  Cookies.set("authToken", JSON.stringify(tokenDTO), { expires: 1 });
};

// Fungsi untuk mendapatkan token dari localStorage
export const getToken = (): Token | null => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        return JSON.parse(token) as Token;
      } catch (error) {
        console.error("Error parsing token:", error);
        return null;
      }
    }
  }
  return null;
};

// Fungsi logout untuk menghapus token dari localStorage
export const logout = (): void => {
  localStorage.removeItem("token");
  Cookies.remove("authToken");
  window.location.href = "/auth";
};
