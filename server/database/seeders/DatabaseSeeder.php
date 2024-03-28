<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Hierarchy;
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
                'email' => 'test' . self::$counter . '@app.local',
            ];
        });




        /*
        id  |   left   |   right    | name
        ----+-----------------------------------------
        1   |   1       |   18      | ROOT
        2   |   2       |    3      | Company A
        3   |   4       |    7      | Company B
        4   |   5       |    6      | Company B.1
        5   |   8       |   17      | Company C
        6   |   9       |   16      | Company C.1
        7   |   10      |   11      | Company C.1.1
        8   |   12      |   15      | Company C.1.2
        9   |   13      |   14      | Company C.1.2.1
        /**/

        Hierarchy::insert([[
            Hierarchy::PRP_NAME => 'ROOT',
            Hierarchy::PRP_ID => 1,
            Hierarchy::PRP_LEFT => 1,
            Hierarchy::PRP_RIGHT => 18,
        ],[
            Hierarchy::PRP_NAME => 'Company A',
            Hierarchy::PRP_ID => 2,
            Hierarchy::PRP_LEFT => 2,
            Hierarchy::PRP_RIGHT => 3,
        ],[
            Hierarchy::PRP_NAME => 'Company B',
            Hierarchy::PRP_ID => 3,
            Hierarchy::PRP_LEFT => 4,
            Hierarchy::PRP_RIGHT => 7,
        ],[
            Hierarchy::PRP_NAME => 'Company B.1',
            Hierarchy::PRP_ID => 4,
            Hierarchy::PRP_LEFT => 5,
            Hierarchy::PRP_RIGHT => 6,
        ],[
            Hierarchy::PRP_NAME => 'Company C',
            Hierarchy::PRP_ID => 5,
            Hierarchy::PRP_LEFT => 8,
            Hierarchy::PRP_RIGHT => 17,
        ],[
            Hierarchy::PRP_NAME => 'Company C.1',
            Hierarchy::PRP_ID => 6,
            Hierarchy::PRP_LEFT => 9,
            Hierarchy::PRP_RIGHT => 16,
        ],[
            Hierarchy::PRP_NAME => 'Company C.1.1',
            Hierarchy::PRP_ID => 7,
            Hierarchy::PRP_LEFT => 10,
            Hierarchy::PRP_RIGHT => 11,
        ],[
            Hierarchy::PRP_NAME => 'Company C.1.2',
            Hierarchy::PRP_ID => 8,
            Hierarchy::PRP_LEFT => 12,
            Hierarchy::PRP_RIGHT => 15,
        ],[
            Hierarchy::PRP_NAME => 'Company C.1.2.1',
            Hierarchy::PRP_ID => 9,
            Hierarchy::PRP_LEFT => 13,
            Hierarchy::PRP_RIGHT => 14,
        ]]);
    }
}
