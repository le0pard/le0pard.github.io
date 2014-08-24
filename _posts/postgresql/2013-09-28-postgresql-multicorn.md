---
layout: post
title: Multicorn - powerful foreign data wrapper for PostgreSQL
date: 2013-09-28 00:00:00
categories:
- postgresql
tags:
- postgresql
- fdw
- multicorn
---

Hello my dear friends. In this article I will talk about Multicorn: what is this, how to install it and use it with PostgreSQL.

# What is Multicorn?

[Multicorn](http://multicorn.org/) is a PostgreSQL 9.1+ extension meant to make [Foreign Data Wrapper](http://wiki.postgresql.org/wiki/Foreign_data_wrappers) development easy, by allowing the programmer to use the Python programming language. "Foreign Data Wrappers" (FDW) were introduced in PostgreSQL 9.1, providing a way of accessing external data sources from within PostgreSQL using SQL.

# Install

For installing Multicorn I will use Ubuntu. First, we need install some packages:

{% highlight bash %}
$ sudo aptitude install build-essential postgresql-server-dev-9.3 python-dev python-setuptools
{% endhighlight %}

We can install Multicorn by using [pgxn client](http://pgxnclient.projects.postgresql.org/) or from source. I prefer install from source:

{% highlight bash %}
$ git clone git@github.com:Kozea/Multicorn.git
$ cd Multicorn
$ make
$ sudo make install
{% endhighlight %}

To complete the installation we need to enable the extension in the database:

{% highlight sql %}
=# CREATE EXTENSION multicorn;
CREATE EXTENSION
{% endhighlight %}

Now let consider how to use it.

# Usage

## RDBMS databases

For connection to another RDBMS database Multicorn use [SQLalchemy](http://www.sqlalchemy.org/) library. It support MySQL, PostgreSQL, Microsoft SQL Server, and [more](http://docs.sqlalchemy.org/en/latest/dialects/). Let's try how it is work with MySQL. First of all we should install additional libs:

{% highlight bash %}
$ sudo aptitude install python-sqlalchemy python-mysqldb
{% endhighlight %}

In MySQL database "testing" we have table "companies":

{% highlight bash %}
$ mysql -u root -p testing

mysql> SELECT * FROM companies;
+----+---------------------+---------------------+
| id | created_at          | updated_at          |
+----+---------------------+---------------------+
|  1 | 2013-07-16 14:06:09 | 2013-07-16 14:06:09 |
|  2 | 2013-07-16 14:30:00 | 2013-07-16 14:30:00 |
|  3 | 2013-07-16 14:33:41 | 2013-07-16 14:33:41 |
|  4 | 2013-07-16 14:38:42 | 2013-07-16 14:38:42 |
|  5 | 2013-07-19 14:38:29 | 2013-07-19 14:38:29 |
+----+---------------------+---------------------+
5 rows in set (0.00 sec)
{% endhighlight %}

First of all we should create server for FDW in PostgreSQL:

{% highlight sql %}
=# CREATE SERVER alchemy_srv foreign data wrapper multicorn options (
    wrapper 'multicorn.sqlalchemyfdw.SqlAlchemyFdw'
);
CREATE SERVER
{% endhighlight %}

Now we can create foreign table, which will contain data from MySQL table "companies" (I called this table in PostgreSQL "mysql_companies"):

{% highlight sql %}
=# CREATE FOREIGN TABLE mysql_companies (
  id integer,
  created_at timestamp without time zone,
  updated_at timestamp without time zone
) server alchemy_srv options (
  tablename 'companies',
  db_url 'mysql://root:password@127.0.0.1/testing'
);
CREATE FOREIGN TABLE
{% endhighlight %}

Main options:

* db_url (string) - an sqlalchemy connection string (examples: "mysql://&lt;user&gt;:&lt;password&gt;@&lt;host&gt;/&lt;dbname&gt;", "mssql: mssql://&lt;user&gt;:&lt;password&gt;@&lt;dsname&gt;"). See the [sqlalchemy dialects documentation](http://docs.sqlalchemy.org/en/latest/dialects/).
* tablename (string) - the table name in the remote RDBMS.

And now we can check how it is work:

{% highlight sql %}
=# SELECT * FROM mysql_companies;
 id |     created_at      |     updated_at
----+---------------------+---------------------
  1 | 2013-07-16 14:06:09 | 2013-07-16 14:06:09
  2 | 2013-07-16 14:30:00 | 2013-07-16 14:30:00
  3 | 2013-07-16 14:33:41 | 2013-07-16 14:33:41
  4 | 2013-07-16 14:38:42 | 2013-07-16 14:38:42
  5 | 2013-07-19 14:38:29 | 2013-07-19 14:38:29
(5 rows)
{% endhighlight %}

As you can see, it is work.


## IMAP servers

We can use Multicorn to get your emails from inbox by IMAP protocol. We need install additional libraries:

{% highlight bash %}
$ sudo aptitude install python-pip
$ sudo pip install imapclient
{% endhighlight %}

Next steps similar to previous. We should create server and table, where we will get data:

{% highlight sql %}
=# CREATE SERVER multicorn_imap FOREIGN DATA WRAPPER multicorn options ( wrapper 'multicorn.imapfdw.ImapFdw' );
CREATE SERVER
=# CREATE FOREIGN TABLE my_inbox (
    "Message-ID" character varying,
    "From" character varying,
    "Subject" character varying,
    "payload" character varying,
    "flags" character varying[],
    "To" character varying) server multicorn_imap options (
        host 'imap.gmail.com',
        port '993',
        payload_column 'payload',
        flags_column 'flags',
        ssl 'True',
        login 'example@gmail.com',
        password 'supersecretpassword'
);
CREATE FOREIGN TABLE
{% endhighlight %}

Main options:

* host (string) - the IMAP host to connect to.
* port (string) - the IMAP host port to connect to.
* login (string) - the login to connect with.
* password (string) - the password to connect with.
* payload\_column (string) - the name of the column which will store the payload.
* flags\_column (string) - the name of the column which will store the IMAP flags, as an array of strings.
* ssl (boolean) - wether to use ssl or not.
* imap\_server\_charset (string) - the name of the charset used for IMAP search commands. Defaults to UTF8. For the cyrus IMAP server, it should be set to "utf-8".

And we can read emails from inbox by using table "my_inbox":

{% highlight sql %}
=# SELECT flags, "Subject", payload FROM my_inbox LIMIT 10;
   flags    |      Subject      |       payload
------------+-------------------+---------------------
 {"\\Seen"} | Test email        | Test email\r       +
            |                   |
 {"\\Seen"} | Test second email | Test second email\r+
            |                   |
(2 rows)
{% endhighlight %}

Added flag to email "Test email":

{% highlight sql %}
=# SELECT flags, "Subject", payload FROM my_inbox LIMIT 10;
                flags                 |      Subject      |       payload
--------------------------------------+-------------------+---------------------
 {$MailFlagBit1,"\\Flagged","\\Seen"} | Test email        | Test email\r       +
                                      |                   |
 {"\\Seen"}                           | Test second email | Test second email\r+
                                      |                   |
(2 rows)
{% endhighlight %}

It's work.

## RSS source

Multicorn can get use RSS as source of information. Again, we need install additional libraries:

{% highlight bash %}
$ sudo aptitude install python-lxml
{% endhighlight %}

We should create server and table, where we will get data:

{% highlight sql %}
=# CREATE SERVER rss_srv foreign data wrapper multicorn options (
    wrapper 'multicorn.rssfdw.RssFdw'
);
CREATE SERVER
=# CREATE FOREIGN TABLE my_rss (
    "pubDate" timestamp,
    description character varying,
    title character varying,
    link character varying
) server rss_srv options (
    url     'http://news.yahoo.com/rss/entertainment'
);
CREATE FOREIGN TABLE
{% endhighlight %}

Main options:

* url (string) - the RSS feed URL.

Also, you should be sure, what your database use UTF-8 charset. Because in another encodings you can get errors :)

{% highlight sql %}
=# SELECT "pubDate", title, link from my_rss ORDER BY "pubDate" DESC LIMIT 10;
       pubDate       |                       title                        |                                         link
---------------------+----------------------------------------------------+--------------------------------------------------------------------------------------
 2013-09-28 14:11:58 | Royal Mint coins to mark Prince George christening | http://news.yahoo.com/royal-mint-coins-mark-prince-george-christening-115906242.html
 2013-09-28 11:47:03 | Miss Philippines wins Miss World in Indonesia      | http://news.yahoo.com/miss-philippines-wins-miss-world-indonesia-144544381.html
 2013-09-28 10:59:15 | Billionaire's daughter in NJ court in will dispute | http://news.yahoo.com/billionaires-daughter-nj-court-dispute-144432331.html
 2013-09-28 08:40:42 | Security tight at Miss World final in Indonesia    | http://news.yahoo.com/security-tight-miss-world-final-indonesia-123714041.html
 2013-09-28 08:17:52 | Guest lineups for the Sunday news shows            | http://news.yahoo.com/guest-lineups-sunday-news-shows-183815643.html
 2013-09-28 07:37:02 | Security tight at Miss World crowning in Indonesia | http://news.yahoo.com/security-tight-miss-world-crowning-indonesia-113634310.html
 2013-09-27 20:49:32 | Simons stamps his natural mark on Dior             | http://news.yahoo.com/simons-stamps-natural-mark-dior-223848528.html
 2013-09-27 19:50:30 | Jackson jury ends deliberations until Tuesday      | http://news.yahoo.com/jackson-jury-ends-deliberations-until-tuesday-235030969.html
 2013-09-27 19:23:40 | Eric Clapton-owned Richter painting to sell in NYC | http://news.yahoo.com/eric-clapton-owned-richter-painting-sell-nyc-201447252.html
 2013-09-27 19:14:15 | Report: Hollywood is less gay-friendly off-screen  | http://news.yahoo.com/report-hollywood-less-gay-friendly-off-screen-231415235.html
(10 rows)
{% endhighlight %}

## CSV source

This FDW can be used to access data stored in CSV files. We should create server and table, where we will get data:

{% highlight sql %}
=# CREATE SERVER csv_srv foreign data wrapper multicorn options (
    wrapper 'multicorn.csvfdw.CsvFdw'
);
CREATE SERVER
=# CREATE FOREIGN TABLE csvtest (
       sort_order numeric,
       common_name character varying,
       formal_name character varying,
       main_type character varying,
       sub_type character varying,
       sovereignty character varying,
       capital character varying
) server csv_srv options (
       filename '/var/data/countrylist.csv',
       skip_header '1',
       delimiter ',');
CREATE FOREIGN TABLE
{% endhighlight %}

Main options:

* filename (string) - the full path to the CSV file containing the data. This file must be readable to the postgres user.
* delimiter (character) - the CSV delimiter (defaults to ",").
* quotechar (character) - the CSV quote character (defaults to ").
* skip\_header (integer) - the number of lines to skip (defaults to 0).

Let's check how it work:

{% highlight sql %}
=# SELECT * FROM csvtest LIMIT 10;
sort_order |     common_name     |               formal_name               |     main_type     | sub_type | sovereignty |     capital
------------+---------------------+-----------------------------------------+-------------------+----------+-------------+------------------
         1 | Afghanistan         | Islamic State of Afghanistan            | Independent State |          |             | Kabul
         2 | Albania             | Republic of Albania                     | Independent State |          |             | Tirana
         3 | Algeria             | People's Democratic Republic of Algeria | Independent State |          |             | Algiers
         4 | Andorra             | Principality of Andorra                 | Independent State |          |             | Andorra la Vella
         5 | Angola              | Republic of Angola                      | Independent State |          |             | Luanda
         6 | Antigua and Barbuda |                                         | Independent State |          |             | Saint John's
         7 | Argentina           | Argentine Republic                      | Independent State |          |             | Buenos Aires
         8 | Armenia             | Republic of Armenia                     | Independent State |          |             | Yerevan
         9 | Australia           | Commonwealth of Australia               | Independent State |          |             | Canberra
        10 | Austria             | Republic of Austria                     | Independent State |          |             | Vienna
(10 rows)
{% endhighlight %}


## Another FDWs

The Multicorn also contain LDAP and FileSystem Foreign Data Wrappers. LDAP FDW can be used to access directory servers via the LDAP protocol. FileSystem FDW can be used to access data stored in various files, in a filesystem.


## Your custom FDWs

Multicorn provides a simple interface for writing own foreign data wrappers. More information you can find [here](http://multicorn.org/implementing-an-fdw/).

# PostgreSQL 9.3+

The original implementation of FDWs in PostgreSQL 9.1 and 9.2 was read-only, but in PostgreSQL 9.3 FDWs also have write access as well. Right now Multicorn support write access API in version >= 1.0.0.

# Conclusion

As you can be seen, Multicorn is very useful extensions, which provide for PostgreSQL communicate with many external types of data source and provide for Python developers create own custom FDW for PostgreSQL.

*That’s all folks!* Thank you for reading till the end.