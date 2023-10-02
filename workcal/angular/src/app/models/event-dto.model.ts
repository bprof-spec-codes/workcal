// event-dto.model.ts

export class EventDto {
  id: string;
  name: string;
  startTime: Date;
  endTime: Date;
  location: string;

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
