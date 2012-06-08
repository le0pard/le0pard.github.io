---
layout: post
title: Автоматическое сжатие JS и CSS
wordpress_id: 546
wordpress_url: http://leopard.in.ua/?p=546
categories:
- Ruby on Rails
tags:
- Ruby on Rails
---
Для Ruby on Rails есть хорошие плагины для сжатие JS и CSS.1) Rails-плагин [Smurf](http://gusg.us/2008/11/8/smurf-rails-javascript-css-auto-minifying-plugin) позволяет автоматически сжимать файлы JS и CSS, которые вызываются методами javascript_include_tag или stylesheet_link_tag с параметром :cache =&gt; true ([Smurf на GitHub](http://github.com/thumblemonks/smurf/tree/master)).2) [fixie_shrinker](http://github.com/joevandyk/fixie_shrinker/tree/master), использующем [YUI Compressor](http://developer.yahoo.com/yui/compressor) в своей работе.Упростим свою работу ;)
