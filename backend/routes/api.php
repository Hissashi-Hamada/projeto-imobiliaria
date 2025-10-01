<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ImovelController;

Route::apiResource('imoveis', ImovelController::class);
