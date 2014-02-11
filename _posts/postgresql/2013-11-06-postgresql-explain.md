---
layout: post
title: Explaining PostgreSQL EXPLAIN
date: 2013-11-06 00:00:00
categories:
- postgresql
tags:
- postgresql
- pg explain
published: false
---

Hello my dear friends. In this article I will talk about PostgreSQL EXPLAIN command.

# What is an Execution Plan

PostgreSQL has a great ability to show you how it will actually execute a query under the covers. This is known as an execution plan and which is exposed by EXPLAIN command. Understanding this tells you how you can optimize your database to improve performance. The hard part for most users is understanding the output of these command. In this article, we will review how to understand EXPLAIN output.

# Basic

Let's consider at small example:

{% highlight sql %}
=> EXPLAIN SELECT * FROM users;
                          QUERY PLAN
--------------------------------------------------------------
 Seq Scan on users  (cost=0.00..1013.87 rows=10087 width=910)
(1 row)

{% endhighlight %}

This means that the optimizer is decided to make the sequential reading of records from a table. He also estimated that the first line will be displayed through 0.00, and all - in 1013.87. This will be returned to the average length of 10087 lines of 910 bytes.

EXPLAIN does not run the query, it is only an estimate. For accurate results, you need to run EXPLAIN ANALYZE:

{% highlight sql %}
=> EXPLAIN ANALYZE SELECT * FROM users;
                                                 QUERY PLAN
-------------------------------------------------------------------------------------------------------------
 Seq Scan on users  (cost=0.00..1013.87 rows=10087 width=910) (actual time=0.031..21.268 rows=10197 loops=1)
 Total runtime: 29.458 ms
(2 rows)

{% endhighlight %}

Now there's a second set of data: the actual time taken to perform sequential read, the actual number of rows and the number of repetitions you read this. Also, there is information about the full query execution time.

It may be noted that the numbers in real time not very consistent predicted. This is because the valuation is not measured in time, and in special units. One unit is equal to the time spent on sequential reads one page from disk (by default costs are in units of "time a sequential 8kb block read takes").

# Table Scans

Let's look at what Scan types we can see through EXPLAIN. First type we was see in first example: Seq Scan. The Seq Scan operation scans the entire relation (table) as stored on disk (like TABLE ACCESS FULL). It is fast to start up, only has to read each block once and produces unordered output of data.

Next type of Scan is Index Scan. You can see it in this example:

{% highlight sql %}
=> EXPLAIN ANALYZE SELECT * FROM users WHERE id = 1;
                                                     QUERY PLAN
---------------------------------------------------------------------------------------------------------------------
 Index Scan using users_pkey on users  (cost=0.14..8.15 rows=1 width=6276) (actual time=0.111..0.113 rows=1 loops=1)
   Index Cond: (id = 1)
 Total runtime: 0.168 ms
(3 rows)
{% endhighlight %}

The Index Scan performs a B-tree traversal, walks through the leaf nodes to find all matching entries, and fetches the corresponding table data. It is like an INDEX RANGE SCAN followed by a TABLE ACCESS BY INDEX ROWID operation. It is much slower than sequential I/O (Seq Scan), requires additional I/O to access index and only scan which produces ordered output.

Next type of Scan is Index Only Scan (PostgreSQL 9.2+). You can see it in this example:

{% highlight sql %}
=> EXPLAIN ANALYZE SELECT count(*) FROM users;
                                                                   QUERY PLAN
-------------------------------------------------------------------------------------------------------------------------------------------------
 Aggregate  (cost=12.54..12.55 rows=1 width=0) (actual time=1.617..1.617 rows=1 loops=1)
   ->  Index Only Scan using index_users_on_unlock_token on users  (cost=0.14..12.48 rows=23 width=0) (actual time=1.570..1.595 rows=23 loops=1)
         Heap Fetches: 23
 Total runtime: 2.205 ms
(4 rows)
{% endhighlight %}

The Index Only Scan performs a B-tree traversal and walks through the leaf nodes to find all matching entries. There is no table access needed because the index has all columns to satisfy the query (exception: MVCC visibility information).

Let's look at example with Bitmap Index Scan / Bitmap Heap Scan:

{% highlight sql %}
=> EXPLAIN ANALYZE SELECT * FROM users where id = 4 OR id = 1;
                                                       QUERY PLAN
-------------------------------------------------------------------------------------------------------------------------
 Bitmap Heap Scan on users  (cost=8.29..12.32 rows=2 width=6276) (actual time=0.031..0.031 rows=2 loops=1)
   Recheck Cond: ((id = 4) OR (id = 1))
   ->  BitmapOr  (cost=8.29..8.29 rows=2 width=0) (actual time=0.023..0.023 rows=0 loops=1)
         ->  Bitmap Index Scan on users_pkey  (cost=0.00..4.15 rows=1 width=0) (actual time=0.019..0.019 rows=1 loops=1)
               Index Cond: (id = 4)
         ->  Bitmap Index Scan on users_pkey  (cost=0.00..4.15 rows=1 width=0) (actual time=0.002..0.002 rows=1 loops=1)
               Index Cond: (id = 1)
 Total runtime: 0.092 ms
(8 rows)
{% endhighlight %}

Tom Lane’s post to the PostgreSQL performance mailing list is very clear and concise about this type of scan:

> A plain Index Scan fetches one tuple-pointer at a time from the index, and immediately visits that tuple in the table. A bitmap scan fetches all the tuple-pointers from the index in one go, sorts them using an in-memory "bitmap" data structure, and then visits the table tuples in physical tuple-location order.
>
> —  Tom Lane

It slow to start up due to having to read all the index tuples and sort them, can combine multiple indexes and optimizer can choose it for any indexable scan with low selectivity.

# Join Operations

Generally join operations process only two tables at a time. In case a query has more joins, they are executed sequentially: first two tables, then the intermediate result with the next table. In the context of joins, the term "table" could therefore also mean "intermediate result".






# Examples

Let's look at a more complex query:

{% highlight sql %}
=> EXPLAIN SELECT * FROM users ORDER BY email;
                             QUERY PLAN
--------------------------------------------------------------------
 Sort  (cost=1684.67..1709.88 rows=10087 width=910)
   Sort Key: email
   ->  Seq Scan on users  (cost=0.00..1013.87 rows=10087 width=910)
(3 rows)
{% endhighlight %}

Now the query plan includes two steps: sorting and sequential read. Although it seems counterintuitive, the request from the bottom up (if you look at the plan), i.e. the result of sequential read is input to the operator sorting (sort operator uses the results of sequential read as input data).

If you look at the sorting step, you will notice that the optimizer is saying, in which field to sort ("Sort Key"). Different types of treatments can display additional information such as this. Also pay attention to the fact that the cost of the output of the first line operator sorting very large, they are almost equal to the costs of the withdrawal of all columns. This is due to the fact that he must first sort all strings that occupies most of the time.

If the query few steps, then step costs include not only the cost of performing this step, but also all of the steps below. In our example, the cost of sorting step 1684.67-1013.87 equal to the output of the first result, and 1709.88-1013.87 to display all results. 1013.87 is deducted from the fact that sorting is necessary to get all the data from the sequential read before you return anything. Generally, when seeing a very similar number in outputting the first and the cost of all the results, it means that all the operations required data from previous operations.

Now consider an even more interesting example:

{% highlight sql %}
=> EXPLAIN ANALYZE SELECT * FROM endpoint_summaries JOIN endpoints ON endpoint_summaries.endpoint_id = endpoints.id;
                                                           QUERY PLAN
--------------------------------------------------------------------------------------------------------------------------------
 Hash Join  (cost=4025.02..14233.01 rows=90459 width=770) (actual time=282.313..703.217 rows=90385 loops=1)
   Hash Cond: (endpoint_summaries.endpoint_id = endpoints.id)
   ->  Seq Scan on endpoint_summaries  (cost=0.00..8059.59 rows=90459 width=566) (actual time=0.008..93.961 rows=90385 loops=1)
   ->  Hash  (cost=3070.01..3070.01 rows=76401 width=204) (actual time=282.258..282.258 rows=76991 loops=1)
         Buckets: 8192  Batches: 1  Memory Usage: 17131kB
         ->  Seq Scan on endpoints  (cost=0.00..3070.01 rows=76401 width=204) (actual time=0.025..135.267 rows=76991 loops=1)
 Total runtime: 775.384 ms
(7 rows)
{% endhighlight %}

Note the indentation. They are used to indicate that the results of some steps are used as input for others. In our example, we can see that hash join accepts input from the sequential read and hash operation. The latter, in turn, it is working with the results of sequential read. Note that the hash operation has the same costs for the conclusion of the first and all of the results - it needs all the results before return anything. In this regard, it is interesting that the cost of the output of the first hash join depends on the total cost hash operation, but begin with the sequential read table customer. This is because the hash join can return the results as soon as they get the first result of both operations, giving it to the input data.

Also you should noticed about repetitions or cycles (loops) in EXPLAIN output. Let's look at an example:

{% highlight sql %}
->  Hash  (cost=3070.01..3070.01 rows=76401 width=204) (actual time=282.258..282.258 rows=76991 loops=1)
      Buckets: 8192  Batches: 1  Memory Usage: 17131kB
      ->  Seq Scan on endpoints  (cost=0.00..3070.01 rows=76401 width=204) (actual time=0.025..135.267 rows=76991 loops=2)
{% endhighlight %}

A nested loop is something that should be familiar to functional coders; it works like this:

{% highlight bash %}
for row in inputA
  for row in inputB
    do something
  end
end
{% endhighlight %}

If inputA 2 elements, the inner loop (on inputB) will be executed 2 times. This is exactly what we are told by the optimizer in the example above. If you multiply 135.267 by 2, you get a little less than the difference between the total execution time hash join'a and the total time of the inner loop (the remaining time will likely go to the overhead associated with the computation of all of this).

# Summary

As you can be seen, Multicorn is very useful extensions, which provide for PostgreSQL communicate with many external types of data source and provide for Python developers create own custom FDW for PostgreSQL.

*That’s all folks!* Thank you for reading till the end.