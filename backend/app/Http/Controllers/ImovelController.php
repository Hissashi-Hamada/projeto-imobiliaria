<?php

namespace App\Http\Controllers;

use App\Models\Imovel;
use Illuminate\Http\Request;

class ImovelController extends Controller
{
    public function index(Request $r) {
    // strings (ok usar string()->toString() ou query())
    $q      = $r->string('q')->toString();
    $status = $r->string('status')->toString();
    $tipo   = $r->string('tipo')->toString();
    $ordem  = $r->string('ordem')->toString();

    // inteiros (Laravel 12: default Ã© o 2Âº argumento)
    $per  = $r->integer('per_page', 12);
    $page = $r->integer('page', 1);

    $query = Imovel::query();

    if ($status && $status !== 'todos') $query->where('status', $status);
    if ($tipo && $tipo !== 'todos')     $query->where('tipo', $tipo);

    if ($q) {
        $query->where(function($w) use ($q) {
            $w->where('titulo', 'like', "%{$q}%")
                ->orWhere('endereco', 'like', "%{$q}%")
                ->orWhere('descricao', 'like', "%{$q}%");
        });
    }

    if ($ordem === 'menor-preco')      $query->orderBy('preco', 'asc');
    elseif ($ordem === 'maior-preco')  $query->orderBy('preco', 'desc');
    else                               $query->orderBy('created_at', 'desc');

    return response()->json($query->paginate($per, ['*'], 'page', $page));
}

}
