import { gapi } from 'gapi-script';

export const createGoogleCalendarEvent = async ({
  summary,
  description,
  startDate,
  endDate,
}: {
  summary: string;
  description: string;
  startDate: string;
  endDate: string;
}) => {
  const event = {
    summary,
    description,
    start: { date: startDate },
    end: { date: endDate },
  };

  try {
    await gapi.client.calendar.events.insert({
      calendarId: 'primary',
      resource: event,
    });
  } catch (error) {
    console.error('Erreur Google Calendar:', error);
    alert('Erreur lors de l’ajout à Google Calendar');
  }
};
