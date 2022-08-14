import { PropertyType } from '../types/PropertyType';
import { IPropertyUtil } from '../interface/IPropertyUtil';
import { InvalidArgumentError } from '../error/InvalidArgumentError';
// import 'google-apps-script'; いらない, なしで、webpack も clasp も通る。

export class PropertyUtil implements IPropertyUtil {
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
