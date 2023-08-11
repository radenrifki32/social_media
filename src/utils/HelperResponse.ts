import { HttpStatus } from "@nestjs/common"
import { Response } from "express"

export class HelperResponse<T>{
   
    private res : Response
    constructor(res : Response) {
        this.res = res
    }
  public SuccessResponse<T>(message:string,data : T ,status : HttpStatus){
    return this.res.status(status).json({
     data : data,
     message : message,
     status : status

    })
   
  }
  public errorResponse(message : string ,status : HttpStatus){
    return this.res.status(status).json({
        message : message,
        status : status
   
       })
  
  }
   
}