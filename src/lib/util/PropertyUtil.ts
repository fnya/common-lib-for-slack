/* eslint-disable no-undef */
import { injectable } from 'inversify';
import PropertyType from '../types/PropertyType';
import { IPropertyUtil } from '../interface/IPropertyUtil';
import { InvalidArgumentError } from '../error/InvalidArgumentError';

@injectable()
export class PropertyUtil implements IPropertyUtil {
  /**
   * Script Property を取得する
   *
   * @param propertyType PropertyType
   * @returns Script Property
   * @throw InvalidArgumentError
   */
  public getProperty(propertyType: PropertyType): string {
    const property =
      PropertiesService.getScriptProperties().getProperty(propertyType);

    if (property) {
      return property;
    }

    throw new InvalidArgumentError('PropertyType の値が不正です');
  }

  /**
   * Script Property 設定する
   *
   * @param propertyType PropertyType
   * @param value プロパティの値
   * @throw InvalidArgumentError
   */
  public setProperty(propertyType: PropertyType, value: string): void {
    const property =
      PropertiesService.getScriptProperties().getProperty(propertyType);

    if (property) {
      throw new InvalidArgumentError(
        `PropertyType が既に設定されています。${propertyType}, ${value}`
      );
    }

    PropertiesService.getScriptProperties().setProperty(propertyType, value);
  }
}

export default PropertyUtil;
