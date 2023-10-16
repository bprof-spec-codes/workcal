export type EventDto = {
  id?: string | null;
  name: string;
  startTime: Date;
  endTime: Date;
  location: string;
  labels: LabelDto[];
};

export type LabelDto = {
  id?: string;
  name: string;
  color: string;
  eventId?: string;
};

export type SchedulerEvent = {
  id: string;
  startDate: Date;
  endDate: Date;
  text: string;
  location: string;
  labels: Array<{ name: string, color: string }>;
};
