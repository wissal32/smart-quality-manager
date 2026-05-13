<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('five_s_audits', function (Blueprint $table) {
            // Change json columns to longText to store base64 encoded photos
            $table->longText('photos_before')->nullable()->change();
            $table->longText('photos_after')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('five_s_audits', function (Blueprint $table) {
            $table->json('photos_before')->nullable()->change();
            $table->json('photos_after')->nullable()->change();
        });
    }
};
