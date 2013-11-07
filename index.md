---
layout: page
title: Alexey Vasiliev aka leopard
tagline: Anything is possible, the impossible becomes longer
---
{% include JB/setup %}

Hello everyone. My name Alexey Vasiliev (leopard). I am a web developer and Linux administrator. [My main projects](/projects.html).

## Posts

<ul class="posts">
  {% for post in site.posts limit:30 %}
    <li><span>{{ post.date | date_to_string }}</span> &raquo; <a href="{{ BASE_PATH }}{{ post.url }}">{{ post.title }}</a></li>
  {% endfor %}
</ul>
