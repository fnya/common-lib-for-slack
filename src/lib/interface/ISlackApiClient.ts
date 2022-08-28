export interface ISlackApiClient {
  getChannels(): any[];
  getUsers(): any[];
  getMessages(channelId: string, oldest: string): any[];
  getReplies(channelId: string, parentTs: string): any[];
}
