---
layout: post
title: How to migrate from Wordpress blog to Jekyll
description: ""
categories: 
- ruby
tags: 
- ruby
- blog
draft: true
---
Hello my dear friends. Today we will talk how to migrate from Wordpress blog to Jekyll. [Jekyll](http://jekyllrb.com/) - is a simple, blog aware, static site generator. It takes a template directory (representing the raw form of a website), runs it through Textile or Markdown and Liquid converters, and spits out a complete, static website suitable for serving with Apache or your favorite web server. This is also the engine behind GitHub Pages, which you can use to host your project’s page or blog right here from GitHub.

# Installing and using Jekyll

First of all you need to install jekyll by rubygems:

    gem install jekyll
    
Next you should create folder which should contain some files and folders:

    -rw-r--r--   _config.yml
    drwxr-xr-x   _includes
    drwxr-xr-x   _layouts
    drwxr-xr-x   _posts
    
So just three folders and a configuration file. 

_\_config.yml_ stores configuration data. A majority of these options can be specified from the command line executable but it's easier to throw them in here so you don't have to remember them.

_\_includes_ these are the partials that can be mixed and matched by your _layouts and _posts to facilitate reuse. The liquid tag {% include file.ext %} can be used to include the partial in _includes/file.ext.

_\_layouts_ these are the templates which posts are inserted into. Layouts are chosen on a post-by-post basis in the YAML front matter, which is described in the next section. The liquid tag {{ content }} is used to inject data onto the page.

_\_posts_ your dynamic content, so to speak. The format of these files is important, as named as YEAR-MONTH-DAY-title.MARKUP. The Permalinks can be adjusted very flexibly for each post, but the date and markup language are determined solely by the file name.


# Configuration

Jekyll allows you to concoct your sites in any way you can dream up. Here's my current configuration file:

    permalink: /:year/:month/:day/:title 
    exclude: [".rvmrc", ".rbenv-version", "README.md", "Rakefile", "changelog.md"]
    auto: true
    pygments: true
    
More information you can read by [this link](https://github.com/mojombo/jekyll/wiki/Configuration).

# Importing posts from Wordpress

I [found and modify](https://github.com/le0pard/le0pard.github.com/blob/master/lib/wordpress.rb) little script, which help migrate from Wordpress to Jekyll. To import the existing posts from Wordpress, you can run the script as follows (in my case I had the script in the lib subfolder):

    ruby -r './lib/wordpress' -e 'WordPress::import("your wordpress db name", "db user", "db password", "table name prefix")'
    
Before this you should install needed gems:

    gem install sequel yajl-ruby activesupport
    
## Converting the imported posts to Markdown

This is not required. In my case, I didn't like the idea of having new posts in Markdown, mixed to old posts - imported from Wordpress - in HTML. Exists simple library [DownmarkIt](https://github.com/cousine/downmark_it), which convert HTML to Markdown. Here part of code from migration script:

    db[query].each do |post|
      ...
      content    = DownmarkIt.to_markdown post[:post_content]
      ...
    end
    
# Сompletion

Next you should create layout for your blog. The quickest way to start and publish your Jekyll powered blog you can use [Jekyll-Bootstrap](http://jekyllbootstrap.com/). It is 100% compatible with GitHub pages. 

*That’s all folks!* Thank you for reading till the end.