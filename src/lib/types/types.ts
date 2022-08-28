// injectされる側はIを付けない
const Types = {
  ICredentialUtil: Symbol.for('ICredentialUtil'),
  IGoogleDrive: Symbol.for('IGoogleDrive'),
  IPropertyUtil: Symbol.for('IPropertyUtil'),
  ISpreadSheet: Symbol.for('ISpreadSheet'),
  IDateUtil: Symbol.for('IDateUtil'),
  ILogUtil: Symbol.for('ILogUtil'),
  IStringUtil: Symbol.for('IStringUtil'),
  SlackApiClient: Symbol.for('SlackApiClient'),
  SpreadSheetManager: Symbol.for('SpreadSheetManager'),
};

export default Types;
