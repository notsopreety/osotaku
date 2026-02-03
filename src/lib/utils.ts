import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format airing time to readable countdown
export function formatAiringTime(timeUntilAiring: number): string {
  if (timeUntilAiring <= 0) return 'Now';
  
  const days = Math.floor(timeUntilAiring / 86400);
  const hours = Math.floor((timeUntilAiring % 86400) / 3600);
  const minutes = Math.floor((timeUntilAiring % 3600) / 60);
  
  if (days > 0) {
    return `${days}d ${hours}h`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

// Format airing timestamp to date string
export function formatAiringDate(airingAt: number): string {
  const date = new Date(airingAt * 1000);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}
