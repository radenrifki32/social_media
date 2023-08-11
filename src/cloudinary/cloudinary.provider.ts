import { v2 } from "cloudinary";
export const cloudinaryProvider = {
    provide : "cloudinary",
    useFactory : ()=>{
        return v2.config({
            cloud_name : "dzez6b0u9",
            api_secret : "larpco686O3-IttA2ESaDa4OXk4",
            api_key : '229299712469426'

        })
    }
}