import { PropertyType } from '../types/PropertyType';
import { IPropertyUtil } from '../interface/IPropertyUtil';
import 'google-apps-script';

class PropertyUtil implements IPropertyUtil {
  public getProperty(propertyType: PropertyType): string {
    const property =
      // eslint-disable-next-line no-undef
      PropertiesService.getScriptProperties().getProperty(propertyType);

    if (property) {
      return property;
    }

    throw new Error('Script Property が取得できません');
  }
}
