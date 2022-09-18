import { Channel } from '../entity/Channel';
import { Member } from '../entity/Member';
import { Message } from '../entity/Message';
import { MessageStatus } from '../entity/MessageStatus';
import { Reply } from '../entity/Reply';

export interface ISlackTranslator {
  translateToChannels(entities: any[]): Channel[];
  translateChannelsToArrays(channels: Channel[]): string[][];
  translateArraysToChannels(arrays: string[][]): Channel[];
  translateToMembers(entities: any[]): Member[];
  translateMembersToArrays(members: Member[]): string[][];
  translateArraysToMembers(arrays: string[][]): Member[];
  translateArraysToMessageStatus(arrays: string[][]): MessageStatus[];
  translateToMessages(entities: any[], members: Member[]): Message[];
  translateMessagesToArrays(messages: Message[]): string[][];
  translateArraysToMessages(arrays: string[][]): Message[];
  translateRepliesToArrays(replies: Reply[]): string[][];
  translateToReplies(entities: any[], members: Member[]): Reply[];
}
