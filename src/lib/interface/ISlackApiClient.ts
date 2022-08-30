export interface ISlackApiClient {
  getChannels(): any[];
  getMembers(): any[];
  getMessages(channelId: string, oldest: string): any[];
  getReplies(channelId: string, parentTs: string): any[];
}
