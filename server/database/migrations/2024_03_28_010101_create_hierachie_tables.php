<?php

use App\Models\Hierarchy;
use App\Models\User;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create(Hierarchy::table(), function (Blueprint $table) {
            $table->unsignedInteger(Hierarchy::PRP_ID)->primary()->autoIncrement();
            $table->unsignedInteger(Hierarchy::PRP_LEFT)->index();
            $table->unsignedInteger(Hierarchy::PRP_RIGHT)->index();
            $table->char(Hierarchy::PRP_UUID,40)->default(DB::raw('SHA1(RANDOM_BYTES(128))'))->unique();
            $table->string(Hierarchy::PRP_NAME);
            $table->unique([Hierarchy::PRP_LEFT, Hierarchy::PRP_RIGHT], Hierarchy::KEY_NODE_ID);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::drop(Hierarchy::table());
    }
};
