<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Le site existe en anglais : chaque SPR porte aussi ses descriptions traduites.
     */
    public function up(): void
    {
        Schema::table('spr', function (Blueprint $table) {
            $table->text('courte_description_en')->nullable();
            $table->text('longue_description_en')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('spr', function (Blueprint $table) {
            $table->dropColumn(['courte_description_en', 'longue_description_en']);
        });
    }
};
