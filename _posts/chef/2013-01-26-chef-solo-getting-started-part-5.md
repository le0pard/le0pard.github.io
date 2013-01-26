---
layout: post
title: Getting Started with Chef Solo. Part 5
categories:
- chef
tags:
- chef
- solo
---
Hello my dear friends. Today we will continue talk about Chef Solo. All example code you can find here: [github.com/le0pard/chef-solo-example/tree/5.0](https://github.com/le0pard/chef-solo-example/tree/5.0).

In [the previous article](/2013/01/12/chef-solo-getting-started-part-4/) we learned more about Chef cookbooks. In this article we will learn what is Ohai and how to write Ohai plugin.

# Ohai

Ohai detects data about your operating system. It can be used standalone, but its primary purpose is to provide node data to Chef.

When invoked, it collects detailed, extensible information about the machine it's running on, including Chef configuration, hostname, FQDN, networking, memory, CPU, platform, and kernel data.

When Chef configures the node object during each Chef run, these attributes are used by the chef-client to ensure that certain properties remain unchanged. These properties are also referred to as automatic attributes. In our case (in Chef Solo), this attributes available in node object. For example:

{% highlight ruby %}
node['platform'] # The platform on which a node is running. This attribute helps determine which providers will be used.
node['platform_version']	# The version of the platform. This attribute helps determine which providers will be used.
node['hostname']	# The host name for the node.
{% endhighlight %}

# Ohai plugin

In our cookbook "tomatoes" we already have node.js recipe. Let's create ohai plugin, which will provide for us information about already installed on system node.js. We will use this information to check if we need install node.js on server.

First of all create in "tomatoes" new recipe "ohai_plugin.rb" with content:

{% highlight ruby %}
template "#{node['ohai']['plugin_path']}/system_node_js.rb" do
  source "plugins/system_node_js.rb.erb"
  owner "root"
  group "root"
  mode 00755
  variables(
    :node_js_bin => "#{node['nodejs']['dir']}/bin/node"
  )
end

include_recipe "ohai"
{% endhighlight %}

This recipe will generate ohai plugin from template "system\_node\_js.rb". Next we should create this template in folder "tomatoes/templates/default/plugins":

{% highlight erb %}
provides "system_node_js"
provides "system_node_js/version"

system_node_js Mash.new unless system_node_js
system_node_js[:version] = nil unless system_node_js[:version]

status, stdout, stderr = run_command(:no_status_check => true, :command => "<%= @node_js_bin %> --version")

system_node_js[:version] = stdout[1..-1] if 0 == status
{% endhighlight %}

In first two lines we set by method "provides" automatic attributes, which will provide for us this plugin.

Most of the information we want to lookup would be nested in some way, and ohai tends to do this by storing the data in a Mash. This can be done by creating a new mash and setting the attribute to it. We did this with "system\_node\_js".

In the end of code, plugin set the version of node.js, if node.js installed on server. That's it!

Next, let's try this plugin by adding "default.rb" recipe this content:

{% highlight ruby %}
include_recipe "tomatoes::ohai_plugin"
# remove this in your prod recipe
puts "Node version: #{node.system_node_js.version}" if node['system_node_js']
{% endhighlight %}

Now test it by running the command "vagrant provision". When you first start, you will not see anything, as the plugin will be delivered later chef-client launched. But the second time, you should see a similar picture in the log:

{% highlight bash %}
[Sat, 26 Jan 2013 18:42:16 +0000] INFO: ohai plugins will be at: /etc/chef/ohai_plugins
[Sat, 26 Jan 2013 18:42:16 +0000] INFO: Processing remote_directory[/etc/chef/ohai_plugins] action create (ohai::default line 27)
[Sat, 26 Jan 2013 18:42:16 +0000] INFO: Processing cookbook_file[/etc/chef/ohai_plugins/README] action create (dynamically defined)
[Sat, 26 Jan 2013 18:42:16 +0000] INFO: Processing ohai[custom_plugins] action reload (ohai::default line 42)
[Sat, 26 Jan 2013 18:42:16 +0000] INFO: ohai[custom_plugins] reloaded
Node version: 0.8.6
[Sat, 26 Jan 2013 18:42:17 +0000] INFO: Processing ohai[reload_nginx] action nothing (nginx::ohai_plugin line 22)
[Sat, 26 Jan 2013 18:42:17 +0000] INFO: Processing template[/etc/chef/ohai_plugins/nginx.rb] action create (nginx::ohai_plugin line 27)
[Sat, 26 Jan 2013 18:42:17 +0000] INFO: Processing remote_directory[/etc/chef/ohai_plugins] action nothing (ohai::default line 27)
[Sat, 26 Jan 2013 18:42:17 +0000] INFO: Processing ohai[custom_plugins] action nothing (ohai::default line 42)
{% endhighlight %}

In this case we can little change our node.js recipe:

{% highlight ruby %}
execute "nodejs make install" do
  environment({"PATH" => "/usr/local/bin:/usr/bin:/bin:$PATH"})
  command "make install"
  cwd "/usr/local/src/node-v#{node['nodejs']['version']}"
  not_if {node['system_node_js'] && node['system_node_js']['version'] == node['nodejs']['version'] }
end
{% endhighlight %}

Let's try to change node.js version in role "web.json":

{% highlight json %}
"nodejs": {
  "version": "0.8.18",
  "checksum": "e3bc9b64f60f76a32b7d9b35bf86b5d1b8166717"
}
{% endhighlight %}

And restart "vagrant provision":

{% highlight bash %}
[Sat, 26 Jan 2013 19:09:32 +0000] INFO: Processing remote_file[/usr/local/src/node-v0.8.18.tar.gz] action create_if_missing (tomatoes::node_js line 16)
[Sat, 26 Jan 2013 19:10:17 +0000] INFO: remote_file[/usr/local/src/node-v0.8.18.tar.gz] updated
[Sat, 26 Jan 2013 19:10:17 +0000] INFO: remote_file[/usr/local/src/node-v0.8.18.tar.gz] mode changed to 644
[Sat, 26 Jan 2013 19:10:17 +0000] INFO: Processing execute[tar --no-same-owner -zxf node-v0.8.18.tar.gz] action run (tomatoes::node_js line 25)
[Sat, 26 Jan 2013 19:10:18 +0000] INFO: execute[tar --no-same-owner -zxf node-v0.8.18.tar.gz] ran successfully
[Sat, 26 Jan 2013 19:10:18 +0000] INFO: Processing bash[compile node.js] action run (tomatoes::node_js line 30)
[Sat, 26 Jan 2013 19:18:16 +0000] INFO: bash[compile node.js] ran successfully
[Sat, 26 Jan 2013 19:18:16 +0000] INFO: Processing execute[nodejs make install] action run (tomatoes::node_js line 40)
[Sat, 26 Jan 2013 19:18:19 +0000] INFO: execute[nodejs make install] ran successfully
{% endhighlight %}

And after some time, the server will install a new node.js:

{% highlight bash %}
$ vagrant ssh
Welcome to Ubuntu 12.04.1 LTS (GNU/Linux 3.2.0-23-generic x86_64)

 * Documentation:  https://help.ubuntu.com/
Welcome to your Vagrant-built virtual machine.
Last login: Sat Jan 26 19:19:00 2013 from 10.0.2.2
vagrant@precise64:~$ node -v
v0.8.18
{% endhighlight %}

And on next launch of chef solo you should see new version of node.js:

{% highlight bash %}
[Sat, 26 Jan 2013 19:20:22 +0000] INFO: Processing remote_directory[/etc/chef/ohai_plugins] action create (ohai::default line 27)
[Sat, 26 Jan 2013 19:20:22 +0000] INFO: Processing cookbook_file[/etc/chef/ohai_plugins/README] action create (dynamically defined)
[Sat, 26 Jan 2013 19:20:22 +0000] INFO: Processing ohai[custom_plugins] action reload (ohai::default line 42)
[Sat, 26 Jan 2013 19:20:22 +0000] INFO: ohai[custom_plugins] reloaded
Node version: 0.8.18
[Sat, 26 Jan 2013 19:20:23 +0000] INFO: Processing ohai[reload_nginx] action nothing (nginx::ohai_plugin line 22)
[Sat, 26 Jan 2013 19:20:23 +0000] INFO: Processing template[/etc/chef/ohai_plugins/nginx.rb] action create (nginx::ohai_plugin line 27)
{% endhighlight %}

# Summary

In the current article we have learn Ohai and how to write Ohai plugin.

All example code you can find here: [github.com/le0pard/chef-solo-example/tree/5.0](https://github.com/le0pard/chef-solo-example/tree/5.0).

*That’s all folks!* Thank you for reading till the end.