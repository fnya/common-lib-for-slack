import { injectable } from 'inversify';
import PropertyType from '../types/PropertyType';
import { IPropertyUtil } from '../interface/IPropertyUtil';
import { InvalidArgumentError } from '../error/InvalidArgumentError';

@injectable()
class PropertyUtil implements IPropertyUtil {
  /**
   * Scrypt Property を取得する
   *
   * @param propertyType PropertyType
   * @returns Scrypt Property
   * @throw InvalidArgumentError
   */
  public getProperty(propertyType: PropertyType): string {
    const property =
      // eslint-disable-next-line no-undef
      PropertiesService.getScriptProperties().getProperty(propertyType);

    if (property) {
      return property;
    }

    throw new InvalidArgumentError('PropertyType の値が不正です');
  }
}

export default PropertyUtil;
