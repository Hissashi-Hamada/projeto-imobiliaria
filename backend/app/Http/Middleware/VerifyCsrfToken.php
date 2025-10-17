<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    /**
     * As rotas declaradas aqui pulam a verificação CSRF.
     * Atenção: remover CSRF reduz a proteção contra golpes de requisições forjadas.
     */
    protected $except = [
        'api/*',
        'register',
        'register/*',
    ];
}
