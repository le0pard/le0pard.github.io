---
layout: page
title: Leopard Blog
tagline: Anything is possible, the impossible becomes longer
---
{% include JB/setup %}

<ul class="posts">
  {% for post in site.posts limit:50 %}
    {% unless post.draft %}
      <li><span>{{ post.date | date_to_string }}</span> &raquo; <a href="{{ BASE_PATH }}{{ post.url }}">{{ post.title }}</a></li>
    {% endunless %}
  {% endfor %}
</ul>

## About Me

Alexei Vassiliev, a developer and administrator. At the moment working in Railsware. Developed products such as: [PopCornUA](http://popcornua.coocoorooza.com/), [MongodbLogger](http://mongodb-logger.catware.org/), [SmtRails](http://smt.rw.rw/), [PIRO](http://piro.railsware.com/), and others. Alex is also known as the creator of Open Source manual for setting up and scaling [PostgreSQL](http://postgresql.leopard.in.ua/).



