<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('five_s_audits', function (Blueprint $table) {
            $table->id();
            $table->foreignId('zone_id')->constrained('zones')->restrictOnDelete();
            $table->boolean('tri');
            $table->boolean('ranger');
            $table->boolean('nettoyer');
            $table->boolean('standardiser');
            $table->boolean('maintenir');
            $table->decimal('score', 6, 2);
            $table->json('photos_before')->nullable();
            $table->json('photos_after')->nullable();
            $table->foreignId('created_by')->constrained('users')->restrictOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('five_s_audits');
    }
};