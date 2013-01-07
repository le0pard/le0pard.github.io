---
layout: post
title: Getting Started with Chef Solo. Part 3
categories:
- chef
tags:
- chef
- solo
draft: true
---
Hello my dear friends. Today we will continue talk about Chef Solo. All example code you can find here: [github.com/le0pard/chef-solo-example/tree/3.0](https://github.com/le0pard/chef-solo-example/tree/3.0).

In [the previous article](/2013/01/05/chef-solo-getting-started-part-2/) we learned Chef cookbook structure and wrote own Chef cookbook. In this article we will learn Chef roles and environments.

# Create your cloud

We learned how to successfully use the Chef to setup servers. In most cases you cloud contain several servers with the same configuration. For example, you can have several web servers and one load balancer, which balance on this web servers. Or you can have several database or queue servers with identical configuration. In this case, it is very hard way to clone each server by nodes, because you need copy all attributes from one node to another. Maintain a system with such nodes also will be hard: you will have to modify the "n" number of nodes to change some attribute value. In this case we need to use the [DRY](http://en.wikipedia.org/wiki/Don't_repeat_yourself). What we can do? We can distribute the server by roles!

In Chef kitchen we can create roles: web, database and queue roles. Nodes may use one or more roles with recipes. Let's look at an example.

# Our first Chef role

