---
layout: post
title: PgTune - Tuning PostgreSQL config by your hardware
date: 2014-03-24 00:00:00
categories:
- postgresql
tags:
- postgresql
- pgtune
---

Hello my dear friends. In this article I will talk about my new little app - PgTune.

<a href="http://pgtune.leopard.in.ua/" target="_blank"><img src="/assets/images/postgresql/pgtune/pgtune.png" alt="pgtune" title="pgtune" width="200" height="200" class="aligncenter size-full" /></a>

# PgTune?

To optimize the settings for PostgreSQL based on maximizing performance for a given hardware configuration Gregory Smith in 2008 created a utility [pgtune](http://pgfoundry.org/projects/pgtune/). The utility is easy to use and in many Linux systems can go in packages. But exists several problems about this tool:

 * Not maintained (last release: October 29, 2009), what is why it have the old methods of calculation configurations for PostgreSQL
 * Need to download/install it for usage

What is why I created online version of [PgTune](http://pgtune.leopard.in.ua/). Main benefits:

 * Updated calculation for PostgreSQL config
 * Don't need to download or install anything
 * Can work offline
 * Can work as mobile application

And, of course, it is [open source](https://github.com/le0pard/pgtune).

## Offline mode

At the first loading of the page, you no longer need access to the Internet to use PgTune. It will work offline (without internet connection) by using [Application Cache](http://www.html5rocks.com/en/tutorials/appcache/beginner/) technology.

## Mobile app

We can "install" PgTune as mobile app, because the application can operate without access to the internet.

Steps for iOS:

 * Open up Safari on your iOS device
 * Navigate to the [PgTune](http://pgtune.leopard.in.ua/) page
 * Tap the Share button (it's an icon that’s a box with an arrow sticking out from it)
 * Tap on [Add to Home Screen](http://support.apple.com/kb/TI42)
 * On the next page you'll give the shortcut a name and confirm the web address
 * After that, tap on Add in the upper-right corner to add the PgTune app to your home screen

Steps for Android:

 * Open the browser on your Chrome Android
 * Navigate to the [PgTune](http://pgtune.leopard.in.ua/) page
 * Hit the settings button – it's three vertical dots, locating in the top right of the screen
 * Tap on "Add to Homescreen"
 * On the next page you'll give the shortcut a name
 * After that, tap on Ok button to add the PgTune app to your home screen

As you can see, it is very simple to add it as mobile app.

# Summary

PGTune calculate configuration for PostgreSQL based on the maximum performance for a given hardware configuration. It isn't a "silver bullet" for the optimization settings of PostgreSQL. Many settings depend not only on the hardware configuration, but also on the size of the database, the number of clients and the complexity of queries, so that optimally configure the database can only be given all these parameters. But I hope it will help to start of tunning PostgreSQL.

*That’s all folks!* Thank you for reading till the end.