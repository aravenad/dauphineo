<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Les photos viennent de Wikimedia Commons : leur licence impose de citer l'auteur.
     */
    public function up(): void
    {
        Schema::table('images', function (Blueprint $table) {
            $table->string('auteur', 200)->nullable();
            $table->string('licence', 50)->nullable();
            $table->string('source', 500)->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('images', function (Blueprint $table) {
            $table->dropColumn(['auteur', 'licence', 'source']);
        });
    }
};
