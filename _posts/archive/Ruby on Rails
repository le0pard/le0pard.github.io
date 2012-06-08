---
layout: post
title: acts_as_taggable + will_paginate = работаем вместе
wordpress_id: 897
wordpress_url: http://leopard.in.ua/?p=897
categories:
- Ruby
- Ruby on Rails
tags:
- Ruby
- Ruby on Rails
---
Представте, что вы разрабатываете небольшой блог на Ruby on Rails. Понятное дело там будет постраничный вывод статей и теги для статей (иначе не кавайно по другому :)). Но тут возникает одна проблема. Вы например вывели облако тегов на страницу для пользователя. И при нажатии пользователю на тег должны выводится статьи, которые помечены только этим тегом. А если статей много? Тогда нужен еще и постраничный вывод. Плагин acts_as_taggable не позволяет нам такое сделать. Как же быть? Очень просто.<!--more-->Создаем в папку lib нашего Rails приложения файл paginated_tags.rb (RAILS_ROOT/lib/paginated_tags.rb) и добавим туда такой контент:<pre lang="ruby">module ActiveRecord  module Acts #:nodoc:    module Taggable #:nodoc:      module SingletonMethods        def find_tagged_with(list,*args)          #build the limit sql          options = args.last.is_a?(Hash) ? args.pop.symbolize_keys : {}          limit,offset = options.delete(:limit), options.delete(:offset)unless options.empty?          scope =  (limit &amp;&amp; offset) ? "LIMIT #{offset}, #{limit}" : ""          find_by_sql([            "SELECT #{table_name}.* FROM #{table_name}, tags, taggings "+            "WHERE #{table_name}.#{primary_key} = taggings.taggable_id "+            "AND taggings.taggable_type = ? " +            "AND taggings.tag_id = tags.id AND tags.name IN (?)#{scope}",            acts_as_taggable_options[:taggable_type], list          ])        end        #will_paginate will call find_all_tagged_with        alias find_all_tagged_with find_tagged_with      end    end  endend</pre>Все! Теперь что бы взять страничный вывод по тегу делаем такой вызов<pre lang="ruby">stories = Story.paginate_tagged_with("goo", :total_entries =&gt; 2,  :page =&gt; params[:page])</pre>
