import { connectDB } from '@/lib/db';
import mongoose from 'mongoose';
const Schema = new mongoose.Schema({ name:String, email:String, date:{type:Date, default:Date.now} });
const Model = mongoose.models.Contact || mongoose.model('Contact', Schema);
export async function POST(req: Request){
 const data = await req.json();
 await connectDB();
 await Model.create(data);
 return Response.json({ok:true});
}
export async function GET(){
 await connectDB();
 const all = await mongoose.models.Contact.find();
 return Response.json(all);
}
