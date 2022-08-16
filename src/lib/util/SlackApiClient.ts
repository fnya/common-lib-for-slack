import { inject, injectable } from 'inversify';
import { ISlackApiClient } from '../interface/ISlackApiClient';
import { IPropertyUtil } from '../interface/IPropertyUtil';
import Types from '../types/Types';
import PropertyType from '../types/PropertyType';

@injectable()
class SlackApiClient implements ISlackApiClient {
  private iPropertyUtil: IPropertyUtil;

  public constructor(
    @inject(Types.IPropertyUtil) iPropertyUtil: IPropertyUtil
  ) {
    this.iPropertyUtil = iPropertyUtil;
  }

  public getProperty(propertyType: PropertyType): string {
    return this.iPropertyUtil.getProperty(propertyType);
  }
}

export default SlackApiClient;
