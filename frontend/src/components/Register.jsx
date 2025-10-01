import { useState } from 'react';
import useApi from '@/hooks/useApi';

export default function Register(){ 
    const api = useApi();
    const [form,setForm]=useState({name:'',email:'',password:''});
    const [err,setErr]=useState('');
    const [strength,setStrength]=useState(0);

    function checkStrength(pw){
        let score = 0;
        if(pw.length >= 8) score++;
        if(/[A-Z]/.test(pw)) score++;
        if(/[0-9]/.test(pw)) score++;
        if(/[^A-Za-z0-9]/.test(pw)) score++;
        setStrength(score);
    }

    async function submit(e){
        e.preventDefault();
        setErr('');
        try {
            const res = await api.register(form);
        localStorage.setItem('token', res.token); // simples auth storage
            window.location.href = '/imoveis';
        } catch (e) {
            setErr(e.message || 'Erro');
        }
    }

    return (
        <form onSubmit={submit}>
            <input placeholder="Nome" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
            <input placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
            <input placeholder="Senha" type="password" value={form.password}
            onChange={e=>{ setForm({...form,password:e.target.value}); checkStrength(e.target.value); }}/>
            <div>Força: {['fraca','ok','boa','forte','excelente'][strength]}</div>
            <button type="submit">Cadastrar</button>
            {err && <p style={{color:'crimson'}}>{err}</p>}
        </form>
    );
}
