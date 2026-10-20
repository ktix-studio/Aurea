import mongoose from 'mongoose';
let conn=false;
export async function connectDB(){
 if(conn) return;
 await mongoose.connect(process.env.MONGODB_URI!);
 conn=true;
}
