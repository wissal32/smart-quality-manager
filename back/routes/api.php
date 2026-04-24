<?php

use App\Http\Controllers\ActionController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EquipmentController;
use App\Http\Controllers\FiveSAuditController;
use App\Http\Controllers\IdeaController;
use App\Http\Controllers\IncidentController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function (): void {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::apiResource('actions', ActionController::class);
    Route::apiResource('incidents', IncidentController::class);
    Route::apiResource('ideas', IdeaController::class);
    Route::apiResource('equipments', EquipmentController::class);
    Route::apiResource('five-s-audits', FiveSAuditController::class);
});