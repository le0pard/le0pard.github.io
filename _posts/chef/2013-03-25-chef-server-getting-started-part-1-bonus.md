---
layout: post
title: Getting Started with Chef Server. Bonus updates
categories:
- chef
tags:
- chef
- solo
- server
---
Hello my dear friends. Today we will continue talk about Chef Server (and Solo). In this article I will talk about little update of my Chef Sole and Server code examples.

# New Vagrant - new configuration for testing

New version of Vagrant 1.1.x came out. Vagrant can work with [VMware (non-free)](http://www.vagrantup.com/vmware), have system of plugins and changed API. So I updated my Chef Solo and Server code examples.

First of all, now you should install Vagrant by [separate installer](http://downloads.vagrantup.com/) and shouldn't use for this bundler. Without this you couldn't use vagrant plugins. In my examples I removed vagrant from dependency in Gemfile, so you must install it before using my code examples.

Also removed multi\_json gem from Gemfile, because Gemfile gems not available in vagrant environment. For parsing JSON data I use json gem, which available in vagrant environment. Code changes:

{% highlight ruby %}
require 'json'

...

VAGRANT_JSON = JSON.parse(Pathname(__FILE__).dirname.join('nodes', 'vagrant.json').read)
{% endhighlight %}

Next, changed vagrant API in Vagrantfile. Old style is also supported, but I migrated my code examples to new Vagrantfile.

# Berkshelf and Vagrant

In berkshelf gem ([covered in previous article](/2013/02/17/chef-server-getting-started-part-1/)) moved berkshelf vagrant plugin into it's own repository. If you want use berkshelf with vagrant you should install it:

{% highlight bash %}
$ vagrant plugin install berkshelf-vagrant
Installing the 'berkshelf-vagrant' plugin. This can take a few minutes...
Installed the plugin 'berkshelf-vagrant (1.0.6)'!
{% endhighlight %}

More information you can [read here](http://berkshelf.com/).

Right now berkshelf-vagrant not work in "multi-machine" environment (Chef Server code example), but you can solve this by installing cookbooks in "cookbooks" dir before execution commands "vagrant up" or "vagrant provision":

{% highlight bash %}
$ berks install --path cookbooks
Installing chef-server (2.0.0) from git: 'git://github.com/opscode-cookbooks/chef-server.git' with branch: 'a8fb304a7cba7fd3c710a2c175bc08a48007179c'
{% endhighlight %}

# Problem with nginx and runit cookbooks (be careful)

Nginx and runit cookbooks right now have problems. Better use versions from my Cheffile.lock.

New runit v1.1.0 is invalid (I had error what didn't found template for ubuntu 12.04) and didn't work in new cookbook.

Nginx cookbook have also problem: it will not install nginx version from source, which different from default in cookbook. I think this is problem with same keys, used by default and Ohai plugin attributes.

# Quick how-to

Quick guides of my Chef code examples.

Chef Solo:

{% highlight bash %}
$ wget http://dl.dropbox.com/u/83704794/vagrant/rwpreise64.box
$ vagrant box add precise64 precise64.box
$ git clone git://github.com/le0pard/chef-solo-example.git
$ cd chef-solo-example
$ git checkout vagrant
$ bundle
$ vagrant up
{% endhighlight %}

Chef Server:

{% highlight bash %}
$ wget http://dl.dropbox.com/u/83704794/vagrant/rwpreise64.box
$ vagrant box add precise64 precise64.box
$ git clone git://github.com/le0pard/chef-server-example.git
$ cd chef-server-example
$ git checkout vagrant
$ bundle
$ berks install --path cookbooks
$ vagrant up
{% endhighlight %}

You can see all final changes by this links: [Chef Solo](https://github.com/le0pard/chef-solo-example/tree/vagrant) and [Chef Server](https://github.com/le0pard/chef-server-example/tree/vagrant).


*That’s all folks!* Thank you for reading till the end.
