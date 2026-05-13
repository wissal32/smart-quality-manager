<?php

use App\Http\Controllers\ActionController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EquipmentController;
use App\Http\Controllers\FiveSAuditController;
use App\Http\Controllers\IdeaController;
use App\Http\Controllers\IncidentController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function (): void {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);

    Route::middleware('role:admin')->group(function (): void {
        Route::get('/users', [UserController::class, 'index']);
        Route::post('/users', [UserController::class, 'store']);
        Route::put('/users/{id}', [UserController::class, 'update']);
        Route::delete('/users/{id}', [UserController::class, 'destroy']);
    });

    Route::middleware('role:admin,quality_manager')->group(function (): void {
        Route::apiResource('actions', ActionController::class);
        Route::apiResource('five-s-audits', FiveSAuditController::class);
    });

    Route::middleware('role:admin,it_referent')->group(function (): void {
        Route::apiResource('equipments', EquipmentController::class);
    });

    Route::apiResource('incidents', IncidentController::class);
    Route::apiResource('ideas', IdeaController::class);
});