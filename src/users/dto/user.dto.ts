export class UserDto {
  id: string;
  username: string;
  friends?: UserDto[];

  constructor(id: string, username: string, friends?: UserDto[]) {
    this.id = id;
    this.username = username;
    this.friends = friends;
  }
}