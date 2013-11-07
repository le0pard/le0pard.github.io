---
layout: post
title: NoSQL databases world
date: 2013-11-10 00:00:00
categories:
- nosql
tags:
- nosql
---

Hello my dear friends. In this article I will talk about NoSQL databases.

# Relational database management system (RDBMS)

The relational database model focuses on the organization of the data in the form of two-dimensional tables. Each relational table is a two-dimensional array that has the following properties:

 * each element of the table is a data element;
 * all cells in the column homogeneous: all elements in the column are the same type (numeric, character, etc.);
 * each column has a unique name;
 * identical rows in the table are not available;
 * the order of the rows and columns can be arbitrary.

[Edgar Codd](http://en.wikipedia.org/wiki/Edgar_F._Codd) is the author of the 'relational' concept.

<a href="/assets/images/nosql/Edgar_F_Codd.jpg"><img src="/assets/images/nosql/Edgar_F_Codd.jpg" alt="Edgar_F_Codd" title="Edgar_F_Codd" class="aligncenter" /></a>

The architecture of relational models started its history in the 1970s. The main task of the database then was to support the launched in 1960 a massive shift from paper records to computer-economic activities. A huge amount of information from paper documents tolerated in the database accounting systems that was a securety store of all incoming information and, if necessary, way for quick finding of information. These requirements led to the architectural features of a RDBMS that remained virtually unchanged until now: the row-data storage, indexing, records and logging operations.

Examples of databases:

 * [MySQL](http://www.mysql.com/)
 * [PostgreSQL](http://www.postgresql.org/)
 * [DB2](http://www-01.ibm.com/software/data/db2/)
 * [SQL Server](https://www.microsoft.com/en-us/sqlserver/default.aspx)

# NoSQL

NoSQL (not only SQL) - a number of approaches and projects aimed for the implementation of database models, with significant differences from those that used in traditional relational database management system with access to the data with the help of SQL. Description schema in the case of NoSQL can be carried out through the use of different data structures: hash tables, arrays, trees, etc.

For the first time the term "NoSQL" was used in the late 90's. The real meaning of the form used now got only in the middle 2009. Originally, it was a title of the open-source database created by Carlo Strozzi, which stores all data as ASCII files and used shell scripts instead of SQL to access data. This database did not have anything in common with the "NoSQL" in it's current form.

<a href="/assets/images/nosql/carlo-strozzi.jpg"><img src="/assets/images/nosql/carlo-strozzi.jpg" alt="carlo-strozzi" title="carlo-strozzi" class="aligncenter" /></a>

Johan Oskarsson organized a meeting to discuss new technologies in the IT market, storage and processing of data in June 2009 in San Francisco. The main stimulus for the meeting was the new products such as BigTable and Dynamo. For a meeting it was necessary to find a brief term for using as a Twitter hashtag. "NoSQL" term was suggested by Eric Evans from RackSpace. The term was planned to use only for this meeting and did not have a deep meaning. But it turned out that it spread worldwide network such as viral advertising and became the de facto name of a trend in the IT.

The term "NoSQL" has absolutely natural origin and has no universally accepted definition or scientific institution behind. This title is rather characterized by the vector of development of IT away from relational databases. Pramod J. Sadalage and Martin Fowler tried to group and organize knowledge about the NoSQL world in the book ["NoSQL Distilled"](http://www.amazon.com/NoSQL-Distilled-Emerging-Polyglot-Persistence/dp/0321826620).

Now there are about 150 kinds of NoSQL databases ([nosql-database.org](http://nosql-database.org/)). Let's consider the main development directions of NoSQL.

## Wide Column Store / Column Families

The idea behind is the storage data in rows, as do traditional RDBMSs, and in columns. Physically tables are a collection of columns, each of them is essentially a table with a single field. For example, it is necessary to read the value of the three columns from the table consisting of 50 columns, load input-output channel would be about 50/3 = 17 times smaller than when the same request in a conventional database. These databases are generally used for analytic systems, business intelligence and analytical data storages.

Advantages:

 * It is possible to compress data significantly, because in a single column of the table, the data is usually in the same type;
 * Allows on a cheap and low-powered hardware to boost the speed for the query performance in the 5, 10 and sometimes even 100 times, thus, due to compression, the data on the drive will take 5-10 times less space than in the case of the traditional RDBMS.

Disadvantages:

 * Slow for writing (in general);
 * there are transactions;
 * Have a number of limitations for the developer who is used to the developed traditional RDBMS.

Examples of databases:

* [HBase](http://hbase.apache.org/)
* [Cassandra](http://cassandra.apache.org/)
* [Accumulo](http://accumulo.apache.org/)
* [Amazon SimpleDB](http://aws.amazon.com/simpledb/)

## Key Value / Tuple Store

This database allows you to store key/value pairs in a persistent store, and subsequently read these values using the keys. What is the benefit of such an extremely limited at first glance solutions? During saving/reading values by key, the system works extremely efficient because of the lacks of the heavy layers of SQL handlers, indexing systems, profiling system evacuation (for PostgreSQL), etc. Such solution provides the most efficient performance, lowest cost of implementation and scaling.

Advantages:

 * RDBMS are too slow, have heavy layer of SQL cursors, they are scaled heavily;
 * RDBMS are not good enough in terms of index concurrency (concurrent processing of requests);
 * Solutions of RDBMS to store small amounts of data too much cost ;
 * There are no need for SQL queries, indexes, triggers, stored procedures, temporary tables, forms, views, etc;
 * Key/value database is easily scalable and high-performance due to its lightness.

Disadvantages:

 * Limitations of relational databases ensure data integrity at the lowest level. In stores key/value no such restriction. Data integrity controled by applications. In this case data integrity may be compromised due to errors in the application code;
 * In an RDBMS if the model is well designed, the database will contain a logical structure that fully reflects the structure of the stored data and can differ from the structure of the application (the data are independent from the application). For a key/value storage it is harder to achieve.

Examples of databases:

 * [Amazon DynamoDB](http://aws.amazon.com/dynamodb/)
 * [Riak](http://docs.basho.com/riak/latest/)
 * [Redis](http://redis.io/)
 * [LevelDB](https://code.google.com/p/leveldb/)
 * [Scalaris](https://code.google.com/p/scalaris/)
 * [MemcacheDB](http://memcachedb.org/)
 * [Kyoto Cabinet](http://fallabs.com/kyotocabinet/)

## Document Store

Are programs designed to store, search, and manage document-oriented information (semi-structured data). The central concept is a document. Implementation of the specific document-oriented database is different, but in general, they suggest the encapsulation and encryption of the data (documents) in several standard formats: XML, YAML, JSON, BSON, PDF, etc.

Advantages:

 * Sufficiently flexible language for querying;
 * Easy horizontally scalable.

Disadvantages:

 * It cannot have special type of indexes (partial, functional), triggers, stored procedures, forms, views, etc., which you can find in RDBMS;
 * Atomicity in most cases is conditional.

Examples of such databases:

* [MongoDB](http://www.mongodb.org/)
* [Couchbase](http://www.couchbase.com/)
* [CouchDB](http://couchdb.apache.org/)
* [RethinkDB](http://www.rethinkdb.com/)

## Graph Databases

A graph database is a database that uses graph structures with nodes, edges, and properties to represent and store data. By definition, a graph database is an any storage system that provides index-free adjacency. This means that every element contains a direct pointer to its adjacent element and index lookups are not necessary.

Advantages:

 * Often faster for associative data sets;
 * Can scale more naturally to large data sets as they do not typically require expensive join operations.

Disadvantages:

 * RDBMS can be used in more general cases. Graph databases are suitable for graph-like data.

Examples of such databases:

 * [Neo4j](http://www.neo4j.org/)
 * [FlockDB](https://github.com/twitter/flockdb)
 * [InfoGrid](http://infogrid.org/trac/)

## Multimodel Databases

These databases includes features of multiple databases.

There are two different groups of products that can be considered as multi-model:

 * Multimodel databases that have been developed specifically to support multiple data models and use cases;

For example: ArangoDB - promises the benefits of key-value storage as well as a document-oriented and graph inside.

 * General-purpose database with support for multiple model variants.

For example: Oracle MySQL 5.6, which can support SQL-like access and key-value access via the Memcached API.

Examples of such databases:

 * [ArangoDB](http://www.arangodb.org/)
 * [Aerospike](http://www.aerospike.com/)
 * [Datomic](http://www.datomic.com/)

## Object Databases

Database in which the data are modeled as objects, their attributes, methods, and classes. Object-oriented databases are usually recommended for those applications that require high-performance data processing, which have a complex structure.

Advantages:

 * The object model is the best display of the real world, rather than relational tuples. This is especially true for complex and multi-faceted objects;
 * Organize your data with hierarchical characteristics;
 * Separate query language is not required for accessing the data, because access is directly to objects. Nevertheless, the possibility exists to use the queries.

Disadvantages:

 * In the RDBMS schema change as a result of the creation, modification or deletion of tables usually do not depend on the application. In applications that work with object database, schema change class usually means that changes must be made in the other application classes that are associated with this class. This leads to the necessity of correction of the whole system;
 * Object database usually tied to a particular language with a separate API and data are available only through the API. RDBMS in this regard is a great opportunity, thanks to the common query language.

Examples of such databases:

 * [VelocityDB](http://www.velocitydb.com/)
 * [Objectivity](http://www.objectivity.com/)
 * [ZODB](http://www.zodb.org/en/latest/)
 * [Siaqodb](http://siaqodb.com/)
 * [EyeDB](http://www.eyedb.org/)


## Multidimensional Databases

Database optimization for online analytical processing. Can receive data from a variety of relational databases and a certain way for structuring the information into categories and sections that may be available in certain ways the coordinates.

Examples of such databases:

 * [GlobalsDB](http://globalsdb.org/)
 * [Intersystems Cache](http://www.intersystems.com/cache/index.html)
 * [SciDB](http://scidb.org/)
 * [Rasdaman](http://www.rasdaman.org/)

## Multivalue Databases

Variety of multi-dimensional database. Main feature is the support of using the attributes that can store a list of values.

Examples of such databases:

 * [Rocket U2](http://www.rocketsoftware.com/brand/rocket-u2)
 * [OpenInsight](http://www.revsoft.co.uk/openinsight.aspx)
 * [Reality](http://www.northgate-reality.com/)

# Conclusion

NoSQL movement is gaining popularity with enormous speed. However, this does not mean that relational databases are becoming rudiment or something archaic. Most likely they will be used, and will be used still active, but more in a symbiotic relationship with them will be performing NoSQL database. We live an era of polyglot persistence - an era of using the different needs of different data warehouse. Now there is no monopoly of relational databases, as there is no alternative source of data. Increasingly, architects are selected based on the nature of the storage of the data itself and how we want them to manipulate what volumes of data expected.

*That’s all folks!* Thank you for reading till the end.