/* eslint-disable no-undef */
import { injectable } from 'inversify';
import PropertyType from '../types/PropertyType';

@injectable()
export class PropertyUtil {
  /**
   * Script Property を取得する
   *
   * @param propertyType PropertyType
   * @returns Script Property
   * @throw Error
   */
  public getProperty(propertyType: PropertyType): string {
    const property =
      PropertiesService.getScriptProperties().getProperty(propertyType);

    if (property) {
      return property;
    }

    throw new Error('PropertyType の値が不正です');
  }

  /**
   * Script Property が存在するかチェックする
   *
   * @param propertyType PropertyType
   * @returns true:存在する/false:存在しない
   */
  public exists(propertyType: PropertyType): boolean {
    return !!PropertiesService.getScriptProperties().getProperty(propertyType);
  }

  /**
   * Script Property 設定する
   *
   * @param propertyType PropertyType
   * @param value プロパティの値
   * @throw Error
   */
  public setProperty(propertyType: PropertyType, value: string): void {
    const property =
      PropertiesService.getScriptProperties().getProperty(propertyType);

    if (property) {
      throw new Error(
        `PropertyType が既に設定されています。${propertyType}, ${value}`
      );
    }

    PropertiesService.getScriptProperties().setProperty(propertyType, value);
  }
}

export default PropertyUtil;
