---
layout: post
title: Getting Started with Chef Solo. Part 2
date: 2013-01-05 00:00:00
categories:
- chef
tags:
- chef
- solo
---

> **WARNING**: This article can be outdated. Better read my book about Chef: [Cooking Infrastructure by Chef](http://chef.leopard.in.ua/)

Hello my dear friends. Today we will continue to talk about Chef Solo. You can find all example code here: [github.com/le0pard/chef-solo-example/tree/2.0](https://github.com/le0pard/chef-solo-example/tree/2.0).

In [the previous article](/2013/01/04/chef-solo-getting-started-part-1/) we discussed how to use Chef Solo, learned about knife, librarian and vagrant tools, which help us to use and test Chef Solo kitchen. In this article we will learn cookbook structure and will write own cookbook.

# Cookbook

A cookbook is a collection of Chef recipes. All cookbooks like a Chef are written in [Ruby](http://www.ruby-lang.org/). You already have seen how we get nginx cookbook and use "source" recipe from it to install nginx on our server. Let's look at the structure of this cookbook:

{% highlight bash %}
$ ls -la cookbooks/nginx
total 112
drwxr-xr-x  16 leo  staff    544 Jan  4 19:24 .
drwxr-xr-x   6 leo  staff    204 Jan  4 19:24 ..
drwxr-xr-x  15 leo  staff    510 Jan  4 19:24 .git
-rw-r--r--   1 leo  staff     28 Jan  4 19:24 .gitignore
-rw-r--r--   1 leo  staff   3526 Jan  4 19:24 CHANGELOG.md
-rw-r--r--   1 leo  staff  10811 Jan  4 19:24 CONTRIBUTING.md
-rw-r--r--   1 leo  staff     37 Jan  4 19:24 Gemfile
-rw-r--r--   1 leo  staff  10850 Jan  4 19:24 LICENSE
-rw-r--r--   1 leo  staff  14633 Jan  4 19:24 README.md
drwxr-xr-x   8 leo  staff    272 Jan  4 19:24 attributes
drwxr-xr-x   3 leo  staff    102 Jan  4 19:24 definitions
drwxr-xr-x   3 leo  staff    102 Jan  4 19:24 files
-rw-r--r--@  1 leo  staff   3283 Jan  4 19:24 metadata.rb
drwxr-xr-x  20 leo  staff    680 Jan  4 19:24 recipes
drwxr-xr-x   5 leo  staff    170 Jan  4 19:24 templates
drwxr-xr-x   3 leo  staff    102 Jan  4 19:24 test
{% endhighlight %}

A cookbook can have:

 * metadata.rb - a file, which contain all information about the cookbook (name, dependencies).

{% highlight ruby %}
name              "nginx"
maintainer        "Opscode, Inc."
maintainer_email  "cookbooks@opscode.com"
license           "Apache 2.0"
description       "Installs and configures nginx"
version           "1.1.2"

recipe "nginx", "Installs nginx package and sets up configuration with Debian apache style with sites-enabled/sites-available"
recipe "nginx::source", "Installs nginx from source and sets up configuration with Debian apache style with sites-enabled/sites-available"

%w{ ubuntu debian centos redhat amazon scientific oracle fedora }.each do |os|
 supports os
end

%w{ build-essential }.each do |cb|
 depends cb
end

depends 'ohai', '>= 1.1.2'

%w{ runit bluepill yum }.each do |cb|
 recommends cb
end
{% endhighlight %}

  This is an important file, if you want to distribute your cookbook.

 * attributes - a folder, which contain files with default attributes for recipes. In the nginx cookbook you can find such default attributes:

{% highlight ruby %}
default['nginx']['version'] = "1.2.3"
default['nginx']['dir'] = "/etc/nginx"
default['nginx']['log_dir'] = "/var/log/nginx"
default['nginx']['binary'] = "/usr/sbin/nginx"
{% endhighlight %}

  As you remember we can redefine all these attributes in the node file.

 * definitions - a folder, which contain helpers from this cookbook. You can find this helper in the nginx cookbook:

{% highlight ruby %}
define :nginx_site, :enable => true do
 if params[:enable]
   execute "nxensite #{params[:name]}" do
     command "/usr/sbin/nxensite #{params[:name]}"
     notifies :reload, "service[nginx]"
     not_if do ::File.symlink?("#{node['nginx']['dir']}/sites-enabled/#{params[:name]}") end
   end
 else
   execute "nxdissite #{params[:name]}" do
     command "/usr/sbin/nxdissite #{params[:name]}"
     notifies :reload, "service[nginx]"
     only_if do ::File.symlink?("#{node['nginx']['dir']}/sites-enabled/#{params[:name]}") end
   end
 end
end
{% endhighlight %}

  The helper "nginx_site" can enable/disable configuration from the folder "site-available" and reload nginx. I will show you how to use this helper.

 * files - a folder, which contain files and these files just need to be copied on the server in the right place (it can be ssl keys, static configs, etc.)
 * recipes - a folder, which contain all recipes from this cookbook. Each recipe is in a separate Ruby file:

{% highlight bash %}
$ ls -la cookbooks/nginx/recipes
total 152
drwxr-xr-x  20 leo  staff   680 Jan  4 19:24 .
drwxr-xr-x  16 leo  staff   544 Jan  4 19:24 ..
-rw-r--r--   1 leo  staff  1123 Jan  4 19:24 authorized_ips.rb
-rw-r--r--   1 leo  staff   792 Jan  4 19:24 commons.rb
-rw-r--r--   1 leo  staff  1114 Jan  4 19:24 commons_conf.rb
-rw-r--r--   1 leo  staff  1070 Jan  4 19:24 commons_dir.rb
-rw-r--r--   1 leo  staff   854 Jan  4 19:24 commons_script.rb
-rw-r--r--   1 leo  staff  1201 Jan  4 19:24 default.rb
-rw-r--r--   1 leo  staff  1551 Jan  4 19:24 http_echo_module.rb
-rw-r--r--   1 leo  staff  3412 Jan  4 19:24 http_geoip_module.rb
-rw-r--r--   1 leo  staff   814 Jan  4 19:24 http_gzip_static_module.rb
-rw-r--r--   1 leo  staff  1352 Jan  4 19:24 http_realip_module.rb
-rw-r--r--   1 leo  staff   797 Jan  4 19:24 http_ssl_module.rb
-rw-r--r--   1 leo  staff  1091 Jan  4 19:24 http_stub_status_module.rb
-rw-r--r--   1 leo  staff   738 Jan  4 19:24 ipv6.rb
-rw-r--r--   1 leo  staff  1704 Jan  4 19:24 naxsi_module.rb
-rw-r--r--   1 leo  staff  1059 Jan  4 19:24 ohai_plugin.rb
-rw-r--r--   1 leo  staff  2994 Jan  4 19:24 passenger.rb
-rw-r--r--   1 leo  staff  5218 Jan  4 19:24 source.rb
-rw-r--r--   1 leo  staff  1571 Jan  4 19:24 upload_progress_module.rb
{% endhighlight %}

  As you remember we added this to the run\_list:

{% highlight ruby %}
"run_list": [
  "recipe[nginx::source]"
]
{% endhighlight %}

  This is run the source.rb recipe from the nginx cookbook. If you change it with by this:

{% highlight ruby %}
"run_list": [
  "recipe[nginx]"
]
{% endhighlight %}

  This is run default recipe from nginx cookbook (file default.rb in recipes folder).

 * templates - a folder, which contains Erb templates for this cookbook (these are nginx configs)
 * test - a folder, which contain tests for this cookbook


# First cookbook

Let's create our first cookbook. Our custom cookbooks should be in the folder "site-cookbooks" (the folder "cookbooks" is used for vendor cookbooks and managed by librarian, so we will add this folder in gitignore). If you look in solo.rb, you can see such settings:

{% highlight ruby %}
file_cache_path           "/tmp/chef-solo"
cookbook_path             [ "/tmp/chef-solo/site-cookbooks",
                            "/tmp/chef-solo/cookbooks" ]
{% endhighlight %}

This means what Chef will search needed cookbooks first in the site-cookbooks folder and nothing is found will try to search in the cookbooks folder. So if you create the nginx cookbook in site-cookbooks, Chef will try to use it first.

Let's create a cookbook with named "tomatoes":

{% highlight bash %}
$ mkdir site-cookbooks/tomatoes
$ mkdir site-cookbooks/tomatoes/recipes site-cookbooks/tomatoes/templates
$ mkdir site-cookbooks/tomatoes/templates/default
$ ls -la site-cookbooks/tomatoes
drwxr-xr-x  4 leo  staff  136 Jan  5 14:50 .
drwxr-xr-x  4 leo  staff  136 Jan  5 14:49 ..
drwxr-xr-x  2 leo  staff   68 Jan  5 14:50 recipes
drwxr-xr-x  3 leo  staff  102 Jan  5 14:50 templates
{% endhighlight %}

And create the file default.rb in the recipes folder with content:

{% highlight ruby %}
package "git"
{% endhighlight %}

The command "package" is used to manage packages in the server. This command will install on server git package. For more info about this command you can read here: [docs.opscode.com/chef/resources.html#package](http://docs.opscode.com/chef/resources.html#package). Next, add our new recipe to the run list in our vagrant.json node:

{% highlight ruby %}
"run_list": [
  "recipe[nginx::source]",
  "recipe[tomatoes]"
]
{% endhighlight %}

And test our kitchen again:

{% highlight bash %}
$ vagrant provision
[default] Running provisioner: Vagrant::Provisioners::ChefSolo...
[default] Generating chef JSON and uploading...
[default] Running chef-solo...
stdin: is not a tty
[Sat, 05 Jan 2013 13:07:34 +0000] INFO: *** Chef 0.10.10 ***
[Sat, 05 Jan 2013 13:07:34 +0000] INFO: Setting the run_list to ["recipe[nginx::source]", "recipe[tomatoes]"] from JSON
[Sat, 05 Jan 2013 13:07:34 +0000] INFO: Run List is [recipe[nginx::source], recipe[tomatoes]]
[Sat, 05 Jan 2013 13:07:34 +0000] INFO: Run List expands to [nginx::source, tomatoes]
[Sat, 05 Jan 2013 13:07:34 +0000] INFO: Starting Chef Run for precise64
[Sat, 05 Jan 2013 13:07:34 +0000] INFO: Running start handlers
[Sat, 05 Jan 2013 13:07:34 +0000] INFO: Start handlers complete.

...

[Sat, 05 Jan 2013 13:07:35 +0000] INFO: Processing package[git] action install (tomatoes::default line 1)
[Sat, 05 Jan 2013 13:07:50 +0000] INFO: package[git] installed version 1:1.7.9.5-1
[Sat, 05 Jan 2013 13:07:50 +0000] INFO: execute[nxensite default] sending reload action to service[nginx] (delayed)
[Sat, 05 Jan 2013 13:07:50 +0000] INFO: Processing service[nginx] action reload (nginx::source line 82)
[Sat, 05 Jan 2013 13:07:50 +0000] INFO: service[nginx] reloaded
[Sat, 05 Jan 2013 13:07:50 +0000] INFO: Chef Run complete in 16.410976 seconds
[Sat, 05 Jan 2013 13:07:50 +0000] INFO: Running report handlers
[Sat, 05 Jan 2013 13:07:50 +0000] INFO: Report handlers complete
{% endhighlight %}

As you can see the git package installed on the server. Let's check this:

{% highlight bash %}
$ vagrant ssh
Welcome to Ubuntu 12.04.1 LTS (GNU/Linux 3.2.0-23-generic x86_64)

 * Documentation:  https://help.ubuntu.com/
Welcome to your Vagrant-built virtual machine.
Last login: Sat Jan  5 13:09:24 2013 from 10.0.2.2
vagrant@precise64:~$ git --version
git version 1.7.9.5
vagrant@precise64:~$ exit
logout
Connection to 127.0.0.1 closed.
{% endhighlight %}

All works fine.

# Сonfigure nginx through our cookbook

Let's configure nginx for our application. First of all add new attributes in the vagrant node (file "nodes/vagrant.json"):

{% highlight json %}
{
  "app": {
    "name": "tomatoes",
    "web_dir": "/var/data/www/apps/tomatoes"
  },
  "user":{
    "name": "vagrant"
  },
  "nginx": {
    "version": "1.2.3",
    "default_site_enabled": true,
    "source": {
      "modules": ["http_gzip_static_module", "http_ssl_module"]
    }
  },
  "run_list": [
    "recipe[nginx::source]",
    "recipe[tomatoes]"
  ]
}
{% endhighlight %}

Next, create a nginx template ("tomatoes/templates/default/nginx.conf.erb"):

{% highlight erb %}
server {
    listen 80 default;

    access_log <%= node.app.web_dir %>/logs/nginx_access.log;
    error_log <%= node.app.web_dir %>/logs/nginx_error.log;

    keepalive_timeout 10;
    root <%= node.app.web_dir %>/public;
}
{% endhighlight %}

And create the index.html file in "tomatoes/files/default" (create this directory before) with content:

{% highlight html %}
<h1>Hello from Chef Solo</h1>
{% endhighlight %}

This we will use to check what nginx will show after setup of settings.

Finally add this content to "tomatoes/recipes/default.rb":

{% highlight ruby %}
directory node.app.web_dir do
  owner node.user.name
  mode "0755"
  recursive true
end

directory "#{node.app.web_dir}/public" do
  owner node.user.name
  mode "0755"
  recursive true
end

directory "#{node.app.web_dir}/logs" do
  owner node.user.name
  mode "0755"
  recursive true
end

template "#{node.nginx.dir}/sites-available/#{node.app.name}.conf" do
  source "nginx.conf.erb"
  mode "0644"
end

nginx_site "#{node.app.name}.conf"

cookbook_file "#{node.app.web_dir}/public/index.html" do
  source "index.html"
  mode "0755"
  owner node.user.name
end
{% endhighlight %}

As you can see in the recipe node attributes available for us in the "node" variable. You can get this attributes in several ways:

{% highlight ruby %}
 node.app.web_dir
 node['app']['web_dir']
 node[:app][:web_dir]
{% endhighlight %}

This always will give you the same value from the app.web\_dir attribute.

As you can see in the recipe code we created 3 directories, created a new config for nginx, enabled this config by "nginx\_site" helper (this helper automatically reloads nginx) and put "index.html" into the server directory. After the launch command, "vagrant provision", you should see this in your browser with url "http://localhost:8085/":

<a href="/assets/images/chef/nginx2.png"><amp-img src="/assets/images/chef/nginx2.png" alt="nginx" title="nginx" width="448" height="195" class="aligncenter" /></a>

# Ruby Power!

As you can see in our recipe we created 3 directories by 3 commands. Better [DRY](http://en.wikipedia.org/wiki/Don't_repeat_yourself) this code. But how to do this? Simple! This is all Ruby code, so you can use it to make your recipe more powerful (and beautiful, of course):

{% highlight ruby %}
package "git"

%w(public logs).each do |dir|
  directory "#{node.app.web_dir}/#{dir}" do
    owner node.user.name
    mode "0755"
    recursive true
  end
end

template "#{node.nginx.dir}/sites-available/#{node.app.name}.conf" do
  source "nginx.conf.erb"
  mode "0644"
end

nginx_site "#{node.app.name}.conf"

cookbook_file "#{node.app.web_dir}/public/index.html" do
  source "index.html"
  mode 0755
  owner node.user.name
end
{% endhighlight %}

We collect all subfolders in a Ruby array and create it in one cycle.

# Summary

In the current article we have learned the Chef cookbook structure and how to write a simple Chef cookbook. In the [next article](/2013/01/07/chef-solo-getting-started-part-3/) we will look at the usage of roles in your Chef kitchen.

All example code you can find here: [github.com/le0pard/chef-solo-example/tree/2.0](https://github.com/le0pard/chef-solo-example/tree/2.0).

*That’s all folks!* Thank you for reading till the end.
