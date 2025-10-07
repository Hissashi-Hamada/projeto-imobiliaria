@extends('layouts.app') {{-- se não tiver layout, remova essa linha e use HTML puro --}}

@section('content')
    <div class="max-w-md mx-auto py-10">
        <h1 class="text-2xl font-semibold mb-4">Entrar</h1>
        @if ($errors->any())
            <div style="color:#c00; margin-bottom:10px;">
                {{ $errors->first() }}
            </div>
        @endif
        <form method="POST" action="{{ url('/login') }}">
            @csrf
            <div style="margin-bottom:10px;">
                <label>Email</label>
                <input type="email" name="email" required style="width:100%;padding:8px;border:1px solid #ccc;">
            </div>
            <div style="margin-bottom:10px;">
                <label>Senha</label>
                <input type="password" name="password" required style="width:100%;padding:8px;border:1px solid #ccc;">
            </div>
            <button type="submit" style="padding:8px 12px;border:0;background:#111;color:#fff;">
                Entrar
            </button>
        </form>
    </div>
@endsection
