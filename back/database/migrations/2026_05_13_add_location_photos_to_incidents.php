<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('incidents', function (Blueprint $table) {
            $table->string('location')->nullable()->after('category')->comment('Localisation du problème');
            $table->longText('photos')->nullable()->after('corrective_action')->comment('Photos de l\'incident en base64');
        });
    }

    public function down(): void
    {
        Schema::table('incidents', function (Blueprint $table) {
            $table->dropColumn('location');
            $table->dropColumn('photos');
        });
    }
};
