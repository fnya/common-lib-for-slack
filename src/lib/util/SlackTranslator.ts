import { Channel } from '../entity/Channel';

/**
 * Slack のデータを変換するクラス
 */
export class SlackTranslator {
  /**
   * Slack APIのレスポンスを Channel の配列に変換
   *
   * @param entities Slack APIのレスポンス
   * @returns Channel の配列
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
}
