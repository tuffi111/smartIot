<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

abstract class BaseModel extends Model
{
    protected string $prefix;

    public function __construct(array $attributes = [])
    {
        if (isset($this->prefix)) {
            $this->setTable($this->prefix . $this->getTable());
        }

        parent::__construct($attributes);
    }

    public static function table(): string
    {
        return (new static())->getTable();
    }

    public static function key(): string
    {
        return (new static())->getKeyName();
    }

    public static function attr(string $prp): string
    {
        return static::table() . '.' . $prp;
    }

    public static function primary(): string
    {
        return static::attr(static::key());
    }


    /*

    Get index sizes culminated by table
        SELECT database_name, table_name, #index_name,
        SUM(stat_value) AS stat_value, ROUND(SUM(stat_value) * @@innodb_page_size / 1024 / 1024, 2) index_size_in_mb
        FROM mysql.innodb_index_stats
        WHERE stat_name = 'size' AND index_name != 'PRIMARY'
        GROUP BY database_name, table_name, database_name
        ORDER BY index_size_in_mb DESC;

     Get index sizes for each index
        SELECT database_name, table_name, index_name, stat_value,
        ROUND(stat_value * @@innodb_page_size / 1024 / 1024, 2) index_size_in_mb
        FROM mysql.innodb_index_stats
        WHERE stat_name = 'size' AND index_name != 'PRIMARY'
        ORDER BY database_name, index_size_in_mb DESC;



     */
}
