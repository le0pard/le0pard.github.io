---
layout: post
title: Getting Started with Chef Solo. Part 1
categories:
- chef
tags:
- chef
- solo
---
Hello my dear friends. Today we will talk about Chef and usage Chef Solo like a Pro. All example code you can find here: [github.com/le0pard/chef-solo-example/tree/1.0](https://github.com/le0pard/chef-solo-example/tree/1.0)

# What is Chef?

<a href="/assets/images/chef/chef_logo.png"><img src="/assets/images/chef/chef_logo.png" alt="Chef" title="Chef" width="300" style="float:left; padding: 5px 25px 5px 0; clear: both" /></a>

[Chef](http://www.opscode.com/chef/) is an open-source systems integration framework built specifically for automating the cloud.

Why you should use Chef?

 * __Efficiency__: It's more effective to use Chef, which will contain all your servers configuration in one place.
 * __Scalability__: Do you need scale you app? Split your server into cloud (several servers) by using environments, roles and nodes.
 * __Reusing__ and __Save money__: No need 10 times install a same software for your application on server. Just create new node in Chef and after several minutes you will have configured instance.
 * __Documentation__: You Chef is also documentation for your cloud, because Chef recipes contain all information about your environment.

<a href="/assets/images/chef/automate-all-the-things.png"><img src="/assets/images/chef/automate-all-the-things.png" alt="Automate All The Things" title="Automate All The Things" width="500" class="aligncenter" /></a>

And of course main point is __Automate All The Things!!!__

## What doesn't Chef do?

 * "Magically" configure your server
 * Blindly reuse cookbooks and recipes
 * Monitor your servers or softwares
 * Undoing concept
 
# Chef types and terminology

Exists two types of Chef: Chef Solo and Chef Server. Chef Solo is simple way to begin working with Chef what is why I will show how to use it in articles.

This is list of terminology, which I will use in my articles:

 * Node - A host where the Chef client will run (web server, database server or another server). Chef Client always working on server, which it configure.
 * Chef Client - a command line tool that configures servers.
 * Chef Solo - a version of the Chef client that doesn't rely to the server for configuration (like Chef server).
 * Recipes - a single file of Ruby code that contains commands to run on a node (nginx ssl module, apache php module). 
 * Resources - a node's resources include files, directories, users and services.
 * Cookbook - a collection of Chef recipes (nginx cookbook, postgresql cookbook).
 * Role - reusable configuration for multiple nodes (web role, database role, etc).
 * Attribute - variables that are passed through Chef and used in recipes and templates (the version number of nginx to install).
 * Template - a file with placeholders for attributes, used to create configuration files (simple [Erb](http://ruby-doc.org/stdlib-1.9.3/libdoc/erb/rdoc/ERB.html) file).
 
# Initialize chef project

Let's create our folder, which will contain all our Chef kitchen:

    # mkdir chef-solo-example
    # cd chef-solo-example

Next I will use [bundler](http://gembundler.com/) to get some useful gems:

    # cat Gemfile
      source :rubygems

      gem 'knife-solo'
      gem 'librarian'
      gem 'ffi', '~> 1.2.0'
      gem 'vagrant', "~> 1.0.5"
      gem 'multi_json'
    
    # bundle

List of the required gems:

 * knife-solo - knife is a powerful command-line interface (CLI) that comes with Chef. It is used to control Chef client.
 * librarian - is a bundler for your Chef-based infrastructure repositories
 * [vagrant](http://www.vagrantup.com/) - create and configure lightweight, reproducible, and portable development environments. For this rubygems need installed VirtualBox. We will use vagrant to test our Chef Solo.
 
Next you need to create a kitchen by knife:

    # knife kitchen .
    # ls -la
    total 48
    drwxr-xr-x  14 leo  staff   476 Jan  4 19:01 .
    drwxr-xr-x  69 leo  staff  2346 Jan  4 18:43 ..
    drwxr-xr-x  13 leo  staff   442 Jan  4 18:57 .git
    -rw-r--r--@  1 leo  staff    38 Jan  4 18:57 .gitignore
    -rw-r--r--@  1 leo  staff     9 Jan  4 18:51 .rvmrc
    -rw-r--r--@  1 leo  staff    98 Jan  4 18:53 Gemfile
    -rw-r--r--   1 leo  staff  2033 Jan  4 18:53 Gemfile.lock
    -rw-r--r--@  1 leo  staff    19 Jan  4 18:56 README.md
    drwxr-xr-x   3 leo  staff   102 Jan  4 19:01 cookbooks
    drwxr-xr-x   3 leo  staff   102 Jan  4 19:01 data_bags
    drwxr-xr-x   3 leo  staff   102 Jan  4 19:01 nodes
    drwxr-xr-x   3 leo  staff   102 Jan  4 19:01 roles
    drwxr-xr-x   3 leo  staff   102 Jan  4 19:01 site-cookbooks
    -rw-r--r--   1 leo  staff   319 Jan  4 19:01 solo.rb

Command "kitchen" is used to create a new directory structure that fits with chef’s standard structure and can be used to build and store recipes.

Let's look at the directory structure:

 * cookbooks - directory for Chef cookbooks. This directory will be used for vendor cookbooks
 * data_bags - directory for Chef [Data Bags](http://wiki.opscode.com/display/chef/Data+Bags)
 * nodes - directory for Chef nodes
 * roles - directory for Chef roles
 * site-cookbooks - directory for your custom Chef cookbooks
 * solo.rb - file used by Chef Solo with [configuration settings](http://wiki.opscode.com/display/chef/Chef+Configuration+Settings)
 
# Librarian
 
Now let's create librarian Cheffile for manage the cookbooks:

    # librarian-chef init
      create  Cheffile
      
And add to Cheffile nginx cookbook. More cookbooks you can find at [community.opscode.com](http://community.opscode.com/).

    # cat Cheffile
      #!/usr/bin/env ruby
      #^syntax detection

      site 'http://community.opscode.com/api/v1'

      cookbook 'runit'
      cookbook 'nginx', :git => 'git://github.com/opscode-cookbooks/nginx.git'
    
    # librarian-chef install
    
Now in folder "cookbooks" you should find nginx cookbook and all it dependens:

    # ls -la cookbooks
    total 0
    drwxr-xr-x   6 leo  staff  204 Jan  4 19:24 .
    drwxr-xr-x  18 leo  staff  612 Jan  4 19:24 ..
    drwxr-xr-x  12 leo  staff  408 Jan  4 19:24 build-essential
    drwxr-xr-x  16 leo  staff  544 Jan  4 19:24 nginx
    drwxr-xr-x  11 leo  staff  374 Jan  4 19:24 ohai
    drwxr-xr-x  13 leo  staff  442 Jan  4 19:24 runit

# First node
    
Next, create a node file. Chef node file always have name as server host. For create this file automatically and check, what Chef Solo installed on server you can use knife command "prepare". This command installs Ruby, RubyGems and Chef on a given host. It’s structured to auto-detect the target OS and change the installation process accordingly:

    # knife prepare host_username@host
    
This command apply the same parameters as ssh command. Fox example, executing with ssh key:

    # knife prepare -i key/ssh_key.pem host_username@host

Let's for test call our node file "vagrant":

    # cat nodes/vagrant.json
    {
      "nginx": {
        "version": "1.2.3",
        "default_site_enabled": true,
        "source": {
          "modules": ["http_gzip_static_module", "http_ssl_module"]
        }
      },
      "run_list": [
        "recipe[nginx::source]"
      ]
    }
    
"run\_list" the main part of node, where you specify roles and/or recipes to add to the node. In our case I add recipe source from nginx cookbook. Also you can see nginx attributes (like version, modules, etc.). All cookbook can have directory "attributes" and this directory contain default attributes for cookbook recipes. But you can redefine this attributes in node file. We are ready to test our kitchen!

# Vagrant
 
For testing Chef Solo kitchen by vagrant we need download vagrant box. List of boxes you can find [www.vagrantbox.es](http://www.vagrantbox.es/).

    # vagrant box add precise64 http://dl.dropbox.com/u/1537815/precise64.box
    
    # vagrant init precise64
    
    A `Vagrantfile` has been placed in this directory. You are now
    ready to `vagrant up` your first virtual environment! Please read
    the comments in the Vagrantfile as well as documentation on
    `vagrantup.com` for more information on using Vagrant.
    
Next we should edit Vagrantfile for define chef solo:

    # cat Vagrantfile
    
      # -*- mode: ruby -*-
      # vi: set ft=ruby :

      require 'rubygems'
      require 'bundler'

      Bundler.require
      require 'multi_json'

      Vagrant::Config.run do |config|
        # All Vagrant configuration is done here. The most common configuration
        # options are documented and commented below. For a complete reference,
        # please see the online documentation at vagrantup.com.

        # Every Vagrant virtual environment requires a box to build off of.
        config.vm.box = "precise64"
        
        ...
        
        VAGRANT_JSON = MultiJson.load(Pathname(__FILE__).dirname.join('nodes', 'vagrant.json').read)

        config.vm.provision :chef_solo do |chef|
           chef.cookbooks_path = ["site-cookbooks", "cookbooks"]
           chef.roles_path = "roles"
           chef.data_bags_path = "data_bags"
           chef.provisioning_path = "/tmp/vagrant-chef"

           # You may also specify custom JSON attributes:
           chef.json = VAGRANT_JSON
           VAGRANT_JSON['run_list'].each do |recipe|
            chef.add_recipe(recipe)
           end if VAGRANT_JSON['run_list']
        end
        
        ...
        
      end
    
As you can see "run\_list" and json attributes from node "vagrant.json" automatically loaded from file. More information about using Chef Solo with Vagrant you can find by [this link](http://docs.vagrantup.com/v1/docs/provisioners/chef_solo.html). 

Next, we can try test Chef Solo with Vagrant:

    # vagrant up                                                                                                                                                                                              
    [default] Importing base box 'precise64'...
    [default] The guest additions on this VM do not match the install version of
    VirtualBox! This may cause things such as forwarded ports, shared
    folders, and more to not work properly. If any of those things fail on
    this machine, please update the guest additions and repackage the
    box.

    Guest Additions Version: 4.1.18
    VirtualBox Version: 4.2.6
    [default] Matching MAC address for NAT networking...
    [default] Clearing any previously set forwarded ports...
    [default] Forwarding ports...
    [default] -- 22 => 2222 (adapter 1)
    [default] Creating shared folders metadata...
    [default] Clearing any previously set network interfaces...
    [default] Booting VM...
    [default] Waiting for VM to boot. This can take a few minutes.
    [default] VM booted and ready for use!
    [default] Mounting shared folders...
    [default] -- v-root: /vagrant
    [default] -- v-csr-3: /tmp/vagrant-chef/chef-solo-3/roles
    [default] -- v-csc-2: /tmp/vagrant-chef/chef-solo-2/cookbooks
    [default] -- v-csc-1: /tmp/vagrant-chef/chef-solo-1/cookbooks
    [default] -- v-csdb-4: /tmp/vagrant-chef/chef-solo-4/data_bags
    [default] Running provisioner: Vagrant::Provisioners::ChefSolo...
    [default] Generating chef JSON and uploading...
    [default] Running chef-solo...
    stdin: is not a tty
    [Fri, 04 Jan 2013 18:31:24 +0000] INFO: *** Chef 0.10.10 ***
    [Fri, 04 Jan 2013 18:31:24 +0000] INFO: Setting the run_list to ["recipe[nginx::source]"] from JSON
    [Fri, 04 Jan 2013 18:31:24 +0000] INFO: Run List is [recipe[nginx::source]]
    [Fri, 04 Jan 2013 18:31:24 +0000] INFO: Run List expands to [nginx::source]
    [Fri, 04 Jan 2013 18:31:24 +0000] INFO: Starting Chef Run for precise64
    [Fri, 04 Jan 2013 18:31:24 +0000] INFO: Running start handlers
    [Fri, 04 Jan 2013 18:31:24 +0000] INFO: Start handlers complete.
    
    ...
    
    [Fri, 04 Jan 2013 18:33:44 +0000] INFO: Chef Run complete in 139.63975 seconds
    [Fri, 04 Jan 2013 18:33:44 +0000] INFO: Running report handlers
    [Fri, 04 Jan 2013 18:33:44 +0000] INFO: Report handlers complete
    
Next, we can check what nginx successfully installed on vagrant image:

    # vagrant ssh
    Welcome to Ubuntu 12.04.1 LTS (GNU/Linux 3.2.0-23-generic x86_64)

     * Documentation:  https://help.ubuntu.com/
    Welcome to your Vagrant-built virtual machine.
    Last login: Mon Aug 20 19:28:45 2012 from 10.0.2.2
    vagrant@precise64:~$ ps ax | grep nginx
     6682 ?        Ss     0:00 runsv nginx
     9010 ?        S      0:00 nginx: master process /opt/nginx-1.2.3/sbin/nginx -c /etc/nginx/nginx.conf
     9011 ?        S      0:00 nginx: worker process                               
     9012 ?        S      0:00 nginx: worker process                               
     9132 pts/1    S+     0:00 grep --color=auto nginx
    vagrant@precise64:~$ exit
    logout
    Connection to 127.0.0.1 closed.

Let's check what nginx is running. Just add in "Vagrantfile" port forwarding:

    config.vm.forward_port 80, 8085
    
Next, reload vagrant instance:

    # vagrant reload
    
And you should see in your browser:

<a href="/assets/images/chef/nginx.png"><img src="/assets/images/chef/nginx.png" alt="nginx" title="nginx" class="aligncenter" /></a>

After change something in your kitchen, you should run command "vagrant provision":

    # vagrant provision
    
And Chef Solo will be running again on vagrant server.

The main idea of Chef is idempotence: it can safely be run multiple times. Once you develop your configuration, your machines will apply the configuration and Chef will only make any changes to the system if the system state does not match the configured state. For example, first time chef will compile nginx from source and install it on server. On next run it just check, what nginx already compiled and running (if you will not change attributes). 

# Cook real server

After fully testing the kitchen you can apply your node configuration on real server. You should rename "vagrant.json" on your server host and run commands:

    knife cook host_username@host
    
Your server must have installed Chef client. If no, just before command "cook" run command "prepare".

# Summary

In the current article we considered usage Chef Solo and test our first kitchen. In the next article we will look at the use of roles and enviroments.

All example code you can find here: [github.com/le0pard/chef-solo-example/tree/1.0](https://github.com/le0pard/chef-solo-example/tree/1.0)

*That’s all folks!* Thank you for reading till the end.