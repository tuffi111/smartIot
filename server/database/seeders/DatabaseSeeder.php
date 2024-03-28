<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    private static int $counter = 0;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $adminRole = Role::create(['name' => 'admin']);

        $adminRole->givePermissionTo(Permission::create(['name' => 'user']));
        $adminRole->givePermissionTo(Permission::create(['name' => 'user.show']));
        $adminRole->givePermissionTo(Permission::create(['name' => 'user.create']));
        $adminRole->givePermissionTo(Permission::create(['name' => 'user.update']));
        $adminRole->givePermissionTo(Permission::create(['name' => 'user.update.password']));
        $adminRole->givePermissionTo(Permission::create(['name' => 'user.delete']));
        $adminRole->givePermissionTo(Permission::create(['name' => 'routes.home']));


        $admin = User::create([
            User::PRP_NAME => 'admin',
            User::PRP_EMAIL => 'apiuser@meetago.com',
            User::PRP_PASSWORD => Hash::make('secret'),
            User::PRP_EMAIL_VERIFIED_AT => Date::now()
        ]);
        $admin->assignRole($adminRole);


        self::$counter = 0;
        User::factory(10)->create(function () {
            self::$counter++;
            return [
                'name' => 'Test User' . self::$counter,
                'email' => 'test' . self::$counter . '@example.com',
            ];
        });
    }
}
