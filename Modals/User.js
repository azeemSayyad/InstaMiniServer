import mongoose  from "mongoose";

const userSchema = mongoose.Schema(
    {
        firstName:{
            type: String,
            required:true,
            min:2,
            max:40,
        },
        lastName:{
            type: String,
            required:true,
            min:2,
            max:40,
        },
        email:{
            type: String,
            required:true,
            max:40,
        },
        password:{
            type: String,
            required:true,
            max:7,
        },
        friends:{
            type: Array,
            default:[]
        },
        picturePath:String,
        location:String,
        occupation:String,
        viewedProfiles:Number,
        impressions:Number,
        active:{
            type:Boolean,
            default:false
        }
    }
)

const User = mongoose.model("User",userSchema)

export default User