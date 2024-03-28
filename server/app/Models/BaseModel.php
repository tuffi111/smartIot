<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

abstract class BaseModel extends Model
{
    static protected $withDatabaseName = false;

    static function withDb(bool $set = true): self
    {
        static::$withDatabaseName = $set;
        return new static;
    }

    /**
     * Get the table name of Model.
     *
     * @param string $enclose
     * @return string
     */
    static function table(string $enclose = ''): string
    {
        $me = (new static);
        return static::withDatabaseName($me, $enclose, '.')
            . static::formatTableName($me->getTable(), $enclose);
    }

    /**
     * Get primary key name.
     *
     * @param string $enclose
     * @return string
     */
    static function keyName(string $enclose = ''): string
    {
        $me = (new static);
        static::$withDatabaseName = false;
        return static::formatTableName($me->getKeyName(), $enclose);
    }

    /**
     * Get full qualified primary key name.
     * Example:
     *  Model::primaryKey() => `table`.`primaryAttribute`
     *
     * @param string $enclose
     * @return string
     */
    static function primaryKey(string $enclose = '`'): string
    {
        $db = static::$withDatabaseName;
        $key = static::keyName();
        static::$withDatabaseName = $db;
        $result = static::attr($key, $enclose);
        static::$withDatabaseName = false;
        return $result;
    }

    /**
     *  Get full qualified attribute.
     *  Example:
     *   Model::attr('anAttribute') => `table`.`anAttribute`
     *   Model::withDatabase()->attr('anAttribute') => `db`.`table`.`anAttribute`
     *
     * @param string $property
     * @param string $enclose
     * @return string
     */
    static function attr(string $property, string $enclose = '`'): string
    {
        return sprintf('%s.%s%s%s', static::table($enclose), $enclose, $property, $enclose);
    }

    private static function formatTableName(string $value, string $enclose = '', string $suffix = ''): string
    {
        return sprintf('%s%s%s%s', $enclose, $value, $enclose, $suffix);
    }

    /**
     * @param Model $model
     * @param string $enclose
     * @param string $suffix
     * @param string $db
     * @return string
     */
    private static function withDatabaseName(
        Model $model,
        string $enclose = '',
        string $suffix = '',
        string $db = ''
    ): string {
        if (static::$withDatabaseName) {
            $db = static::formatTableName($model->getConnection()->getDatabaseName(), $enclose, $suffix);
            static::$withDatabaseName = false;
        }
        return $db;
    }
}
