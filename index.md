---
layout: page
title: Alexey Vasiliev aka leopard
tagline: Anything is possible, the impossible becomes longer
---
Hello everyone. My name Alexey Vasiliev. I am a Software Architect, Full-Stack Engineer and Podcaster.

## Posts

<ul class="posts">
  {% for post in site.posts limit:50 %}
    <li><span>{{ post.date | date_to_string }}</span> &raquo; <a href="{{ BASE_PATH }}{{ post.url }}">{{ post.title }}</a></li>
  {% endfor %}
</ul>