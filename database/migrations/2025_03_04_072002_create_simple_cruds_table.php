<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('simple_crud', function (Blueprint $table) {
            $table->id();
            $table->char('uid', 7);
            $table->string('name', 200);
            $table->enum('gender', ['Male', 'Female']);
            $table->string('address', 200);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('simple_crud');
    }
};
