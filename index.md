---
layout: page
title: Leopard Blog
tagline: Anything is possible, the impossible becomes longer
---
{% include JB/setup %}

<ul class="posts">
  {% for post in site.posts limit:50 %}
    <li><span>{{ post.date | date_to_string }}</span> &raquo; <a href="{{ BASE_PATH }}{{ post.url }}">{{ post.title }}</a></li>
  {% endfor %}
</ul>

## To-Do

This theme is still unfinished. If you'd like to be added as a contributor, [please fork](http://github.com/plusjade/jekyll-bootstrap)!
We need to clean up the themes, make theme usage guides with theme-specific markup examples.


