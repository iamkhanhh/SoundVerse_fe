import { clsx , type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs:ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const apiUrl = {
  baseURL: "http://44.226.145.213/api"
};
