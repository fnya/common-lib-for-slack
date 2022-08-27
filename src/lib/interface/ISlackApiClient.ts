export interface ISlackApiClient {
  getChannels(): void;
  getMembers(): any;
  getMessages(channelId: string, oldest: string): any;
}
