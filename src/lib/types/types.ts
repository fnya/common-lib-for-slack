// injectされる側はIを付けない
const Types = {
  ICryptoUtil: Symbol.for('ICryptoUtil'),
  IGoogleDrive: Symbol.for('IGoogleDrive'),
  IPropertyUtil: Symbol.for('IPropertyUtil'),
  ISpreadSheet: Symbol.for('ISpreadSheet'),
  IDateUtil: Symbol.for('IDateUtil'),
  ILogUtil: Symbol.for('ILogUtil'),
  IStringUtil: Symbol.for('IStringUtil'),
  SlackApiClient: Symbol.for('SlackApiClient'),
  SlackTranslator: Symbol.for('SlackTranslator'),
  SpreadSheetManager: Symbol.for('SpreadSheetManager'),
};

export default Types;
