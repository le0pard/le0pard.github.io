---
layout: post
title: Storing the tree structures in the RDBMS
categories:
- algorithms
tags:
- algorithms
- rdbms
- trees
published: false
---
Hello my dear friends. Today we will talk about storing the tree structures in the RDBMS (Relational database management system: MySQL, PostgreSQL, Oracle, etc).

For some programmers this topic can be simple. If you know such words as "Nested Sets" and "Materialized Path", so you will not find something new for yourself in this article. The main reason for writing this post was frequent discussions about storing tree structures in RDBMS after conferences about PostgreSQL where I was a speaker. I was surprised that a lot of people know just "parent-child" pattern for storing tree structures. In this article I would like to talk about these patterns. Of course, for building complex systems you have to think about the possibility of using a relational database for this purpose and may consider other options, like Neo4j or FlockDB.

# Parent-child

This is the most common and simple pattern for storing trees. Numerous of implementations can be seen in various forums, commenting systems, etc. The essence of this pattern is seen on the picture - each element holds a reference (ID) to the parent as a foreign key (on the picture, PK - primary key, FK - foreign key). It is a typical one-to-many relationship.

### Adding and Editing

No problem with adding and changing elements in the tree - just specify the ID of parent and your job is done.

### Removal

Removal is more difficult case. When you just delete an item the problem of lost children is appear. So you have to keep track the application and implement the logic that children of this item should be removed. Typical solution is: don’t delete item, mark it as deleted and transferred this to the direct descendant and then to their direct descendants and so on. It means that you all descendants (direct and indirect - ie, grandchildren) of the root will be marked as deleted.

### Selection

It is a problem area of this pattern. There are not a lot of possibilities of simple selection. In essence, this pattern allows you to choose only all direct descendants of the item. Selecting all the descendants, direct and indirect, building the path from the root (the choice of all parents), recursive functions are implemented in the application or multiple JOINs.

### The number of elements and levels of nesting

The number of elements and levels of nesting are virtually endless, and are independent of the dimension of the field ID.

### Summary

If you use this pattern the procedures of adding and moving items would be very simple. Also it suites well for frequent changes of structures (often added data, multiple uploads). But there is a payment for this simplicity and often price is very significant. In this case price would be in decreasing of performance when you fetch data.

# Materialized Path

Despite the terrible name, this is a very common pattern that is closest to the common human logic. With this pattern we encounter all the time, just without knowing its title. For example, library lists, URL in the browser and even the Bible. The essence of this pattern is that the each element stores the full path from the root itself. For example, "Part 22, Section 8, Chapter 21, paragraph 2".

### Adding and Editing

More difficult than in the "Parent-child" pattern. To add an item, you should get parent’s path (ID) and add to it your ID. More difficult it would be with the change of the item. You should recalculate ID (actually - calculate the way) of all children, both direct and indirect.

### Removal

Removal of item is more interesting question. The simple removal of any element doesn't involve violations of the tree integrity. Descendants of the deleted item are still indirect descendants of the remote parent. Children of dead parents aren’t orphans, they have grandparents :)

### Selection

This is the strength of this pattern. For the selection with simple queries you can use various options using which in case of "parent-child" pattern you would have a lot of headaches. ID of all parents (full path) from the root isn't a problem at all. For example, all direct and indirect descendants you can select using this SQL: "SELECT * FROM ... WHERE ID LIKE '00010001% '". It is very convenient to use this pattern for the construction in various directories - such as a request, "the first three sections with the largest number of elements, including nested". As you can realize it is very easy without a lot of recursive calls.

### The number of elements and levels of nesting

Design these parameters are entirely on the conscience of the developer. In fact, the need of the infinite number of levels does not happen very often - if the nesting of sections on the web site gets to near 20, maybe you should think about the redevelopment of the site, rather than increasing of the levels. There are different implementations of the method. Type of data in field in the ID-way can be bit or text types. A text box can contain elements which are separated by some character such as a point (1.1.2.5) or a backslash ('\test\chapter\hello'). For ease if the operation with a text field a fixed number of characters for each level are typically used, supplemented by, for example, zeros (0001000100020005 - a fourth level of 4 characters each). This makes it easy to determine the length of the line level, get the parent ID, etc. Besides, who said that for numbering only numbers can be used? If we add to the Latin alphabet chart, we will get numbers in the 36-hexadecimal number (10 digits + 26 letters).

### Summary

This pattern can be used for frequent selection and additions with minimal structural changes. With careful planning of the system’s identifier, it is impossible to apply the auto-increment field, i.e. ID formation rests on the shoulders of the programmer. ID type VARCHAR (255) is also not encouraging, especially for fans of semantics - because the text box, the horror (!), stores not only text data.

# Nested Sets

The pattern is more difficult to understand. The idea is similar to the previous pattern - to simplify the selection of children. Unlike "Materialized Path", item does not store explicitly path information. But let’s consider the pattern, based on the ID of the element. Not only your place, but also ID neighbors of the same level are stores for this item. If the neighbor is not on the same level, ID of the level above is stored. In the picture above, item 1 knows that his neighbor "to the left" - 0, "right" - 3. The element with the number 3 has neighbors 1 and 9, the element 6 - 5 and 9. How many elements, child element 3 have? 9 - 3 = 6 (including the element 3). Or 9 - 3 - 1 = 5 (excluding the element number 3). What are the parents of the element 7? All elements whose "neighbors left" less than 7 (ID) and the "right-hand man" for more than 7 (ID). Under this request fall 6. It was a bit unreadable. "Left" and "right" to receive "top" and "bottom". Not for people accustomed to think in rows of tables.

### Adding and Editing

It is extremely costly procedure, requiring a recalculation of the ID, and the numbers of neighbors, and restate of the corresponding fields from neighbors and parents. The average conversion will affect half (sic!) of records in a table.

### Removal

Removing, in theory, too costly procedure too, that also requires recalculation of borders and ID. However, it is possible to delay and run background job, or do it for schedule. Simply removing the element does not mean entail loss of the tree of the children elements, they also fall within the boundaries of the parents and the parents become subject parent. Thus, when removing the element 6, the elements 7 and 8 become belong to the element 3.

### Selection

All these bells and whistles are for this purpose. As was described above, ID subsidiaries, direct and indirect, of elements (and number) you can calculate simply, without using the database. Provided, of course, that the elements are properly disposed of, with the conversion boundaries. Well, ID elements must be integers. Construction path to the root are built as described above.

### The number of elements and levels of nesting

It is a strength of the pattern. The number of elements and levels of nesting, as in the "parent-child" pattern depends on the implementation of integer fields in the database and aren’t allowed to be designed. Well, up to certain limits, of course.

### Summary

This pattern is suitable for frequent selection and rare additions or changes. Restriction on nesting is not brain’s procedure and does not require preliminary calculations. It is suitable for various directories. For example, product catalogs. There is an interesting modification of this method is based on the fact that the ID can’t be integers, and the boundaries do not touch each other. After all, my picture should help you to realize the item has one "right" (bottom) of the # 3 and 2.3 (two point three) and we still have a place for painless insertion elements. The main requirement is to calculate the boundary element that would be added to the "gap", i.e. inserting the component between 1 and 3, to install it, and the left border 2.4 2.8. Right, i.e. is always keep a free interval. While using this method you can get your item with ID infinitesimal.

# Summary

Of course, these are only the most common solutions, and for sure there are techniques that I don't know about. Relational databases (RDBMS) are generally not very well suited for storing tree structures, but that's another topic. We should choose carefully what pattern to use because each of them has certain disadvantages. The main thing is that there are plenty to choose from.

