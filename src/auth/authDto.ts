
import { createZodDto } from 'nestjs-zod'
import { z } from 'nestjs-zod/z'
const AuthSchema = z.object({
     username : z.string().min(5,{message : " Username Min 5 Character"}).max(19,{message : 'Max 19 Caracther'}).describe("This Is Username"),
     email : z.string().email({message : "Email Tidak Valid"}).describe("This Is Email"),
     password : z.password().atLeastOne("digit",{message : "Password Atleast One Digit"}).min(8,{message : "Password Min 8 Character"}).max(20,{message : "Password Max 20 Character"}).atLeastOne("lowercase",{message : "Password Atleast one LowerCase"}).atLeastOne("uppercase",{message : "Password Atleast one Uppercase"}).atLeastOne("special",{message :"Password Atleast One Special Character"}).describe("This is Password")
})
export  class AuthDto {
     username : string
     email : string 
     password : string
}