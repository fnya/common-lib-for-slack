import PropertyType from '../types/PropertyType';

export interface ISlackApiClient {
  getProperty(propertyType: PropertyType): string;
}
