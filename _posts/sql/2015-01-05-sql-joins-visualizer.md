---
layout: post
title: SQL Joins Visualizer - build SQL JOIN between two tables by using of Venn diagrams
date: 2015-01-05 00:00:00
categories:
- sql
tags:
- sql
- free app
---
Hello my dear friends.

Today we will lear about SQL Joins and my new little app, which help to build and understand its.

# SQL join

A SQL join clause combines records from two or more tables in a database. It creates a set that can be saved as a table or used as it is. A JOIN is a means for combining fields from two tables by using values common to each. ANSI-standard SQL specifies five types of JOIN: INNER, LEFT OUTER, RIGHT OUTER, FULL OUTER and CROSS. As a special case, a table (base table, view, or joined table) can JOIN to itself in a self-join.

# SQL Joins Visualizer

If you have tried to understand how joins work and constantly get confused about what join to use, you just need to use a new simple app - [SQL Joins Visualizer](http://sql-joins.leopard.in.ua/). It using Venn diagram to build a valid SQL join with explanation. Application can work offline.

<a href="http://sql-joins.leopard.in.ua/"><amp-img src="/assets/images/sql/visualizer/sql_visyalizer.png" alt="" title="1" width="800" height="600" layout="responsive" class="aligncenter size-full wp-image-1950" /></a>

To select need type of join between two table you need to click at sectors on Venn diagram. For example, if you want to get the results that completely contains the table A you will see that it is sufficient to use the "LEFT JOIN". You will get "INNER JOIN" if your JOIN results need to include both A and B results.

Of course, this application is [open source](https://github.com/le0pard/sql-joins-app).

# CROSS join

There's also a cartesian product or cross join, which as far as I know, can't be expressed as a Venn diagram:

{% highlight sql %}
SELECT * FROM TableA
CROSS JOIN TableB
{% endhighlight %}

This joins "everything to everything", resulting in 4 x 4 = 16 rows, far more than we had in the original sets. If you do the math, you can see why this is a very dangerous join to run against large tables.

# Summary

SQL Joins Visualizer help to you build SQL JOIN between two tables by using of Venn diagrams. I hope it will help to understand how working SQL joins.

*That’s all folks!* Thank you for reading till the end.