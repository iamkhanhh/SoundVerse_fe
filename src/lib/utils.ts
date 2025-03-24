import { clsx , type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs:ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const apiUrl = {
  baseURL: "https://soundverse-be.onrender.com/api"
};
