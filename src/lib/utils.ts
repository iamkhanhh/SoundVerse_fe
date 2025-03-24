import { clsx , type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs:ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const apiUrl = {
  baseURL: "http://54.250.151.63:8080/api"
};
