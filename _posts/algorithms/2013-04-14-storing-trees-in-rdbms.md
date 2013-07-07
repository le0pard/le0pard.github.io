---
layout: post
title: Storing the tree structures in the RDBMS
date: 2013-04-14 00:00:00
categories:
- algorithms
tags:
- algorithms
- rdbms
- trees
published: false
---
Hello my dear friends. Today we will talk storing the tree structures in the RDBMS (Relational database management system: MySQL, PostgreSQL, Oracle, etc).

This topic for some programmers may seem a simple. If you know of such words as "Nested Sets" and "Materialized Path", then this article will not tell you anything new. The main reason to the writing of this post were the frequent discussion of the topic about storing of tree structures in RDBMS on conferences after my talks about PostgreSQL. I was surprised that many people only know "parent-child" pattern for storing of tree structures. In this article I want to talk about this patterns. Of course, for building complex systems you have much to think about the possibility of using a relational database for this purpose and may consider other options, like Neo4j or FlockDB.

# Parent-child

This is the most common and simple pattern for storing trees. Numerous implementation can be seen in various forums, commenting systems, etc. The essence of this pattern is seen in the picture - each element holds a reference (ID) to the parent as a foreign key (on the picture, PK - primary key, FK - foreign key). A typical one-to-many relationship.

### Adding and Editing

No problem with adding and changing elements in the tree - just specify the ID of parent and you're done.

### Removal

More difficult with removal. When you delete an item simply a problem of lost children, so you have to keep track of the application and remove the member to implement the logic that has child items removed. Typical solutions: do not delete an item, mark it as deleted and transferred to the direct descendants of the subordination of the parent of the deleted carry all descendants (direct and indirect - ie, grandchildren) of the root.

### Selection

This is the problem area for this pattern. Possibilities of simple select is small. In essence, this pattern makes it possible to choose only all direct descendants of the item. Selecting all the descendants, direct and indirect, building the path from the root (the choice of all parents) - recursive functions are implemented in the application or multiple JOINs.

### The number of elements and levels of nesting

The number of elements and levels of nesting are virtually endless, independent of the dimension of the field ID.

### Summary

The pattern is very easy to add and move items. Well suited for frequently changing structures often added data, multiple uploads. For this performance will have to pay decrease in performance when fetching data and often very significant price.

# Materialized Path

Despite the terrible name, this is a very common pattern that is closest to the common human logic. With this pattern we encounter all the time, just do not know what it's called. Library lists, URL in the browser and even the Bible. The essence of this pattern consist in the fact that each element stores the full path from the root itself. For example, "Part 22, Section 8, Chapter 21, paragraph 2".

### Adding and Editing

More difficult than in the "Parent-child" pattern. To add an item, you need to get the path (ID) parent and add to it your ID. More difficult with the change of item, it is necessary to recalculate ID (actually - calculate the way), all the children, both direct and indirect.

### Removal

More interesting with the removal. The simple removal of any element doesn't involving violations of the tree integrity. Descendants of the deleted item still are indirect descendants of the remote parent. Children of dead parents isn't orphans, they have grandparents :)

### Selection

This is the strong point of this pattern. For the selection with simple queries can use various options that cause headaches when using the "parent-child" pattern. ID of all parents (full path) from the root isn't a problems at all. For example, all the descendants of the direct and indirect you can select by this SQL: "SELECT * FROM ... WHERE ID LIKE '00010001% '". It is very convenient for the construction of various directories - such as a request, "the first three sections with the largest number of elements, including nested" is realized much easier without a lot of recursive calls.

### The number of elements and levels of nesting

Designing these parameters entirely on the conscience of the developer. In fact, an infinite number of levels of need does not happen very often - if the nesting of sections on the web site to get near 20, it is necessary to think about the redevelopment of the site, rather than an increase in the levels. Implementations of the method vary. Field using ID-way can be bit or text types. A text box can contain elements separated by some character such as a point (1.1.2.5) or a backslash ('\test\chapter\hello'). For ease of operation with a text field typically use a fixed number of characters for each level, supplemented by, for example, zeros (0001000100020005 - a fourth level of 4 characters each). This makes it easy to determine the length of the line level, get the parent ID, etc. Besides, who said that the numbering should be used only numbers? Adding to the Latin alphabet chart, we get numbers in the 36-hexadecimal number (10 digits + 26 letters).

### Summary

This pattern can be use for frequent selection and additions, with minimal structural changes. Careful planning of the system identifier, it is impossible to apply the auto-increment field, i.e. ID formation rests on the shoulders of the programmer. ID type VARCHAR (255) is also not encouraging, especially fans of semantics - because the text box, the horror (!), stores do not text data.

# Nested Sets

The pattern is somewhat more difficult to understand. The idea is similar to the previous pattern - to simplify the selection of children. Unlike "Materialized Path", item not explicitly stores path information. But lets figure out a way, based on the ID of the element. For this item stores not only your place, but also ID neighbors of the same level. If the neighbor is not on the same level, the stored ID of the level above. In the figure above, item 1 knows that his neighbor "to the left" - 0, "right" - 3. The element with the number 3 - the neighbors 1 and 9, the element 6 - 5 and 9. How many elements, child elements 3? 9 - 3 = 6 (including the element 3). Or 9 - 3 - 1 = 5 (excluding the element number 3). What are the parents of the element 7? All elements whose "neighbors left" less than 7 (ID) and the "right-hand man" for more than 7 (ID). Under this request fall 6. Figure I was a bit unreadable. "Left" and "right" to receive "top" and "bottom". But for people accustomed to thinking rows of tables.

### Adding and Editing

It is extremely costly procedure, requiring a recalculation of his ID, and the numbers of neighbors, and restated the corresponding fields from neighbors and parents. The average conversion will affect half (sic!) of records in a table.

### Removal

Removing, in theory, too costly procedure also requires recalculation of borders and ID. However, it is possible to delay and run background job, or do as scheduled. Simply removing the element does not entail loss of the tree of child elements, they also fall within the boundaries of the parents and the parents become subject parent. Thus, when removing the element 6, the elements 7 and 8 will belong element 3.

### Selection

For this and had all the bells and whistles. As described above, ID subsidiaries, direct and indirect, of elements (and number) you can calculate it simply, without going to the database. Provided, of course, that the elements are properly disposed of, with the conversion boundaries. Well, ID elements must be integers. Construction path to the root as described above.

### The number of elements and levels of nesting

It is also a strong point of the pattern. The number of elements and levels of nesting, as in the first case of the "parent-child" depends on the implementation of integer fields in the database and can not allow the designer. Well, up to certain limits, of course.

### Summary

Suitable for frequent selection and rare additions or changes. Restriction on nesting is no pressure on the brain and does not require preliminary calculations. It is suitable for various directories. For example, product catalogs. There is an interesting modification of this method is based on the fact that the ID can not be integers, and the boundaries do not touch each other. After all, if my picture to imagine that the item has one "right" (bottom) of the No 3 and 2.3 (two point three) then we still have a place for painless insertion elements. The main requirement is to calculate the boundary element to be added to the "gap", ie inserting the component between 1 and 3, to install it, and the left border 2.4 2.8 Right, i.e. always keep a free interval. When using this method can get your item with ID infinitesimal.

# Summary

Of course, this is only the most common solutions, for sure there are techniques that I don't know. Relational database (RDBMS) are generally not very well suited for storing tree structures, but that's another topic. We must choose with the planned action and to put up with certain disadvantages in each case. The main thing is that there are plenty to choose from.

