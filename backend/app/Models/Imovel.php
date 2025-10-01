<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Imovel extends Model
{
    protected $fillable = ['titulo','endereco','descricao','tipo','status','preco','imagens'];
    protected $casts = ['imagens' => 'array', 'preco' => 'integer'];
}
