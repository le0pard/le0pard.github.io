---
layout: post
title: NoSQL databases world
date: 2013-11-10 00:00:00
categories:
- nosql
tags:
- nosql
published: false
---

Hello my dear friends. In this article I will talk about NoSQL databases.

# Relational database management system (RDBMS)

The relational database model focused on the organization of the data in the form of two-dimensional tables. Each relational table is a two-dimensional array has the following properties:

 * each element of the table is a data element;
 * all cells in the column homogeneous: all elements in a column are of the same type (numeric, character, etc.);
 * each column has a unique name;
 * identical rows in the table are not available;
 * the order of the rows and columns can be arbitrary.

[Edgar Codd](http://en.wikipedia.org/wiki/Edgar_F._Codd) is the author of the 'relational' concept.

<a href="/assets/images/nosql/Edgar_F_Codd.jpg"><img src="/assets/images/nosql/Edgar_F_Codd.jpg" alt="Edgar_F_Codd" title="Edgar_F_Codd" class="aligncenter" /></a>

The architecture of relational models counts its history back to the 1970s. The main task of the database then was to support the launch in 1960 a massive shift from paper records to computer-economic activities. A huge amount of information from paper documents tolerated in the database accounting systems that were to securely store all incoming information and, if necessary, to quickly find them. These requirements led to the architectural features of a RDBMS the remaining until now virtually unchanged: the row-data storage, indexing, records and logging operations.

Examples of databases:

 * [MySQL](http://www.mysql.com/)
 * [PostgreSQL](http://www.postgresql.org/)
 * [DB2](http://www-01.ibm.com/software/data/db2/)
 * [SQL Server](https://www.microsoft.com/en-us/sqlserver/default.aspx)

# NoSQL

NoSQL (not only SQL) - a number of approaches and projects aimed at the implementation of database models, with significant differences from those used in traditional relational database management system with access to the data by means of SQL. Description schema in the case of NoSQL can be carried out through the use of different data structures: hash tables, arrays, trees, etc.

For the first time the term "NoSQL" was used in the late 90's. The real meaning in the form in which it is used now only got in middle 2009. Originally, that was the name open-source database created by Carlo Strozzi, which stores all data as ASCII files and used shell scripts instead of SQL to access data. This database did not have anything in common with the "NoSQL" in it's current form.

<a href="/assets/images/nosql/carlo-strozzi.jpg"><img src="/assets/images/nosql/carlo-strozzi.jpg" alt="carlo-strozzi" title="carlo-strozzi" class="aligncenter" /></a>

Johan Oskarsson was organized a meeting to discuss new technologies in the IT market, storage and processing of data in June 2009 in San Francisco. The main stimulus for the meeting was the new products such as BigTable and Dynamo. For a meeting needed to find a brief term which is great to use as a Twitter hashtag. "NoSQL" term was suggested by Eric Evans from RackSpace. The term was planned only for this meeting and did not have a deep meaning. But it turned out that it had spread worldwide network such as viral advertising and has become the de facto name of a trend in the IT.

The term "NoSQL" has absolutely natural origin and has no universally accepted definition or scientific institution behind. This title is rather characterized by the vector of development of IT away from relational databases. Group and organize knowledge about the NoSQL world tried to make Pramod J. Sadalage and Martin Fowler in book ["NoSQL Distilled"](http://www.amazon.com/NoSQL-Distilled-Emerging-Polyglot-Persistence/dp/0321826620).

Now there are about 150 kinds of NoSQL databases ([nosql-database.org](http://nosql-database.org/)). Let's consider the main development directions of NoSQL.

## Wide Column Store / Column Families

The idea behind - store data in rows, as do traditional RDBMSs, and in columns. Physically tables are a collection of columns, each of which is essentially a table from a single field. For example, in a table consisting of a column 50, from which it is necessary to consider the value of the three columns, load input-output channel is about 50/3 = 17 times smaller than when the same request in a conventional database. This databases generally used for analytic systems, business intelligence and analytical data stores.

Advantages:

 * It is possible to greatly compress the data, as in a single column table, the data is usually of the same type can not be said about the line;
 * Allow for a cheap and low-powered hardware for speed boost query performance in the 5, 10 and sometimes even 100 times, thus, due to compression, the data on the drive will take 5-10 times less than in the case of traditional RDBMS.

Disadvantages:

 * Slow for write (in general);
 * No transaction;
 * Have a number of limitations to the developer who is used to the development of traditional RDBMS.

Examples of databases:

* [HBase](http://hbase.apache.org/)
* [Cassandra](http://cassandra.apache.org/)
* [Accumulo](http://accumulo.apache.org/)
* [Amazon SimpleDB](http://aws.amazon.com/simpledb/)

## Key Value / Tuple Store

This database, which allow you to store key/value pairs in a persistent store, and subsequently read these values based on the keys. What is the need for such an extremely limited at first glance solutions? When saving/reading values by key, the system is extremely efficient and have it lacks the heavy layers of SQL handlers, indexing systems, profiling system evacuation (for PostgreSQL), etc. Such a solution provides the most efficient performance, lowest cost of implementation and scaling.

Advantages:

 * RDBMS is too slow to have a heavy layer of SQL cursors, heavily scaled;
 * RDBMS are not good enough in terms of index concurrency (concurrent processing of requests);
 * Too much cost solutions RDBMS to store small amounts of data;
 * No need for SQL queries, indexes, triggers, stored procedures, temporary tables, forms, views, etc;
 * Key/value database is easily scalable and high-performance due to its lightness.

Disadvantages:

 * Limitations of relational databases ensure data integrity at the lowest level. In stores key/value no such restriction. Data integrity controled by applications. In this case data integrity may be compromised due to errors in the application code;
 * In an RDBMS if you are well designed model, the database will contain a logical structure that fully reflects the structure of the stored data and can be differs with the structure of the application (the data are independent from the application). For a key/value storage of this is harder to achieve.

Examples of databases:

 * [Amazon DynamoDB](http://aws.amazon.com/dynamodb/)
 * [Riak](http://docs.basho.com/riak/latest/)
 * [Redis](http://redis.io/)
 * [LevelDB](https://code.google.com/p/leveldb/)
 * [Scalaris](https://code.google.com/p/scalaris/)
 * [MemcacheDB](http://memcachedb.org/)
 * [Kyoto Cabinet](http://fallabs.com/kyotocabinet/)

## Document Store

# TODO: finish here

Are programs designed to store, search, and manage document-oriented information (semi-structured data). The central concept is a document. Implementation of the specific document-oriented database is different, but in general, they suggest, encapsulation and encryption of data (documents) in several standard formats: XML, YAML, JSON, BSON, PDF, etc.

Advantages:


Examples of such databases:

* [MongoDB](http://www.mongodb.org/)
* [Couchbase](http://www.couchbase.com/)
* [CouchDB](http://couchdb.apache.org/)
* [RethinkDB](http://www.rethinkdb.com/)

## Graph Databases

A graph database is a database that uses graph structures with nodes, edges, and properties to represent and store data.

Examples of such databases:

 * [Neo4j](http://www.neo4j.org/)
 * [FlockDB](https://github.com/twitter/flockdb)
 * [InfoGrid](http://infogrid.org/trac/)

## Multimodel Databases

These databases includes features of multiple databases.

Examples of such databases:

 * [ArangoDB](http://www.arangodb.org/)
 * [Aerospike](http://www.aerospike.com/)
 * [Datomic](http://www.datomic.com/)

## Object Databases

Database in which the data are modeled as objects, their attributes, methods, and classes. Object-oriented databases are usually recommended for those applications that require high-performance data processing, which have a complex structure.

Advantages:

 * The object model is the best display of the real world, rather than relational tuples. This is especially true of complex and multi-faceted objects;
 * Organize your data with hierarchical characteristics;
 * To access the data is not required separate query language, because access is directly to objects. Nevertheless, the possibility exists to use the queries;
 * In a typical application, built on the use of object-oriented programming language and RDBMS, a significant amount of time is usually spent on interconnecting tables and objects.

Disadvantages:

 * In the RDBMS schema change as a result of the creation, modification or deletion of tables usually do not depend on the application. In applications that work with object database, schema change class usually means that changes must be made in the other application classes that are associated with this class. This leads to the necessity of correction of the whole system;
 * Object database usually tied to a particular language with a separate API and data are available only through the API. RDBMS in this regard is a great opportunity, thanks to the common query language;
 * In an RDBMS, the relational nature of the data allows the construction of ad-hoc queries, where you can combine the different tables. In object database possible to duplicate the semantics of the connection between two tables of two classes, so in this case the RDBMS more flexible. Requests that can be executed on the data in object database, are more dependent on the design of the system.

Examples of such databases:

 * [VelocityDB](http://www.velocitydb.com/)
 * [Objectivity](http://www.objectivity.com/)
 * [ZODB](http://www.zodb.org/en/latest/)
 * [Siaqodb](http://siaqodb.com/)
 * [EyeDB](http://www.eyedb.org/)


## Multidimensional Databases

Database optimization for online analytical processing. Can receive data from a variety of relational databases and a certain way to structure the information into categories and sections that may be available in certain ways the coordinates.

Examples of such databases:

 * [GlobalsDB](http://globalsdb.org/)
 * [Intersystems Cache](http://www.intersystems.com/cache/index.html)
 * [SciDB](http://scidb.org/)
 * [Rasdaman](http://www.rasdaman.org/)

## Multivalue Databases

Variety of multi-dimensional database. Main feature is support the use of attributes that can store a list of values.

Examples of such databases:

 * [Rocket U2](http://www.rocketsoftware.com/brand/rocket-u2)
 * [OpenInsight](http://www.revsoft.co.uk/openinsight.aspx)
 * [Reality](http://www.northgate-reality.com/)

# Conclusion

NoSQL movement is gaining popularity with enormous speed. However, this does not mean that relational databases are rudimentary or something archaic. Most likely they will be used, and used still active, but more in a symbiotic relationship with them will be performing NoSQL database. We are entering an era of polyglot persistence - an era when to use the different needs of different data warehouse. Now there is no monopoly of relational databases, as there is no alternative source of data. Increasingly, architects are selected based on the nature of the storage of the data itself and how we want them to manipulate what volumes of data expected.

*That’s all folks!* Thank you for reading till the end.