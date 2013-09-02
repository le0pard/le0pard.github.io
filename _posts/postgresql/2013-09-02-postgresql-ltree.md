---
layout: post
title: Using ltree for hierarchical structures in PostgreSQL
date: 2013-09-02 00:00:00
categories:
- postgresql
tags:
- postgresql
- ltree
---

Hello my dear friends. In [the previous article](/2013/07/11/storing-trees-in-rdbms/) we learned about storing the tree structures in the RDBMS. In this article we will learn how to work with ltree module for PostgreSQL, which allow store data in a hierarchical tree-like structure.

# What is ltree?

Ltree is a PostgreSQL module. It is implements a data type ltree for representing labels of data stored in a hierarchical tree-like structure. Extensive facilities for searching through label trees are provided.

## Why ltree?

* The ltree implements a materialized path, which very quick for INSERT/UPDATE/DELETE and pretty quick for SELECT operations
* It will be generally faster than using a recursive CTE or recursive function that constantly needs to recalculate the branching
* As built in query syntax and operators specifically designed for querying and navigating trees
* Indexes!!!

# Initial data

First of all you should enable extension in your database. You can do this by this command:

{% highlight sql %}
CREATE EXTENSION ltree;
{% endhighlight %}

Let's create table and add to it some data:

{% highlight sql %}
CREATE TABLE comments (user_id integer, description text, path ltree);
INSERT INTO comments (user_id, description, path) VALUES ( 1, md5(random()::text), '0001');
INSERT INTO comments (user_id, description, path) VALUES ( 2, md5(random()::text), '0001.0001.0001');
INSERT INTO comments (user_id, description, path) VALUES ( 2, md5(random()::text), '0001.0001.0001.0001');
INSERT INTO comments (user_id, description, path) VALUES ( 1, md5(random()::text), '0001.0001.0001.0002');
INSERT INTO comments (user_id, description, path) VALUES ( 5, md5(random()::text), '0001.0001.0001.0003');
INSERT INTO comments (user_id, description, path) VALUES ( 6, md5(random()::text), '0001.0002');
INSERT INTO comments (user_id, description, path) VALUES ( 6, md5(random()::text), '0001.0002.0001');
INSERT INTO comments (user_id, description, path) VALUES ( 6, md5(random()::text), '0001.0003');
INSERT INTO comments (user_id, description, path) VALUES ( 8, md5(random()::text), '0001.0003.0001');
INSERT INTO comments (user_id, description, path) VALUES ( 9, md5(random()::text), '0001.0003.0002');
INSERT INTO comments (user_id, description, path) VALUES ( 11, md5(random()::text), '0001.0003.0002.0001');
INSERT INTO comments (user_id, description, path) VALUES ( 2, md5(random()::text), '0001.0003.0002.0002');
INSERT INTO comments (user_id, description, path) VALUES ( 5, md5(random()::text), '0001.0003.0002.0003');
INSERT INTO comments (user_id, description, path) VALUES ( 7, md5(random()::text), '0001.0003.0002.0002.0001');
INSERT INTO comments (user_id, description, path) VALUES ( 20, md5(random()::text), '0001.0003.0002.0002.0002');
INSERT INTO comments (user_id, description, path) VALUES ( 31, md5(random()::text), '0001.0003.0002.0002.0003');
INSERT INTO comments (user_id, description, path) VALUES ( 22, md5(random()::text), '0001.0003.0002.0002.0004');
INSERT INTO comments (user_id, description, path) VALUES ( 34, md5(random()::text), '0001.0003.0002.0002.0005');
INSERT INTO comments (user_id, description, path) VALUES ( 22, md5(random()::text), '0001.0003.0002.0002.0006');
{% endhighlight %}

Also we should add some indexes:

{% highlight sql %}
CREATE INDEX path_gist_comments_idx ON comments USING GIST(path);
CREATE INDEX path_comments_idx ON comments USING btree(path);
{% endhighlight %}

As you can see, I create table 'comments' with field 'path', which contain full path by tree for this comment. As you can see, for tree divider I use 4 numbers and dot.

Let's found all comments, where path begin from '0001.0003':

{% highlight sql %}
$ SELECT user_id, path FROM comments WHERE path <@ '0001.0003';
 user_id |           path
---------+--------------------------
       6 | 0001.0003
       8 | 0001.0003.0001
       9 | 0001.0003.0002
      11 | 0001.0003.0002.0001
       2 | 0001.0003.0002.0002
       5 | 0001.0003.0002.0003
       7 | 0001.0003.0002.0002.0001
      20 | 0001.0003.0002.0002.0002
      31 | 0001.0003.0002.0002.0003
      22 | 0001.0003.0002.0002.0004
      34 | 0001.0003.0002.0002.0005
      22 | 0001.0003.0002.0002.0006
(12 rows)
{% endhighlight %}

We can check this sql by EXPLAIN command:

{% highlight sql %}
$ EXPLAIN ANALYZE SELECT user_id, path FROM comments WHERE path <@ '0001.0003';
                                             QUERY PLAN
----------------------------------------------------------------------------------------------------
 Seq Scan on comments  (cost=0.00..1.24 rows=2 width=38) (actual time=0.013..0.017 rows=12 loops=1)
   Filter: (path <@ '0001.0003'::ltree)
   Rows Removed by Filter: 7
 Total runtime: 0.038 ms
(4 rows)
{% endhighlight %}

Let's for test disable seq scan:

{% highlight sql %}
$ SET enable_seqscan=false;
SET
$ EXPLAIN ANALYZE SELECT user_id, path FROM comments WHERE path <@ '0001.0003';
                                                            QUERY PLAN
-----------------------------------------------------------------------------------------------------------------------------------
 Index Scan using path_gist_comments_idx on comments  (cost=0.00..8.29 rows=2 width=38) (actual time=0.023..0.034 rows=12 loops=1)
   Index Cond: (path <@ '0001.0003'::ltree)
 Total runtime: 0.076 ms
(3 rows)
{% endhighlight %}

Now it's slower, but you can see, how it use index. First request use sequence scan because we have not many data in table.

We can do select "path <@ '0001.0003'" in another way:

{% highlight sql %}
$ SELECT user_id, path FROM comments WHERE path ~ '0001.0003.*';
user_id |           path
---------+--------------------------
       6 | 0001.0003
       8 | 0001.0003.0001
       9 | 0001.0003.0002
      11 | 0001.0003.0002.0001
       2 | 0001.0003.0002.0002
       5 | 0001.0003.0002.0003
       7 | 0001.0003.0002.0002.0001
      20 | 0001.0003.0002.0002.0002
      31 | 0001.0003.0002.0002.0003
      22 | 0001.0003.0002.0002.0004
      34 | 0001.0003.0002.0002.0005
      22 | 0001.0003.0002.0002.0006
(12 rows)
{% endhighlight %}

Also you should not forget about ordering of data. Example:

{% highlight sql %}
$ INSERT INTO comments (user_id, description, path) VALUES ( 9, md5(random()::text), '0001.0003.0001.0001');
$ INSERT INTO comments (user_id, description, path) VALUES ( 9, md5(random()::text), '0001.0003.0001.0002');
$ INSERT INTO comments (user_id, description, path) VALUES ( 9, md5(random()::text), '0001.0003.0001.0003');
$ SELECT user_id, path FROM comments WHERE path ~ '0001.0003.*';
user_id |           path
---------+--------------------------
       6 | 0001.0003
       8 | 0001.0003.0001
       9 | 0001.0003.0002
      11 | 0001.0003.0002.0001
       2 | 0001.0003.0002.0002
       5 | 0001.0003.0002.0003
       7 | 0001.0003.0002.0002.0001
      20 | 0001.0003.0002.0002.0002
      31 | 0001.0003.0002.0002.0003
      22 | 0001.0003.0002.0002.0004
      34 | 0001.0003.0002.0002.0005
      22 | 0001.0003.0002.0002.0006
       9 | 0001.0003.0001.0001
       9 | 0001.0003.0001.0002
       9 | 0001.0003.0001.0003
(15 rows)
{% endhighlight %}

Now with order:

{% highlight sql %}
$ SELECT user_id, path FROM comments WHERE path ~ '0001.0003.*' ORDER by path;
 user_id |           path
---------+--------------------------
       6 | 0001.0003
       8 | 0001.0003.0001
       9 | 0001.0003.0001.0001
       9 | 0001.0003.0001.0002
       9 | 0001.0003.0001.0003
       9 | 0001.0003.0002
      11 | 0001.0003.0002.0001
       2 | 0001.0003.0002.0002
       7 | 0001.0003.0002.0002.0001
      20 | 0001.0003.0002.0002.0002
      31 | 0001.0003.0002.0002.0003
      22 | 0001.0003.0002.0002.0004
      34 | 0001.0003.0002.0002.0005
      22 | 0001.0003.0002.0002.0006
       5 | 0001.0003.0002.0003
(15 rows)
{% endhighlight %}

There are several modifiers that can be put at the end of a non-star label in lquery to make it match more than just the exact match:
* "@" - match case-insensitively, for example a@ matches A
* "\*" - match any label with this prefix, for example foo* matches foobar
* "%" - match initial underscore-separated words

Also, you can write several possibly-modified labels separated with | (OR) to match any of those labels, and you can put ! (NOT) at the start to match any label that doesn't match any of the alternatives. Example:

{% highlight sql %}
$ SELECT user_id, path FROM comments WHERE path ~ '0001.*{1,2}.0001|0002.*' ORDER by path;
 user_id |           path
---------+--------------------------
       2 | 0001.0001.0001
       2 | 0001.0001.0001.0001
       1 | 0001.0001.0001.0002
       5 | 0001.0001.0001.0003
       6 | 0001.0002.0001
       8 | 0001.0003.0001
       9 | 0001.0003.0001.0001
       9 | 0001.0003.0001.0002
       9 | 0001.0003.0001.0003
       9 | 0001.0003.0002
      11 | 0001.0003.0002.0001
       2 | 0001.0003.0002.0002
       7 | 0001.0003.0002.0002.0001
      20 | 0001.0003.0002.0002.0002
      31 | 0001.0003.0002.0002.0003
      22 | 0001.0003.0002.0002.0004
      34 | 0001.0003.0002.0002.0005
      22 | 0001.0003.0002.0002.0006
       5 | 0001.0003.0002.0003
(19 rows)
{% endhighlight %}

Now let's use it for our commentable system. Find all direct childrens for parent '0001.0003':

{% highlight sql %}
$ SELECT user_id, path FROM comments WHERE path ~ '0001.0003.*{1}' ORDER by path;
 user_id |      path
---------+----------------
       8 | 0001.0003.0001
       9 | 0001.0003.0002
(2 rows)
{% endhighlight %}

Find all childrens for parent '0001.0003':

{% highlight sql %}
$ SELECT user_id, path FROM comments WHERE path ~ '0001.0003.*' ORDER by path;
 user_id |           path
---------+--------------------------
       6 | 0001.0003
       8 | 0001.0003.0001
       9 | 0001.0003.0001.0001
       9 | 0001.0003.0001.0002
       9 | 0001.0003.0001.0003
       9 | 0001.0003.0002
      11 | 0001.0003.0002.0001
       2 | 0001.0003.0002.0002
       7 | 0001.0003.0002.0002.0001
      20 | 0001.0003.0002.0002.0002
      31 | 0001.0003.0002.0002.0003
      22 | 0001.0003.0002.0002.0004
      34 | 0001.0003.0002.0002.0005
      22 | 0001.0003.0002.0002.0006
       5 | 0001.0003.0002.0003
(15 rows)
{% endhighlight %}

Find parent for children '0001.0003.0002.0002.0005':

{% highlight sql %}
$ SELECT user_id, path FROM comments WHERE path = subpath('0001.0003.0002.0002.0005', 0, -1) ORDER by path;
 user_id |        path
---------+---------------------
       2 | 0001.0003.0002.0002
(1 row)
{% endhighlight %}

If you path will not be unique, it will get several records.

# Summary

As can be seen, working with ltree materialized path is very simple. In this article, I have listed are not all the possible usage of ltree. It is not considered full-text search issues ltxtquery. But you can found this in [documentation](http://www.postgresql.org/docs/current/static/ltree.html).

*That’s all folks!* Thank you for reading till the end.