
export const eventService = {

  registerForEvent: async (eventId: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Registered for event: ${eventId}`);
        resolve(true);
      }, 500);
    });
  },
};

