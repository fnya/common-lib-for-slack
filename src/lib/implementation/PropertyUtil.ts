import { PropertyType } from '../types/PropertyType';
import { IPropertyUtil } from '../interface/IPropertyUtil';
import { InvalidArgumentError } from '../error/InvalidArgumentError';
// import 'google-apps-script'; いらない, なしで、webpack も clasp も通る。

export class PropertyUtil implements IPropertyUtil {
  public getProperty(propertyType: PropertyType): string {
    const property =
      // eslint-disable-next-line no-undef
      PropertiesService.getScriptProperties().getProperty(propertyType);

    if (property) {
      return property;
    }

    throw new InvalidArgumentError('Script Property の値が不正です');
  }
}
