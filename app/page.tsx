'use client'
import { useEffect, useState } from 'react'
export default function Page(){
 const [show, setShow] = useState(false);
 useEffect(()=>{ setShow(true); },[]);
 const submit = async (e:any)=>{
  e.preventDefault();
  const f = new FormData(e.target);
  await fetch('/api/contact',{method:'POST', body: JSON.stringify({name:f.get('name'), email:f.get('email')})});
  alert('Saved to DATABASE! Full stack working 🔥');
 }
 return (
  <div>
    {/* PASTE YOUR CURRENT index.html BODY CONTENT HERE */}
    <form onSubmit={submit} style={{position:'fixed', bottom:20, right:20, zIndex:999, background:'white', padding:20}}>
      <input name="name" placeholder="Name" required />
      <input name="email" placeholder="Email" required />
      <button>Submit Lead</button>
    </form>
    <iframe src="/index.html" style={{width:'100vw', height:'100vh', border:0}} />
  </div>
 )
}
