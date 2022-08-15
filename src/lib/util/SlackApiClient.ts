import { ISlackApiClient } from '../interface/ISlackApiClient';
import { IPropertyUtil } from '../interface/IPropertyUtil';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types/types';

@injectable()
export class SlackApiClient implements ISlackApiClient {
  private propertyUtil: IPropertyUtil;

  public constructor(@inject(TYPES.IPropertyUtil) propertyUtil: IPropertyUtil) {
    this.propertyUtil = propertyUtil;
  }
}
