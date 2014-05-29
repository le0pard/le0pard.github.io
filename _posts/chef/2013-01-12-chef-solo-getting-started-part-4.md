---
layout: post
title: Getting Started with Chef Solo. Part 4
date: 2013-01-12 00:00:00
categories:
- chef
tags:
- chef
- solo
---

> **WARNING**: This article can be outdated. Better read my book about Chef: [Cooking Infrastructure by Chef](http://chef.leopard.in.ua/)

Hello my dear friends. Today we will continue talk about Chef Solo. All example code you can find here: [github.com/le0pard/chef-solo-example/tree/4.0](https://github.com/le0pard/chef-solo-example/tree/4.0).

In [the previous article](/2013/01/07/chef-solo-getting-started-part-3/) we learned Chef roles. In this article we will learn more about knife and cookbooks.

# WARNING: No knife configuration file found

Knife also used to communicate with Chef Server, but in our case we don't have Chef Server. To fix this warning you should create "knife.rb" file (knife configuration file) and add this content:

{% highlight ruby %}
cookbook_path             [ "/tmp/chef-solo/site-cookbooks",
                            "/tmp/chef-solo/cookbooks" ]
{% endhighlight %}

In this case knife will automatically found this configuration and will not show this warning.

# Node.js recipe

Let's create node.js recipe in our tomatoes cookbook. Add this content in created file "tomatoes/recipes/node_js.rb":

{% highlight ruby %}
case node['platform_family']
  when 'rhel','fedora'
    package "openssl-devel"
  when 'debian'
    package "libssl-dev"
end

nodejs_tar = "node-v#{node['nodejs']['version']}.tar.gz"
nodejs_tar_path = nodejs_tar
if node['nodejs']['version'].split('.')[1].to_i >= 5
  nodejs_tar_path = "v#{node['nodejs']['version']}/#{nodejs_tar_path}"
end
# Let the user override the source url in the attributes
nodejs_src_url = "#{node['nodejs']['src_url']}/#{nodejs_tar_path}"

remote_file "/usr/local/src/#{nodejs_tar}" do
  source nodejs_src_url
  checksum node['nodejs']['checksum']
  mode 0644
  action :create_if_missing
end

# --no-same-owner required overcome "Cannot change ownership" bug
# on NFS-mounted filesystem
execute "tar --no-same-owner -zxf #{nodejs_tar}" do
  cwd "/usr/local/src"
  creates "/usr/local/src/node-v#{node['nodejs']['version']}"
end

bash "compile node.js" do
  cwd "/usr/local/src/node-v#{node['nodejs']['version']}"
  code <<-EOH
    PATH="/usr/local/bin:$PATH"
    ./configure --prefix=#{node['nodejs']['dir']} && \
    make
  EOH
  creates "/usr/local/src/node-v#{node['nodejs']['version']}/node"
end

execute "nodejs make install" do
  environment({"PATH" => "/usr/local/bin:/usr/bin:/bin:$PATH"})
  command "make install"
  cwd "/usr/local/src/node-v#{node['nodejs']['version']}"
  not_if {File.exists?("#{node['nodejs']['dir']}/bin/node") && `#{node['nodejs']['dir']}/bin/node --version`.chomp == "v#{node['nodejs']['version']}" }
end
{% endhighlight %}

Next, we should add default attributes for this recipe. You should create file "tomatoes/attributes/node\_js.rb" with content:

{% highlight ruby %}
default['nodejs']['version'] = '0.8.6'
default['nodejs']['checksum'] = 'dbd42800e69644beff5c2cf11a9d4cf6dfbd644a9a36ffdd5e8c6b8db9240854'
default['nodejs']['dir'] = '/usr/local'
default['nodejs']['src_url'] = "http://nodejs.org/dist"
{% endhighlight %}

And add this in role "web" run\_list:

{% highlight json %}
"run_list": [
  "recipe[nginx::source]",
  "recipe[tomatoes]",
  "recipe[tomatoes::node_js]"
]
{% endhighlight %}

Now you can test this new recipe by "vagrant provision" command. After running this command, the server will node.js:

{% highlight bash %}
$ vagrant ssh
Welcome to Ubuntu 12.04.1 LTS (GNU/Linux 3.2.0-23-generic x86_64)

 * Documentation:  https://help.ubuntu.com/
Welcome to your Vagrant-built virtual machine.
Last login: Mon Aug 20 19:28:45 2012 from 10.0.2.2
vagrant@precise64:~$ node -v
v0.8.6
{% endhighlight %}

# Сorrect dependencies

This node.js recipe will fail on new server, because to install node.js on server should be installed g++ and gcc before running this recipe. For this exist "build-essential" cookbook with recipes. We should add this in top of our node.js recipe:

{% highlight ruby %}
include_recipe "build-essential"
{% endhighlight %}

This cookbook automatically downloaded by nginx cookbook (it is added as dependency in "metadata.rb").

Now we can use command "include_recipe" in default.rb recipe:

{% highlight ruby %}
include_recipe "tomatoes::node_js"
{% endhighlight %}

And rollback last run\_list (without node\_js recipe, default recipe from tomatoes cookbook automatically will execute node\_js recipe):

{% highlight json %}
"run_list": [
  "recipe[nginx::source]",
  "recipe[tomatoes]"
]
{% endhighlight %}

You can also create "metadata.rb" file for your cookbook and add some info about this cookbook:

{% highlight ruby %}
name              "tomatoes"
maintainer        "Someone"
maintainer_email  "your_email@example.com"
license           "MIT"
description       "Installs and configures nginx, git and node.js"
version           "0.0.1"

recipe "tomatoes", "Installs nginx configuration, git and node.js"
recipe "tomatoes::node_js", "Installs only node.js"

depends "build-essential"
{% endhighlight %}

# Summary

In the current article we have learn more about Chef cookbooks. In the [next article](/2013/01/26/chef-solo-getting-started-part-5/) we will learn more about Ohai and how to write Ohai plugin.

All example code you can find here: [github.com/le0pard/chef-solo-example/tree/4.0](https://github.com/le0pard/chef-solo-example/tree/4.0).

*That’s all folks!* Thank you for reading till the end.