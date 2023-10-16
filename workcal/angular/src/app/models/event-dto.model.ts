
export class EventDto {
  id: string;
  name: string;
  startTime: Date;
  endTime: Date;
  location: string;
  labels: LabelDto[] = [];

  constructor(
    id: string = '',
    name: string = '',
    startTime: Date = new Date(),
    endTime: Date = new Date(),
    location: string = ''
  ) {
    this.id = id;
    this.name = name;
    this.startTime = startTime;
    this.endTime = endTime;
    this.location = location;
  }
}

export class LabelDto {
  id?: string;
  name: string;
  color: string;
  eventId?: string;
}

export interface SchedulerEvent {
  id: string;
  startDate: Date;
  endDate: Date;
  text: string;
  location: string;
  labels: Array<{ name: string, color: string }>;
}
