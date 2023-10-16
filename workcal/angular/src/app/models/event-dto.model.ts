
export type EventDto = {
  id?: string ;
  name: string;
  startTime: Date;
  endTime: Date;
  location: string;
  labels: LabelDto[];
  userIds: string[];

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
  userIds: string[];
};

export type UserDto = {
  id: string;
 name: string;
 email: string;
};
