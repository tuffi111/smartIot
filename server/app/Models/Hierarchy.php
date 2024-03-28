<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Builder;

/**
 * @method static insert(array $array)
 * @mixin IdeHelperHierarchy
 * @see https://mikehillyer.com/articles/managing-hierarchical-data-in-mysql/
 */
class Hierarchy extends BaseModel
{
    public $timestamps = false;

    const PRP_ID = 'id';
    const PRP_NAME = 'name';
    const PRP_LEFT = 'lft';
    const PRP_RIGHT = 'rgt';

    protected $fillable = [
        self::PRP_ID,
        self::PRP_NAME,
        self::PRP_LEFT,
        self::PRP_RIGHT,
    ];

    protected $hidden = [
    ];

    protected $casts = [
    ];


    /**
     * Get all parent nodes of given node id
     * SQL:
     *  SELECT      `parent`.`name`
     *  FROM        `hierarchies` AS `node`,
     *              `hierarchies` AS `parent`
     *  WHERE       `node`.`lft` BETWEEN `parent`.`lft` AND `parent`.`rgt`
     *              AND `node`.`id` = 7
     *  ORDER BY    `parent`.`lft`;
     */
    static function parents(int $ofId): Builder|\Illuminate\Database\Query\Builder
    {
        return (new static())
            ->select(['parent.id', 'parent.name'])
            ->fromRaw(static::table('`') . ' AS `node`, ' . static::table('`') . ' AS `parent`')
            ->whereBetweenColumns(
                'node.' . static::PRP_LEFT,
                ['parent.' . static::PRP_LEFT, 'parent.' . static::PRP_RIGHT]
            )
            ->where('parent.' . static::PRP_ID, '>', 1) // without root
            ->where('node.' . static::PRP_ID, '=', $ofId)
            ->orderBy('node.' . static::PRP_LEFT);
    }


    /**
     *
     * SQL:
     *  SELECT      `node`.`id`, `node`.`name`
     *  FROM        `hierarchies` AS `node`,
     *              `hierarchies` AS `parent`
     *  WHERE       `node`.`lft` BETWEEN `parent`.`lft` AND `parent`.`rgt`
     *              AND `parent`.`id` = 1
     *  ORDER BY    `node`.`lft`;
     */
    static function children(int $ofId): Builder|\Illuminate\Database\Query\Builder
    {
        return (new static())
            ->select(['node.id', 'node.name'])
            ->fromRaw(static::table() . ' AS `node`, ' . static::table() . ' AS `parent`')
            ->whereBetweenColumns(
                'node.' . static::PRP_LEFT,
                ['parent.' . static::PRP_LEFT, 'parent.' . static::PRP_RIGHT]
            )
            ->where('parent.' . static::PRP_ID, '=', $ofId)
            ->orderBy('node.' . static::PRP_LEFT);
    }


    /**
     *
     * SQL:
     *  SELECT       node.id,
     *               node.name,
     *               (COUNT(parent.name) - 1) AS depth
     *  FROM         hierarchies AS node,
     *               hierarchies AS parent
     *  WHERE        node.lft BETWEEN parent.lft AND parent.rgt
     *  GROUP BY     node.name
     *  ORDER BY     node.lft;
     *
     */
    static function depth(): Builder|\Illuminate\Database\Query\Builder
    {
        return (new static())
            ->select(['node.id', 'node.name'])
            ->selectRaw('(COUNT(`parent`.`name`)-1) AS `depth`')
            ->fromRaw(static::table() . ' AS `node`, ' . static::table() . ' AS `parent`')
            ->whereBetweenColumns(
                'node.' . static::PRP_LEFT,
                ['parent.' . static::PRP_LEFT, 'parent.' . static::PRP_RIGHT]
            )
            ->groupBy('node.' . static::PRP_ID)
            ->groupBy('node.' . static::PRP_NAME)
            ->orderBy('node.' . static::PRP_LEFT);
    }


    /**
     *
     * A) add node as a child of a node that has no existing children
     *
     * LOCK TABLE nested_category WRITE;
     *
     * SELECT @myLeft := lft FROM nested_category
     *
     * WHERE name = '2 WAY RADIOS';
     *
     * UPDATE nested_category SET rgt = rgt + 2 WHERE rgt > @myLeft;
     * UPDATE nested_category SET lft = lft + 2 WHERE lft > @myLeft;
     *
     * INSERT INTO nested_category(name, lft, rgt) VALUES('FRS', @myLeft + 1, @myLeft + 2);
     *
     * UNLOCK TABLES;
     */
    static function addTo($id, $name)
    {
        $node = (new static())->where(static::PRP_ID, '=', $id)->firstOrFail();

        (new static)
            ->where(static::PRP_RIGHT, '>', $node->{static::PRP_LEFT})
            ->increment(static::PRP_RIGHT, 2);

        (new static)
            ->where(static::PRP_LEFT, '>', $node->{static::PRP_LEFT})
            ->increment(static::PRP_LEFT, 2);

        (new static)
            ->insert([
                static::PRP_NAME => $name,
                static::PRP_LEFT => $node->{static::PRP_LEFT} + 1,
                static::PRP_RIGHT => $node->{static::PRP_LEFT} + 2
            ]);

        return new static;
    }


    /**
     * B) add a new node after an existing one
     *
     * LOCK TABLE nested_category WRITE;
     *
     * SELECT @myRight := rgt FROM nested_category
     * WHERE name = 'TELEVISIONS';
     *
     * UPDATE nested_category SET rgt = rgt + 2 WHERE rgt > @myRight;
     * UPDATE nested_category SET lft = lft + 2 WHERE lft > @myRight;
     *
     * INSERT INTO nested_category(name, lft, rgt) VALUES('GAME CONSOLES', @myRight + 1, @myRight + 2);
     *
     * UNLOCK TABLES;
     *
     */
    static function addAfter($id, $name): self
    {
        $node = (new static())->where(static::PRP_ID, '=', $id)->firstOrFail();

        (new static)
            ->where(static::PRP_RIGHT, '>', $node->{static::PRP_RIGHT})
            ->increment(static::PRP_RIGHT, 2);

        (new static)
            ->where(static::PRP_LEFT, '>', $node->{static::PRP_RIGHT})
            ->increment(static::PRP_LEFT, 2);

        (new static)
            ->insert([
                static::PRP_NAME => $name,
                static::PRP_LEFT => $node->{static::PRP_RIGHT} + 1,
                static::PRP_RIGHT => $node->{static::PRP_RIGHT} + 2
            ]);

        return new static;
    }


    /**
     * Delete node in between
     *
     * LOCK TABLE nested_category WRITE;
     *
     * SELECT @myLeft := lft, @myRight := rgt, @myWidth := rgt - lft + 1
     * FROM nested_category
     * WHERE name = 'PORTABLE ELECTRONICS';
     *
     * DELETE FROM nested_category WHERE lft = @myLeft;
     *
     * UPDATE nested_category SET rgt = rgt - 1, lft = lft - 1 WHERE lft BETWEEN @myLeft AND @myRight;
     * UPDATE nested_category SET rgt = rgt - 2 WHERE rgt > @myRight;
     * UPDATE nested_category SET lft = lft - 2 WHERE lft > @myRight;
     *
     * UNLOCK TABLES;
     */
    function delete()
    {
    }


    /**
     *
     * LOCK TABLE nested_category WRITE;
     *
     * SELECT @myLeft := lft, @myRight := rgt, @myWidth := rgt - lft + 1
     * FROM nested_category
     * WHERE name = 'MP3 PLAYERS';
     *
     * DELETE FROM nested_category WHERE lft BETWEEN @myLeft AND @myRight;
     *
     * UPDATE nested_category SET rgt = rgt - @myWidth WHERE rgt > @myRight;
     * UPDATE nested_category SET lft = lft - @myWidth WHERE lft > @myRight;
     *
     * UNLOCK TABLES;
     */
    function deleteChildren()
    {
    }


    /**
     * SELECT parent.name, COUNT(product.name)
     * FROM nested_category AS node ,
     * nested_category AS parent,
     * product
     * WHERE node.lft BETWEEN parent.lft AND parent.rgt
     * AND node.category_id = product.category_id
     * GROUP BY parent.name
     * ORDER BY node.lft;
     */
    function aggregate()
    {
    }
}
