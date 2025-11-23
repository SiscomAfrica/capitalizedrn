import { Event } from '../types';
import { mockEvent } from './mockData';

export const eventService = {
  getAllEvents: async (): Promise<Event[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([mockEvent]);
      }, 500);
    });
  },

  getEventById: async (id: string): Promise<Event | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockEvent);
      }, 500);
    });
  },

  registerForEvent: async (eventId: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Registered for event: ${eventId}`);
        resolve(true);
      }, 500);
    });
  },
};

