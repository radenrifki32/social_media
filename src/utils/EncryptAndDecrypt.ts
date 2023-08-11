import { createCipheriv, randomBytes, scrypt } from 'crypto';
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
}