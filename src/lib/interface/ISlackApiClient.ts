export interface ISlackApiClient {
  getChannels(): Promise<any[]>;
  getMembers(): Promise<any[]>;
  getMessages(channelId: string, oldest: string): Promise<any[]>;
  getReplies(channelId: string, parentTs: string): Promise<any[]>;
}
