---
layout: post
title: Safe and unsafe operations for high volume PostgreSQL
date: 2016-09-20 00:00:00
categories:
- postgresql
tags:
- postgresql
- "high load"
---

[PostgreSQL](https://www.postgresql.org/) is an object-relational database management system, which I often to use for many products. Some of this products should have high availability and working without any downtime. This means, I should run a database schema migrations while the app is up and serving requests. I have to be very careful about what database operations I run. If I run a bad command, it can lock out updates to a table for a long time. For example, if I create a new index on table, I cannot create new record in this table while that index is building. Anyone who tries to make a record in this table will block, and possibly time out, causing a partial outage. In general, I am ok with database operations taking a long time. However, any operation that locks a table for updates for more than a few seconds means downtime for me.

I decided to make a list of an operations, which can be done safe (without downtime) and usafe.

# Add a new column (safe)

This operation will not block table and can be done safety. But exists some cases, which can lock your table.

## Add a column with a default (unsafe)

Adding a column with a default requires updating each row of the table (to store the new column value). For big table this will create long running operation that locks it. So if you intend to fill the column with mostly non default values, it's best to add the column with no default, insert the correct values using `UPDATE` (correct way is to do batched updates, for example, update 1000 rows at a time, because big update will create table-wide lock), and then add any desired default.

## Add a column that is non-nullable (unsafe)

This will have the same problem, as "Add a column with a default". To make this operation without locking, you can create a new table with the addition of the non-nullable column, write to both tables, backfill, and then switch to the new table. This workaround is incredibly onerous and need two times more space than is a table takes.

# Drop a column (safe)

Dropping a column is very quick, but PostgreSQL won't reclaim the disk space until you run a "VACUUM FULL".

# Change the type of a column (unsafe)

It is not strictly unsafe for all changes. Changing the length of a varchar, for example, does not lock a table. But if column type change requires a rewrite or not depends on the datatype, in this case this operation requires updating each row of the table. As workaround, you can add a new column with needed type, change the code to write to both columns, and backfill the new column.

# Add a default value to an existing column (safe)

This operation will not block table and can be done safety.

# Add an index (unsafe)

Normally PostgreSQL locks the table to be indexed against writes and performs the entire index build with a single scan of the table. Other transactions can still read the table, but if they try to insert, update, or delete rows in the table they will block until the index build is finished.

PostgreSQL supports building indexes without locking out writes. This method is invoked by specifying the `CONCURRENTLY` option of `CREATE INDEX`. When this option is used, PostgreSQL must perform two scans of the table, and in addition it must wait for all existing transactions that could potentially modify or use the index to terminate. Thus this method requires more total work than a standard index build and takes significantly longer to complete. However, since it allows normal operations to continue while the index is built, this method is useful for adding new indexes in a production environment. Of course, the extra CPU and I/O load imposed by the index creation might slow other operations.

If a problem arises while scanning the table, such as a uniqueness violation in a unique index, the `CREATE INDEX` command will fail but leave behind an "invalid" index. This index will be ignored for querying purposes because it might be incomplete; however it will still consume update overhead. The psql `\d` command will report such an index as INVALID:

{% highlight sql %}
postgres=# \d tab
       Table "public.tab"
 Column |  Type   | Modifiers
--------+---------+-----------
 col    | integer |
Indexes:
    "idx" btree (col) INVALID
{% endhighlight %}

The recommended recovery method in such cases is to drop the index and try again to perform `CREATE INDEX CONCURRENTLY`.

Another difference is that a regular `CREATE INDEX` command can be performed within a transaction block, but `CREATE INDEX CONCURRENTLY` cannot.


# Add a column with a unique constraint (unsafe)

This operation will lock table. As workaround, you can add column, add unique index concurrently, and then add the constraint onto the table:

{% highlight sql %}
CREATE UNIQUE INDEX CONCURRENTLY token_is_unique ON large_table(token);
ALTER TABLE large_table ADD CONSTRAINT token UNIQUE USING INDEX token_is_unique;
{% endhighlight %}

# Drop a constraint (safe)

This operation will not block table and can be done safety.

# VACUUM FULL (unsafe)

`VACUUM` reclaims storage occupied by dead tuples. In normal PostgreSQL operation, tuples that are deleted or obsoleted by an update are not physically removed from their table; they remain present until a `VACUUM` is done. `VACUUM FULL` rewrites the entire contents of the table into a new disk file with no extra space, allowing unused space to be returned to the operating system. This form is much slower and requires an exclusive lock on each table while it is being processed.

To solve this problem you can use [Pg_repack](https://github.com/reorg/pg_repack) PostgreSQL extension. To perform a full-table repack, pg_repack will:

 1. create a log table to record changes made to the original table;
 2. add a trigger onto the original table, logging INSERTs, UPDATEs and DELETEs into our log table;
 3. create a new table containing all the rows in the old table;
 4. build indexes on this new table;
 5. apply all changes which have accrued in the log table to the new table;
 6. swap the tables, including indexes and toast tables, using the system catalogs;
 7. drop the original table;

Pg\_repack will only hold an `ACCESS EXCLUSIVE` lock for a short period during initial setup (steps 1 and 2 above) and during the final swap-and-drop phase (steps 6 and 7). For the rest of its time, pg\_repack only needs to hold an `ACCESS SHARE` lock on the original table, meaning INSERTs, UPDATEs, and DELETEs may proceed as usual.

Performing a full-table repack requires free disk space about twice as large as the target table(s) and its indexes.

# ALTER TABLE SET TABLESPACE (unsafe)

Normally all PostgreSQL data resides in single directory. But you might have some additional SSD disks, or quite the contrary~--- some slow, but very large disks. And you'd want to put some of the data to another disk set. This is what tablespaces are.

Default tablespace is simply `$PGDATA/base` directory. But you can have many other, created with:

{% highlight sql %}
CREATE TABLESPACE xxx LOCATION '/wherver';
{% endhighlight %}

command. Afterwards you can move some tables/indexes to this new tablespace with:

{% highlight sql %}
ALTER TABLE/INDEX whatever SET TABLESPACE xxx;
{% endhighlight %}

This is locking operation. To solve this problem you can use pg\_repack with `--tablespace` option.

# Summary

As you can see, all unsafe operations can be solved by some workarounds. Just need to remember how this unsafe operations will behave in the PostgreSQL database and be very careful about what database operations you run on production database.

*That’s all folks!* Thank you for reading till the end.