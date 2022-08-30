// /// <reference path="../types/cCryptoGS.d.ts" />
// import { inject, injectable } from 'inversify';
// import { ICryptoUtil } from '../interface/ICryptoUtil';
// import { IPropertyUtil } from '../interface/IPropertyUtil';
// import Types from '../types/Types';
// import PropertyType from '../types/PropertyType';
// import { Property } from '../entity/Property';
// import { cCryptoGS } from '../types/cCryptoGS';

// @injectable()
// export class CryptoUtil implements ICryptoUtil {
//   private iPropertyUtil: IPropertyUtil;

//   public constructor(
//     @inject(Types.IPropertyUtil) iPropertyUtil: IPropertyUtil
//   ) {
//     this.iPropertyUtil = iPropertyUtil;
//   }

//   public crypto(target: string): string {
//     const version = this.getProperty(PropertyType.Version);
//     const cryptoKey = this.getCryptoKey(version);

//     const cipher = new cCryptoGS.Cipher(cryptoKey, 'aes');
//     const encrypted = cipher.encrypto(target);
//     const property = new Property(Number(version), encrypted);

//     return JSON.stringify(property);
//   }

//   // public decrypto(target: string): string {}

//   private getCryptoKey(version: string): string {
//     const cryptKeys = JSON.parse(this.getProperty(PropertyType.CryptoKey));

//     for (const cryptoKey of cryptKeys) {
//       if (cryptoKey.version === version) {
//         return cryptoKey.value;
//       }
//     }

//     throw new Error(`暗号鍵のバージョンが正しくありません ${version}}`);
//   }

//   /**
//    * スクリプトプロパティを取得する
//    *
//    * @param propertyType PropertyType
//    * @returns スクリプトプロパティ
//    */
//   private getProperty(propertyType: PropertyType): string {
//     return this.iPropertyUtil.getProperty(propertyType);
//   }
// }
