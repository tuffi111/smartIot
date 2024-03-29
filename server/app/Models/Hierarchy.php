<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;

/**
 * @method static insert(array $array)
 * @mixin IdeHelperHierarchy
 * @see https://mikehillyer.com/articles/managing-hierarchical-data-in-mysql/
 */
class Hierarchy extends BaseModel
{
    protected static bool $withRoot = false;
    public $timestamps = false;

    const PRP_ID = 'id';
    const PRP_UUID = 'uuid';
    const PRP_NAME = 'name';
    const PRP_LEFT = 'lft';
    const PRP_RIGHT = 'rgt';
    const PRP_CHILDREN = 'children';

    const KEY_NODE_ID = 'node_id';


    protected $fillable = [
        self::PRP_ID,
        self::PRP_UUID,
        self::PRP_NAME,
        self::PRP_LEFT,
        self::PRP_RIGHT,
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
    static function parents(int $ofId, $includeOriginNode = true): Builder|\Illuminate\Database\Query\Builder
    {
        $sql = (new static())
            ->select([
                'parent.' . static::PRP_ID,
                'parent.' . static::PRP_UUID,
                'parent.' . static::PRP_NAME,
                'parent.' . static::PRP_LEFT,
                'parent.' . static::PRP_RIGHT
            ])
            ->fromRaw(static::table('`') . ' AS `node`, ' . static::table('`') . ' AS `parent`')
            ->whereBetweenColumns(
                'node.' . static::PRP_LEFT,
                ['parent.' . static::PRP_LEFT, 'parent.' . static::PRP_RIGHT]
            )
            ->where('node.' . static::PRP_ID, '=', $ofId)
            ->orderBy('parent.' . static::PRP_LEFT);

        if (!static::withRoot()) {
            $sql->where('parent.' . static::PRP_ID, '>', 1);
        }

        if (!$includeOriginNode) {
            $sql->where('parent.' . static::PRP_ID, '!=', $ofId);
        }

        return $sql;
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
    static function children(int $ofId, $includeParent = true): Builder|\Illuminate\Database\Query\Builder
    {
        $sql = (new static())
            ->select(['node.' . static::PRP_ID, 'node.' . static::PRP_UUID, 'node.' . static::PRP_NAME])
            ->fromRaw(static::table() . ' AS `node`, ' . static::table() . ' AS `parent`')
            ->whereBetweenColumns(
                'node.' . static::PRP_LEFT,
                ['parent.' . static::PRP_LEFT, 'parent.' . static::PRP_RIGHT]
            )
            ->where('parent.' . static::PRP_ID, '=', $ofId)
            ->orderBy('node.' . static::PRP_LEFT);

        if (!$includeParent) {
            $sql->where('node.' . static::PRP_ID, '!=', $ofId);
        }

        return $sql;
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
            ->select(['node.' . static::PRP_ID, 'node.' . static::PRP_UUID, 'node.' . static::PRP_NAME])
            ->selectRaw('(COUNT(`parent`.`' . static::PRP_NAME . '`)-1) AS `depth`')
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


    static function addBefore($id, $name): self
    {
        // todo
        return new static;
    }


    static function withRoot(?bool $set = null): bool|self
    {
        if (is_null($set)) {
            return static::$withRoot;
        }

        static::$withRoot = !!$set;

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
        // todo
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
        // todo
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
        // todo
    }

    static protected function getChildren(Collection $items): Collection
    {
        $arr = collect();
        while ($item = $items->shift()) {
            $newArr = collect($item)->except([static::PRP_LEFT, static::PRP_RIGHT]);
            if (($item[static::PRP_LEFT] + 1) !== $item[static::PRP_RIGHT]) { // NODE
                $children = collect(
                    $items->whereBetween(static::PRP_RIGHT, [$item[static::PRP_LEFT], $item[static::PRP_RIGHT]])
                );
                $items->forget($items->whereIn(static::PRP_ID, $children->pluck(static::PRP_ID))->keys());
                $newChildren = static::getChildren($children);
                if ($newChildren->count()) {
                    $newArr[static::PRP_CHILDREN] = $newChildren;
                }
            }
            $arr->push($newArr);
        }
        unset($newArr, $newChildren);
        return $arr;
    }

    static function toAdjacency(Builder $items = null): Collection
    {
        if (!$items) {
            $items = static::make();
        }
        return collect(static::getChildren(collect($items->orderBy(static::PRP_LEFT)->get()))->toArray());
    }


    static function fromAdjacency(Collection $items, array &$arr = [], int &$counter = 0): Collection
    {
        $items->each(function ($item) use (&$arr, &$counter) {
            $counter++;
            if (!array_key_exists($item[static::PRP_ID], $arr)) {
                $arr[$item[static::PRP_ID]] = [
                    static::PRP_ID => $item[static::PRP_ID],
                    static::PRP_UUID => $item[static::PRP_UUID],
                    static::PRP_NAME => $item[static::PRP_NAME],
                    static::PRP_LEFT => $counter,
                ];
            }

            if (array_key_exists(static::PRP_CHILDREN, $item)) {
                static::fromAdjacency(collect($item[static::PRP_CHILDREN]), $arr, $counter);
            }

            $counter++;
            $arr[$item[static::PRP_ID]][static::PRP_RIGHT] = $counter;
        });

        return collect($arr);
    }
}
