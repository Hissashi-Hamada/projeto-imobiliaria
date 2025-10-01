<?php

namespace App\Http\Controllers;

use App\Models\Imovel;
use Illuminate\Http\Request;

class ImovelController extends Controller
{
    public function index(Request $r) {
        $q=$r->string('q'); $status=$r->string('status'); $tipo=$r->string('tipo'); $ordem=$r->string('ordem');
        $per=(int)($r->integer('per_page')->default(12)); $page=(int)($r->integer('page')->default(1));

        $query=Imovel::query();
        if($status && $status!=='todos') $query->where('status',$status);
        if($tipo && $tipo!=='todos')     $query->where('tipo',$tipo);
        if($q) $query->where(fn($w)=>$w
            ->where('titulo','like',"%$q%")
            ->orWhere('endereco','like',"%$q%")
            ->orWhere('descricao','like',"%$q%")
        );

        if($ordem==='menor-preco')      $query->orderBy('preco','asc');
        elseif($ordem==='maior-preco')  $query->orderBy('preco','desc');
        else                            $query->orderBy('created_at','desc');

        return response()->json($query->paginate($per,['*'],'page',$page));
    }

    public function show(Imovel $imovel){ return response()->json($imovel); }

    public function store(Request $r){
        $data=$r->validate([
            'titulo'=>'required|string|max:255',
            'endereco'=>'nullable|string|max:255',
            'descricao'=>'nullable|string',
            'tipo'=>'required|in:casa,terreno,apartamento',
            'status'=>'required|in:venda,aluguel',
            'preco'=>'required|integer|min:0',
            'imagens'=>'array','imagens.*'=>'string'
        ]);
        $imovel=Imovel::create($data);
        return response()->json($imovel,201);
    }

    public function update(Request $r, Imovel $imovel){
        $data=$r->validate([
            'titulo'=>'sometimes|string|max:255',
            'endereco'=>'sometimes|nullable|string|max:255',
            'descricao'=>'sometimes|nullable|string',
            'tipo'=>'sometimes|in:casa,terreno,apartamento',
            'status'=>'sometimes|in:venda,aluguel',
            'preco'=>'sometimes|integer|min:0',
            'imagens'=>'sometimes|array','imagens.*'=>'string'
        ]);
        $imovel->update($data);
        return response()->json($imovel);
    }

    public function destroy(Imovel $imovel){
        $imovel->delete();
        return response()->json(['ok'=>true]);
    }
}
