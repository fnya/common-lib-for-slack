import PropertyType from '../types/PropertyType';

export interface IPropertyUtil {
  getProperty(propertyType: PropertyType): string;
}
