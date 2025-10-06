<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Imovel extends Model
{
    use HasFactory;

    protected $fillable = [
        'titulo','slug','descricao','tipo','status','preco_centavos',
        'area_total','area_util','quartos','suites','banheiros','vagas',
        'cep','estado','cidade','bairro','logradouro','numero','complemento',
        'lat','lng','published_at','user_id',
    ];
}
