
export type EventDto = {

  id?: string ;
  name: string;
  startTime: Date;
  endTime: Date;
  locationString: string;
  labels: LabelDto[];
  users: UserDto[];
  pictureData?: string; // Add this line
  IsInRange: boolean

};



export type SchedulerEvent = {
  id: string;
  startDate: Date;
  endDate: Date;
  text: string;
  locationString: string;
  labels: Array<{ name: string, color: string }>;
  users: UserDto[];
  pictureData?: string; // Add this line
  IsInRange: boolean

};

export type LabelDto = {
  id?: string;
  name: string;
  color: string;
  eventId?: string;

};

export type UserDto = {
  id: string;
 userName: string;
 name: string;
 email: string;
 imageUrl?: string; // Add this line
 pictureFile?: File;

};

export interface UserResponse {
  totalCount: number;
  items: UserDto[];
}


export class Picture {
  id: string;
  title: string;
  imageData: string;
  contentType: string;

  constructor(data: any) {
    this.id = data.id;
    this.title = data.title;
    this.imageData = data.imageData;
    this.contentType = data.contentType;
  }

  get imageUrl(): string {
    return `data:${this.contentType};base64,${this.imageData}`;
  }
}


