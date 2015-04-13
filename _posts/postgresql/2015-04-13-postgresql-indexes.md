---
layout: post
title: PostgreSQL indexes
date: 2015-04-13 00:00:00
categories:
- postgresql
tags:
- postgresql
- indexes
published: false
---

Hello my dear friends. In this article I will talk about PostgreSQL indexes.

# What is index?

The article will begin with tables, not indexes. So, what is a table in a relational database?

Table is a list of rows. Each row have number of cells. The number of cells and cell types in a row is a same as a scheme of a column (columns) in table.
This list of rows have numbered consecutively RowId sequence number. So, we can consider table as list of pairs: (RowId, row).

Indexes is an inverse relationship: (row, RowId). Row must contain at least one cell. For indexes that index more than one cell everything written is true equally. Obviously, if a row is not unique (two identical rows), these relations look like mapped RowId list.

<a href="/assets/images/postgresql/pg_indexes/pg_indexes1.png"><img src="/assets/images/postgresql/pg_indexes/pg_indexes1.png" alt="Indexes" title="Indexes" width="800" class="aligncenter size-full" /></a>

Index is additional data structure, which can help us with:

 * Data search - all indexes support search values on equality. Some indexes also support prefix search (like "abc%"), arbitrary ranges search
 * Optimizer - B-Tree and R-Tree indexes represent a histogram arbitrary precision
 * Join - indexes can be used for Merge, Index algorithms
 * Relation - indexes can be used for except/intersect operations
 * Aggregations - indexes can effectively calculate some aggregation function (count, min, max, etc)
 * Grouping - indexes can effectively calculate the arbitrary grouping and aggregate functions (sort-group algorithm)


# PostgreSQL Index Types

There are many types of indexes in Postgres, as well as different ways to use them. Depending on the structure used to implement the indexes differ substantially supported operations, their cost, and the properties of the data being read.

## B-Tree index

B-Tree is the default that you get when you do `CREATE INDEX`. Virtually all databases will have some B-tree indexes. The B stands for Balanced (Boeing/Bayer/Balanced/Broad/Bushy-Tree), and the idea is that the amount of data on both sides of the tree is roughly the same. Therefore the number of levels that must be traversed to find rows is always in the same ballpark. B-Tree indexes can be used for equality and range queries efficiently. They can operate against all datatypes, and can also be used to retrieve NULL values. Btrees are designed to work very well with caching, even when only partially cached.

<a href="/assets/images/postgresql/pg_indexes/btree1.gif"><img src="/assets/images/postgresql/pg_indexes/btree1.gif" alt="B-Tree" title="B-Tree" width="800" class="aligncenter size-full" /></a>

Advantages:

 * Retain sorting data
 * Support the search for the unary and binary predicates
 * Allow without scanning the entire sequence of data to estimate cardinality (number of entries) for the entire index (and therefore the table), range, and with arbitrary precision. We looked at the root page - got one accuracy. We looked at the next level of the tree - got better accuracy. Views to the root of the tree - the exact number of entries received

Disadvantages:

 * For their construction is required to perform a full sorting pairs (row, RowId) (slow operation)
 * Take up a lot of disk space. Index on unique "Integer" weighs twice as much as the column (because additionaly need stored RowId)
 * At constant recording unbalances tree (in some implementations), and begins to store data sparsely, and the access time is increased by increasing the amount of disk information. What is why, B-Tree indexes require monitoring and periodic rebuilding

## R-Tree index

R-Tree (rectangle-tree) storing numeric type pairs of (X, Y) values (for example, the coordinates). R-Tree is very similar to B-Tree. The only difference - is the information written to intermediate page in a tree. For the i-th value of the B-Tree node we write the most out of the i-th subtree. In R-Tree it is a minimum rectangle that encloses all the rectangles of the child. Details can be seen in figure:

<a href="/assets/images/postgresql/pg_indexes/pg_indexes2.jpg"><img src="/assets/images/postgresql/pg_indexes/pg_indexes2.jpg" alt="R-Tree" title="R-Tree" width="800" class="aligncenter size-full" /></a>

Advantages:

 * Search for arbitrary regions, points
 * Allows us to estimate the number of dots in a region without a full scan data

Disadvantages:

 * Significant redundancy in the data storage
 * Slow update

In general, the pros-cons are very similar to B-Tree.

## Hash index

Hash indexes doesn't store the values, but their hashes. Such indexing way reducing the size (and therefore increased speed and processing) of high index fields. In this case, when a query using Hash indexes will not be compared with the value of the field, but the hash value of the desired hash fields.

Because hash functions is non-linear, such index cannot be sorted. This causes inability to use the comparisons more/less and "IS NULL" with this index. In addition, since the hashes are not unique, then the matching hashes used methods of resolving conflicts.

<a href="/assets/images/postgresql/pg_indexes/hash_indexes.png"><img src="/assets/images/postgresql/pg_indexes/hash_indexes.png" alt="Hash indexes" title="Hash indexes" width="800" class="aligncenter size-full wp-image-1950" /></a>

Advantages:

 * Very fast search O(1)
 * Stability - the index does not need to rebuild

Disadvantages:

* Hash is very sensitive to collision. In the case of "bad" data distribution, most of the entries will be concentrated in a few bouquets, and in fact the search will occur through collision resolution.

As you can see, Hash indexes are only useful for equality comparisons, but you pretty much never want to use them since they are not transaction safe, need to be manually rebuilt after crashes, and are not replicated to followers in PostgreSQL.

## Bitmap index

Bitmap indexes create a separate bitmap (a sequence of 0 and 1) for each possible value of the column, where each bit corresponds to a string with the indexed value and the value of 1 means that the entry corresponding to the bit position contains the indexed value for the column or properties. Bitmap indexes are optimal for data where bit unique values (example, gender field).

<a href="/assets/images/postgresql/pg_indexes/bitmap.png"><img src="/assets/images/postgresql/pg_indexes/bitmap.png" alt="Bitmap indexes" title="Bitmap indexes" width="800" class="aligncenter size-full" /></a>

Advantages:

 * Compact representation (small amount of disk space)
 * Fast reading and searching for the predicate "is"
 * Effective algorithms for packing masks (even more compact representation)

Disadvantages:

 * You can not change the method of encoding values in the process of updating the data. From this it follows that if the distribution (incidence) data has changed, it is required to completely rebuild the index

PostgreSQL do not offer persistent bitmap index (impossible to create by command `CREATE INDEX`). But it using in database to combine multiple indexes. PostgreSQL scans each needed index and prepares a bitmap in memory giving the locations of table rows that are reported as matching that index's conditions. The bitmaps are then ANDed and ORed together as needed by the query. Finally, the actual table rows are visited and returned.

## GiST index

Generalized Search Tree (GiST) indexes allow you to build general balanced tree structures, and can be used for operations beyond equality and range comparisons. The tree structure is not changed, still no elevators in each node pair stored value (the page number) and the number of children with the same amount of steam in the node.
The essential difference lies in the organization of the key. B-Tree trees sharpened by search ranges, and hold a maximum subtree-child. R-Tree - the region on the coordinate plane. GiST offers as values ​​in the non-leaf nodes store the information that we consider essential, and which will determine if we are interested in values ​​(satisfying the predicate) in the subtree-child. The specific form of information stored depends on the type of search that we wish to pursue. Thus parameterize R-Tree and B-Tree tree predicates and values ​​we automatically receive specialized for the task index. They are used to index the geometric data types, as well as full-text search.

Advantages:

 * Efficient search

Disadvantages:

 * Large redundancy
 * The need for specialized implementation for each query group

The rest of the pros-cons similar to B-Tree and R-Tree.

## GIN index

Generalized Inverted Indexes (GIN) are useful when an index must map many values to one row, whereas B-Tree indexes are optimized for when a row has a single key value. GINs are good for indexing array values as well as for implementing full-text search.

<a href="/assets/images/postgresql/pg_indexes/fulltext-gist-vs-gin.png"><img src="/assets/images/postgresql/pg_indexes/fulltext-gist-vs-gin.png" alt="GIN index" title="GIN index" width="800" class="aligncenter size-full" /></a>

Key features:

 * Well suited for full-text search
 * Look for a full match ("is", but not "less" or "more").
 * Well suited for semi-structured data search
 * Allows you to perform several different searches (queries) in a single pass
 * Scales much better than GiST (support large volumes of data)
 * Good work for frequent recurrence of elements (and therefore are ideal for full-text search)

# Partial Indexes

A partial index covers just a subset of a table's data. It is an index with a WHERE clause. The idea is to increase the efficiency of the index by reducing its size. A smaller index takes less storage, is easier to maintain, and is faster to scan.

# Expression Indexes

Expression indexes are useful for queries that match on some function or modification of your data. Postgres allows you to index the result of that function so that searches become as efficient as searching by raw data values.

# Unique Indexes

A unique index guarantees that the table won’t have more than one row with the same value. It’s advantageous to create unique indexes for two reasons: data integrity and performance. Lookups on a unique index are generally very fast.

# Multi-column Indexes

While Postgres has the ability to create multi-column indexes, it’s important to understand when it makes sense to do so. The Postgres query planner has the ability to combine and use multiple single-column indexes in a multi-column query by performing a bitmap index scan. In general, you can create an index on every column that covers query conditions and in most cases Postgres will use them, so make sure to benchmark and justify the creation of a multi-column index before you create them. As always, indexes come with a cost, and multi-column indexes can only optimize the queries that reference the columns in the index in the same order, while multiple single column indexes provide performance improvements to a larger number of queries.

However there are cases where a multi-column index clearly makes sense. An index on columns (a, b) can be used by queries containing WHERE a = x AND b = y, or queries using WHERE a = x only, but will not be used by a query using WHERE b = y. So if this matches the query patterns of your application, the multi-column index approach is worth considering. Also note that in this case creating an index on a alone would be redundant.

# Summary

As you can see, pagination can be improved by using an indexes (duh..) and the seek method. Last one can improve performance of pagination, but it can be used only for several types of paginations.

This article based on slides for Markus Winand's talk ["Pagination Done the PostgreSQL Way"](https://wiki.postgresql.org/wiki/File:Pagination_Done_the_PostgreSQL_Way.pdf) for PGDay on 1st Feb 2013 in Brussels. Also good article ["We need tool support for keyset pagination"](http://use-the-index-luke.com/no-offset).

*That’s all folks!* Thank you for reading till the end.