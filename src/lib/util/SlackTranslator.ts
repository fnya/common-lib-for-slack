import { injectable } from 'inversify';
import { Channel } from '../entity/Channel';
import { Member } from '../entity/Member';
import { Message } from '../entity/Message';
import { Reaction } from '../entity/Reaction';
import { File } from '../entity/File';
import { Url } from '../entity/Url';

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

  /**
   * Slack APIのレスポンスをメッセージの配列に変換
   *
   * @param entities Slack APIのレスポンス
   * @returns メッセージの配列
   */
  public translateToMessages(entities: any[], members: Member[]): Message[] {
    const messages: Message[] = [];

    for (const entity of entities) {
      const created = this.createDateString(entity.ts);
      const userName = this.getMemberName(entity.user, members);
      const json = JSON.stringify(entity);
      const reactions = this.createReactions(entity);
      const files = this.createFiles(entity);
      const urls = this.createUrls(entity);

      const message = new Message(
        entity.ts,
        created,
        entity.user,
        userName,
        entity.text,
        entity.reply_count ? entity.reply_count : 0,
        !!entity.edited,
        entity.edited ? entity.edited.ts : '',
        entity.edited ? this.createDateString(entity.edited.ts) : '',
        json,
        reactions,
        files,
        urls
      );

      messages.push(message);
    }

    return messages.sort((a, b) => {
      if (a.ts > b.ts) {
        return 1;
      }
      if (a.ts < b.ts) {
        return -1;
      }
      return 0;
    });
  }

  /**
   * メッセージの配列を2次元配列に変換する
   *
   * @param messages メッセージの配列
   * @returns メッセージの2次元配列
   */
  public translateMessagesToArrays(messages: Message[]): string[][] {
    const arrays: string[][] = [];

    for (const message of messages) {
      const array: string[] = [];
      const created = this.createDateString(message.ts);

      array.push(message.ts);
      array.push(created);
      array.push(message.userId);
      array.push(message.userName);
      array.push(message.text);
      array.push(message.replyCount.toString());
      array.push(String(message.isEdited));
      array.push(message.editedTs);
      array.push(message.edited);
      array.push(message.reactions);
      array.push(message.files);
      array.push(message.urls);
      array.push(JSON.stringify(message));

      arrays.push(array);
    }

    return arrays;
  }

  /**
   * リアクションを作成する
   *
   * @param entity エンティティ
   * @returns リアクション
   */
  private createReactions(entity: any): string {
    const reactions: Reaction[] = [];

    if (entity.reactions) {
      for (const reaction of entity.reactions) {
        const myReaction = new Reaction(reaction.name, reaction.count);
        reactions.push(myReaction);
      }
    }

    return JSON.stringify(reactions);
  }

  /**
   * ファイル情報を作成する
   *
   * @param entity エンティティ
   * @returns ファイル情報
   */
  private createFiles(entity: any): string {
    const files: File[] = [];

    if (entity.files) {
      for (const file of entity.files) {
        const created = this.createDateString(file.created);

        const myFile = new File(
          file.id,
          created,
          file.name,
          file.mimetype,
          file.filetype,
          file.url_private_download
        );
        files.push(myFile);
      }
    }

    return JSON.stringify(files);
  }

  /**
   * URL情報を作成する
   *
   * @param entity エンティティ
   * @returns URL
   */
  private createUrls(entity: any): string {
    const urls: Url[] = [];

    if (entity.attachments) {
      for (const attachment of entity.attachments) {
        const url = new Url(
          attachment.original_url ? attachment.original_url : '',
          attachment.title ? attachment.title : '',
          attachment.text ? attachment.text : ''
        );
        urls.push(url);
      }
    }

    return JSON.stringify(urls);
  }

  /**
   * メンバー名を取得する
   *
   * @param id id
   * @param members メンバーの配列
   * @returns メンバー名
   */
  private getMemberName(id: string, members: Member[]): string {
    const displayName = members.find((member) => member.id === id)?.displayName;

    if (displayName) {
      return displayName;
    }

    const name = members.find((member) => member.id === id)?.name;

    if (name) {
      return name;
    }

    return '';
  }

  /**
   * tsから日時文字列を作成する
   *
   * @param ts ts
   * @returns 日時文字列
   */
  private createDateString(ts: string): string {
    const date = new Date(Number(ts) * 1000);
    return (
      date.getFullYear() +
      '-' +
      this.paddingZero(date.getMonth() + 1) +
      '-' +
      this.paddingZero(date.getDate()) +
      ' ' +
      this.paddingZero(date.getHours()) +
      ':' +
      this.paddingZero(date.getMinutes()) +
      ':' +
      this.paddingZero(date.getSeconds())
    );
  }

  /**
   * 数値を前ゼロ2桁に整形する
   *
   * @param num 数値
   * @returns 前ゼロ2桁数値
   */
  private paddingZero(num: number): string {
    return ('00' + num.toString()).slice(-2);
  }
}
