---
layout: post
title: MongodbLogger 0.4.0 for Rails 3. What's new?
categories: 
- rails
tags: 
- rails
- mongodb
- logger
---
Hello my dear friends. 

I just released a new version of my gem - [MongodbLogger](http://mongodb-logger.catware.org/) version 0.4.0. What is changed in this version?

* MongodbLogger from now support adapters. Old version supported only [mongo gem](https://github.com/mongodb/mongo-ruby-driver) (official ruby adapter), but many developers using in own project [Mongoid](http://mongoid.org/) (this gem has own version of MongoDB adapter - [Moped](http://mongoid.org/en/moped/)). So I removed adapters dependency from MongodbLogger gem, and you must select yourself what adapter want to use with my gem. Also, MongodbLogger is compatible with Mongoid 3 - you can use both in the same Rails application.

* Changed Google Charts to [Rickshaw](http://code.shutterstock.com/rickshaw/). Google Charts is very powerful charts, but sometimes it created delays in the MongodbLogger web interface.

* By default MongodbLogger also write session information in logs.

* Changed param "safe\_insert" to "write\_options", because "safe" options is deprecated in mongo adapter. Detailed information about this option you can read [here](https://github.com/mongodb/mongo-ruby-driver/wiki/Write-Concern).

* Refactored huge amount of code in the gem. Finally, I found the time for this!

More information about MongodbLogger you can found by this links:

* [MongodbLogger page](http://mongodb-logger.catware.org/)
* [Github page](https://github.com/le0pard/mongodb_logger)
* [Demo application](http://demo-mongodb-logger.catware.org/)
* [Old article (russian)](http://leopard.in.ua/2011/12/09/mongodblogger-skladyvaem-logi-vashego-rails-3-prilozheniya-v-mongodb/)

*That’s all folks!* Thank you for reading till the end.