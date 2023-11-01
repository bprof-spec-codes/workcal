
export type EventDto = {
  id?: string ;
  name: string;
  startTime: Date;
  endTime: Date;
  location: string;
  labels: LabelDto[];
  userIDs: String[];

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
  users: UserDto[];
};

export type UserDto = {
  id: string;
  userName: string;
 name: string;
 email: string;

};

export interface UserResponse {
  totalCount: number;
  items: UserDto[];
}
