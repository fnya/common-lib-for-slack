// injectされる側はIを付けない
const Types = {
  ICryptoUtil: Symbol.for('ICryptoUtil'),
  IGoogleDrive: Symbol.for('IGoogleDrive'),
  IPropertyUtil: Symbol.for('IPropertyUtil'),
  ISpreadSheetManager: Symbol.for('ISpreadSheetManager'),
  IDateUtil: Symbol.for('IDateUtil'),
  ILogUtil: Symbol.for('ILogUtil'),
  IStringUtil: Symbol.for('IStringUtil'),
  ISlackTranslator: Symbol.for('ISlackTranslator'),
  SlackApiClient: Symbol.for('SlackApiClient'),
  SlackTranslator: Symbol.for('SlackTranslator'),
  SpreadSheetManager: Symbol.for('SpreadSheetManager'),
  GoogleDrive: Symbol.for('GoogleDrive'),
  JsonUtil: Symbol.for('JsonUtil'),
  DateUtil: Symbol.for('DateUtil'),
  PropertyUtil: Symbol.for('PropertyUtil'),
  ChannelUtil: Symbol.for('ChannelUtil'),
};

export default Types;
