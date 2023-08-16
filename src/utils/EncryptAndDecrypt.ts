import { createCipheriv, randomBytes, scrypt } from 'crypto';
import * as CryptoJS from "crypto-js";
import { promisify } from 'util';
import * as bcrypt from 'bcrypt'
import { Injectable } from '@nestjs/common';
@Injectable()
export class Encyption {
  async   encryptionText(password : string ){
        const randomByte= randomBytes(16)
        const key = (await(promisify(scrypt)(password,'salt',32))) as Buffer
        const chipper = createCipheriv('aes-256-ctr',key,randomByte)
    }
     hashingPassword(password : string) {
        return  bcrypt.hashSync(password,10)
    }
    comparePassword(password,hashingPassword) : boolean{
        return bcrypt.compareSync(password,hashingPassword)
    }
   
     decryptJson<KEYJSON,JSONRESULT> (json : KEYJSON ,SecretKey :string) :JSONRESULT {
   
        const combined = CryptoJS.enc.Base64.parse(json);
        const iv = combined.clone();
        iv.sigBytes = 16;
        iv.clamp();
      
        const encrypted = combined.clone();
        encrypted.words.splice(0, 4); 
        encrypted.sigBytes -= 16;
        const key = CryptoJS.enc.Base64.parse(SecretKey);
        const decrypted = CryptoJS.AES.decrypt(
          { ciphertext: encrypted },
          key,
          {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
          }
        );
      
        const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
      
        const jsonData : JSONRESULT= JSON.parse(decryptedText);
        return jsonData   
      
      };
      encryptionData(plainText : string, SecretKey : string) : string   {
        const iv = CryptoJS.lib.WordArray.random(16);
        console.log(SecretKey)
        const key = CryptoJS.enc.Base64.parse(SecretKey);
        const encrypted = CryptoJS.AES.encrypt(plainText, key, {
          iv: iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7,
        });
        const cipherText = iv.concat(encrypted.ciphertext).toString(CryptoJS.enc.Base64);
        return cipherText;
      };
    
    
      
}

