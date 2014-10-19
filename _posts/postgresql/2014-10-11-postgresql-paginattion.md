---
layout: post
title: Pagination Done the PostgreSQL Way
date: 2014-10-11 00:00:00
categories:
- postgresql
tags:
- postgresql
- tunning
---

Hello my dear friends. In this article I will talk about PostgreSQL and pagination.

# Pagination in simple way

Let's start with simple examples. A query to fetch the 10 most recent news:

{% highlight sql %}
SELECT * FROM news WHERE category_id = 1234 ORDER BY date, id DESC LIMIT 10;
{% endhighlight %}

In SQL we are using `ORDER BY` to get most recent first news and `LIMIT` to fetch only the first 10 news.

## Worst Case: No index for ORDER BY

{% highlight sql %}
# EXPLAIN ANALYZE SELECT * FROM news WHERE category_id = 1234 ORDER BY id LIMIT 10;
                                                       QUERY PLAN
-------------------------------------------------------------------------------------------------------------------------
 Limit  (cost=27678.15..27678.18 rows=10 width=8) (actual time=393.361..393.363 rows=10 loops=1)
   ->  Sort  (cost=27678.15..28922.17 rows=497609 width=8) (actual time=393.359..393.360 rows=10 loops=1)
         Sort Key: id
         Sort Method: top-N heapsort  Memory: 25kB
         ->  Seq Scan on foo  (cost=0.00..16925.00 rows=497609 width=8) (actual time=0.024..277.040 rows=499071 loops=1)
               Filter: (category_id = 1234::integer)
               Rows Removed by Filter: 500929
 Total runtime: 233.021 ms
(8 rows)
{% endhighlight %}

The limiting factor is the number of rows that match the `WHERE` condition. The database might use an index to satisfy the `WHERE` condition, but must still fetch all matching rows to sort them.

<a href="/assets/images/postgresql/pagination/no_index.png" target="_blank"><img src="/assets/images/postgresql/pagination/no_index.png" alt="no_index" title="no_index" class="aligncenter size-full" /></a>


# Fetch Next Page

To get next resent 10 news in most cases using `OFFSET`:

{% highlight sql %}
SELECT * FROM news WHERE category_id = 1234 ORDER BY date, id DESC OFFSET 10 LIMIT 10;
{% endhighlight %}

## Worst Case: No index for ORDER BY

{% highlight sql %}
# EXPLAIN ANALYZE SELECT * FROM news WHERE category_id = 1234 ORDER BY id OFFSET 10 LIMIT 10;
                                                       QUERY PLAN
-------------------------------------------------------------------------------------------------------------------------
 Limit  (cost=30166.22..30166.25 rows=10 width=8) (actual time=388.711..388.714 rows=10 loops=1)
   ->  Sort  (cost=30166.20..31410.22 rows=497609 width=8) (actual time=388.706..388.711 rows=20 loops=1)
         Sort Key: id
         Sort Method: top-N heapsort  Memory: 25kB
         ->  Seq Scan on foo  (cost=0.00..16925.00 rows=497609 width=8) (actual time=0.020..271.130 rows=499071 loops=1)
               Filter: (category_id = 1234::integer)
               Rows Removed by Filter: 500929
 Total runtime: 388.761 ms
(8 rows)
# EXPLAIN ANALYZE SELECT * FROM news WHERE category_id = 1234 ORDER BY id OFFSET 100 LIMIT 10;
                                                       QUERY PLAN
-------------------------------------------------------------------------------------------------------------------------
 Limit  (cost=36285.62..36285.65 rows=10 width=8) (actual time=389.534..389.536 rows=10 loops=1)
   ->  Sort  (cost=36285.37..37529.40 rows=497609 width=8) (actual time=389.512..389.524 rows=110 loops=1)
         Sort Key: id
         Sort Method: top-N heapsort  Memory: 30kB
         ->  Seq Scan on news  (cost=0.00..16925.00 rows=497609 width=8) (actual time=0.029..274.907 rows=499071 loops=1)
               Filter: (category_id = 1234::integer)
               Rows Removed by Filter: 500929
 Total runtime: 389.588 ms
(8 rows)
# EXPLAIN ANALYZE SELECT * FROM news WHERE category_id = 1234 ORDER BY id OFFSET 1000 LIMIT 10;
                                                       QUERY PLAN
-------------------------------------------------------------------------------------------------------------------------
 Limit  (cost=44246.58..44246.61 rows=10 width=8) (actual time=389.982..389.986 rows=10 loops=1)
   ->  Sort  (cost=44244.08..45488.10 rows=497609 width=8) (actual time=389.765..389.930 rows=1010 loops=1)
         Sort Key: id
         Sort Method: top-N heapsort  Memory: 96kB
         ->  Seq Scan on news  (cost=0.00..16925.00 rows=497609 width=8) (actual time=0.024..271.414 rows=499071 loops=1)
               Filter: (category_id = 1234::integer)
               Rows Removed by Filter: 500929
 Total runtime: 390.049 ms
(8 rows)
{% endhighlight %}

As you can see by `EXPLAIN` for each next page need more memory to sort rows, before to do `OFFSET` and `LIMIT`. This might become the limiting factor when browsing farther back. Fetching the last page can take considerably longer than fetching the first page.

<a href="/assets/images/postgresql/pagination/no_index2.png" target="_blank"><img src="/assets/images/postgresql/pagination/no_index2.png" alt="no_index2" title="no_index2" class="aligncenter size-full" /></a>

# Improvement #1: Indexed ORDER BY

To impove pagination we should have indexes for fields, which we are using in `ORDER BY`:

{% highlight sql %}
# CREATE INDEX index_news_on_id_type ON news USING btree (id);
CREATE INDEX
{% endhighlight %}

The same index can be using in `WHERE` and `ORDER BY`.

{% highlight sql %}
# EXPLAIN ANALYZE SELECT * FROM news WHERE category_id = 1234  ORDER BY id OFFSET 10 LIMIT 10;
                                                                  QUERY PLAN
----------------------------------------------------------------------------------------------------------------------------------------------
 Limit  (cost=1.07..1.71 rows=10 width=8) (actual time=0.087..0.112 rows=10 loops=1)
   ->  Index Only Scan using index_news_on_id_type on news  (cost=0.42..31872.47 rows=497609 width=8) (actual time=0.057..0.109 rows=20 loops=1)
         Index Cond: (category_id = 1234::integer)
         Heap Fetches: 20
 Total runtime: 0.158 ms
(5 rows)

# EXPLAIN ANALYZE SELECT * FROM news WHERE category_id = 1234  ORDER BY id OFFSET 100 LIMIT 10;
                                                                  QUERY PLAN
-----------------------------------------------------------------------------------------------------------------------------------------------
 Limit  (cost=6.83..7.47 rows=10 width=8) (actual time=0.315..0.338 rows=10 loops=1)
   ->  Index Only Scan using index_news_on_id_type on news  (cost=0.42..31872.47 rows=497609 width=8) (actual time=0.058..0.318 rows=110 loops=1)
         Index Cond: (category_id = 1234::integer)
         Heap Fetches: 110
 Total runtime: 0.409 ms
(5 rows)

# EXPLAIN ANALYZE SELECT * FROM news WHERE category_id = 1234  ORDER BY id OFFSET 1000 LIMIT 10;
                                                                   QUERY PLAN
------------------------------------------------------------------------------------------------------------------------------------------------
 Limit  (cost=64.48..65.12 rows=10 width=8) (actual time=1.651..1.663 rows=10 loops=1)
   ->  Index Only Scan using index_news_on_id_type on news  (cost=0.42..31872.47 rows=497609 width=8) (actual time=0.041..1.596 rows=1010 loops=1)
         Index Cond: (category_id = 1234::integer)
         Heap Fetches: 1010
 Total runtime: 1.698 ms
(5 rows)
{% endhighlight %}

As you can see, fetching the next page is also faster. But in order to select, for example, the 10 page (10 per page), PostgreSQL should select 100 records and make offset 90 of selected rows.

<a href="/assets/images/postgresql/pagination/index.png" target="_blank"><img src="/assets/images/postgresql/pagination/index.png" alt="index" title="index" class="aligncenter size-full" /></a>

# Improvement #2: The Seek Method

To remove the rows from previous pages we can use `WHERE` filter instead of `OFFSET`.

{% highlight sql %}
# SELECT * FROM news WHERE category_id = 1234 AND (date, id) < (prev_date, prev_id) ORDER BY date DESC, id DESC LIMIT 10;
{% endhighlight %}

In this case neither the size of the base set(*) nor the fetched  page number affects the response time. And the memory footprint is very low!

Examples:

{% highlight sql %}
# SELECT * FROM news WHERE category_id = 1234 AND id < 12345678 ORDER BY id DESC LIMIT 10;
                                                                      QUERY PLAN
-------------------------------------------------------------------------------------------------------------------------------------------------------
 Limit  (cost=0.42..1.09 rows=10 width=8) (actual time=0.036..0.060 rows=10 loops=1)
   ->  Index Only Scan Backward using index_news_on_id_type on news  (cost=0.42..33116.37 rows=497603 width=8) (actual time=0.035..0.053 rows=10 loops=1)
         Index Cond: ((category_id = 1234::integer) AND (id < 12345678::integer))
         Heap Fetches: 10
 Total runtime: 0.098 ms
(5 rows)
{% endhighlight %}

<a href="/assets/images/postgresql/pagination/index2.png" target="_blank"><img src="/assets/images/postgresql/pagination/index2.png" alt="index2" title="index2" class="aligncenter size-full" /></a>

But the Seek Method has serious limitations:

 - You cannot directly navigate to arbitrary pages (because you need the values from the previous page)
 - Bi-directional navigation is possible but tedious (you need to revers the `ORDER BY` direction and `WHERE` comparison)
 - Works best with full row values support (workaround is possible, but ugly and less performant)

## Use case

The Seek Method perfect for "Infinite Scrolling" and "Next-Prev" (only this button) navigations:

<a href="/assets/images/postgresql/pagination/pagination_example.jpg" target="_blank"><img src="/assets/images/postgresql/pagination/pagination_example.jpg" alt="index2" title="index2" class="aligncenter size-full" /></a>

This types of paginations doesn't need:

 - navigate to arbitrary pages
 - browse backwards (only for "Prev-Next" navigation)
 - show total pages

# Summary

As you can see, pagination can be improved by using an indexes (duh..) and the seek method. Last one can improve performance of pagination, but it can be used only for several types of paginations.

This article based on slides for Markus Winand's talk ["Pagination Done the PostgreSQL Way"](https://wiki.postgresql.org/wiki/File:Pagination_Done_the_PostgreSQL_Way.pdf) for PGDay on 1st Feb 2013 in Brussels. Also good article ["We need tool support for keyset pagination"](http://use-the-index-luke.com/no-offset).

*That’s all folks!* Thank you for reading till the end.