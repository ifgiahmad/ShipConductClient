import { Token, UserRole } from "@/lib/type";
import axios from "axios";
import { UserLogin } from "../lib/type";
import Cookies from "js-cookie";
import { boolean } from "zod";

// Definisikan tipe untuk login response dan login form
interface LoginResponse {
  token: Token;
  succeeded: boolean;
  message?: string;
  roleCode?: string;
  superUser?: boolean;
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
    console.log(response);
    if (response.data.token) {
      setToken(response.data.token);
      setTokenCookies(response.data.token);
      localStorage.setItem(
        "superUser",
        JSON.stringify(response.data.superUser)
      );
      localStorage.setItem("roleCode", JSON.stringify(response.data.roleCode));
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

export const getUser = (): UserRole | undefined => {
  if (typeof window !== "undefined") {
    const _roleCode = localStorage.getItem("roleCode");
    const roleCode = _roleCode ? JSON.parse(_roleCode) : null;
    const superUser = localStorage.getItem("superUser");
    try {
      if (roleCode && superUser !== null) {
        return {
          roleCode,
          superUser: superUser === "true", // Konversi string ke boolean
        };
      }
    } catch (error) {
      console.error("Error parsing :", error);
      return undefined;
    }
  }
  return undefined;
};

// Fungsi logout untuk menghapus token dari localStorage
export const logout = (): void => {
  localStorage.removeItem("token");
  Cookies.remove("authToken");
  window.location.href = "/auth";
};
