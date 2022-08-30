import { injectable } from 'inversify';
import { Channel } from '../entity/Channel';
import { Member } from '../entity/Member';

/**
 * Slack のデータを変換するクラス
 */
@injectable()
export class SlackTranslator {
  /**
   * Slack APIのレスポンスをチャンネルの配列に変換
   *
   * @param entities Slack APIのレスポンス
   * @returns チャンネルの配列
   */
  public translateToChannels(entities: any[]): Channel[] {
    const channels: Channel[] = [];

    for (const entity of entities) {
      const channel = new Channel(
        entity.id,
        entity.name,
        entity.is_private,
        entity.topic.value,
        entity.purpose.value
      );
      channels.push(channel);
    }

    return channels.sort((a, b) => {
      if (a.id > b.id) {
        return 1;
      }
      if (a.id < b.id) {
        return -1;
      }
      return 0;
    });
  }

  /**
   * チャンネルの配列を2次元配列に変換する
   *
   * @param channels チャンネルの配列
   * @returns チャンネルの2次元配列
   */
  public translateChannelsToArrays(channels: Channel[]): string[][] {
    const arrays: string[][] = [];

    for (const channel of channels) {
      const array: string[] = [];
      array.push(channel.id);
      array.push(channel.name);
      array.push(String(channel.isPrivate));
      array.push(channel.topic);
      array.push(channel.purpose);
      arrays.push(array);
    }

    return arrays;
  }

  /**
   * 2次元配列をチャンネルの配列に変換する
   *
   * @param arrays 2次元配列
   * @returns チャンネルの配列
   */
  public translateArraysToChannels(arrays: string[][]): Channel[] {
    const channels: Channel[] = [];

    for (const array of arrays) {
      const channel = new Channel(
        array[0],
        array[1],
        array[2] === 'true',
        array[3],
        array[4]
      );

      channels.push(channel);
    }

    return channels;
  }

  /**
   * Slack APIのレスポンスをメンバーの配列に変換
   *
   * @param entities Slack APIのレスポンス
   * @returns メンバーの配列
   */
  public translateToMembers(entities: any[]): Member[] {
    const members: Member[] = [];

    for (const entity of entities) {
      // bot はスキップ
      if (entity.is_bot) {
        continue;
      }

      const member = new Member(
        entity.id,
        entity.name,
        entity.profile.display_name,
        entity.deleted,
        entity.profile.image_original
      );
      members.push(member);
    }

    return members.sort((a, b) => {
      if (a.id > b.id) {
        return 1;
      }
      if (a.id < b.id) {
        return -1;
      }
      return 0;
    });
  }

  /**
   * メンバーの配列を2次元配列に変換する
   *
   * @param members チャンネルの配列
   * @returns メンバーの2次元配列
   */
  public translateMembersToArrays(members: Member[]): string[][] {
    const arrays: string[][] = [];

    for (const member of members) {
      const array: string[] = [];
      array.push(member.id);
      array.push(member.name);
      array.push(member.displayName);
      array.push(String(member.deleted));
      array.push(member.imageUrl ? member.imageUrl : '');
      arrays.push(array);
    }

    return arrays;
  }

  /**
   * 2次元配列をメンバーの配列に変換する
   *
   * @param arrays 2次元配列
   * @returns メンバーの配列
   */
  public translateArraysToMembers(arrays: string[][]): Member[] {
    const members: Member[] = [];

    for (const array of arrays) {
      const member = new Member(
        array[0],
        array[1],
        array[2],
        array[3] === 'true',
        array[4]
      );
      members.push(member);
    }

    return members;
  }
}
