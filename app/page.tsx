'use client';
import { useState } from 'react';

export default function Page() {
  const [done, setDone] = useState(false);
  
  async function submit(e: any) {
    e.preventDefault();
    const form = new FormData(e.target);
    await fetch('/api/contact', {
      method: 'POST',
      body: JSON.stringify({ name: form.get('name'), email: form.get('email') }),
    });
    setDone(true);
    alert('Saved! Full stack working');
  }

  return (
    <main style={{height:'100vh', width:'100vw', position:'relative'}}>
      <div style={{position:'absolute', zIndex:10, bottom:30, right:30, background:'white', padding:20, borderRadius:10}}>
        <h3>Contact (Full Stack Test)</h3>
        <form onSubmit={submit}>
          <input name="name" placeholder="Your Name" required style={{display:'block', marginBottom:10, padding:8, width:200}} />
          <input name="email" placeholder="Email" required style={{display:'block', marginBottom:10, padding:8, width:200}} />
          <button type="submit">Send</button>
          {done && <p>Saved to DB!</p>}
        </form>
      </div>
      <iframe src="/index.html" style={{width:'100%', height:'100%', border:0}} title="Aurea" />
    </main>
  );
}
