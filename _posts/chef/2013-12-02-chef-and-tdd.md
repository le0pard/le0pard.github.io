---
layout: post
title: Development of Chef cookbooks by TDD
date: 2013-12-02 00:00:00
categories:
- chef
tags:
- chef
- tdd
---
Hello my dear friends. Today we will continue talk about Chef. But today we will write Chef cookbooks by [TDD](http://en.wikipedia.org/wiki/Test-driven_development). If you don't know what is Chef and how to use it, then you better start to read my [articles](/2013/01/04/chef-solo-getting-started-part-1/) about it.

# Chef tetsing tools

First, let's look at what tools exist today to test Chef cookbooks.

## Foodcritic

* [Site](http://acrmp.github.io/foodcritic/)

Foodcritic is a lint tool for your Opscode Chef cookbooks. Foodcritic has two goals:

 * To make it easier to flag problems in your Chef cookbooks that will cause Chef to blow up when you attempt to converge. This is about faster feedback. If you automate checks for common problems you can save a lot of time.
 * To encourage discussion within the Chef community on the more subjective stuff - what does a good cookbook look like? Opscode have avoided being overly prescriptive which by and large I think is a good thing. Having a set of rules to base discussion on helps drive out what we as a community think is good style.

On main site you can find [list of rules](http://acrmp.github.io/foodcritic/#FC001). Also you can define own list of rules (if you need this). Foodcritic is like jslint for cookbooks. At the bare minimum, you should run foodcritic against all your cookbooks.

## Fauxhai

* [Site](http://technology.customink.com/fauxhai/)

Ohai is a tool that is used to detect attributes on a node, and then provide these attributes to the chef-client at the start of every chef-client run. Ohai is required by the chef-client and must be present on a node. It's awesome, but this can be problem for testing. What is why exist Fauxhai. Fauxhai is a gem for mocking out ohai data in your chef testing. Example:

{% highlight ruby %}
require 'chefspec'

describe 'awesome_cookbook::default' do
  before do
    Fauxhai.mock(platform:'ubuntu', version:'12.04')
  end

  it 'should install awesome' do
    @runner = ChefSpec::ChefRunner.new.converge('tmpreaper::default')
    @runner.should install_package 'awesome'
  end
end
{% endhighlight %}

## ChefSpec

* [Site](http://sethvargo.com/chefspec/)

ChefSpec is a unit testing framework for testing Chef cookbooks. ChefSpec makes it easy to write examples and get fast feedback on cookbook changes without the need for virtual machines or cloud servers. Example:

{% highlight ruby %}
require 'chefspec'

describe 'example::default' do
  let(:chef_run) { ChefSpec::Runner.new.converge(described_recipe) }

  it 'installs foo' do
    expect(chef_run).to install_package('foo')
  end
end
{% endhighlight %}


## Cucumber-chef

* [Site](http://www.cucumber-chef.org/)

Cucumber-chef is a library of tools to enable the emerging discipline of infrastructure as code to practice test driven development. It provides a testing platform within which [Cucumber tests](http://cukes.info/) can be run which provision virtual machines, configure them by applying the appropriate Chef roles to them, and then run acceptance and integration tests against the environment.

## Minitest Chef Handler

* [Site](https://github.com/calavera/minitest-chef-handler)

Minitest Chef Handler run minitest suites after your Chef recipes to check the status of your system. Example:

{% highlight ruby %}
class TestNginx < MiniTest::Chef::TestCase
  def test_config_file_exist
    assert File.exist?('/etc/nginx/nginx.conf')
  end
end
{% endhighlight %}

## Test-kitchen

* [Site](https://github.com/test-kitchen/test-kitchen)

Test-kitchen is a convergence integration test harness for configuration management systems.

## Chef Zero

* [Site](https://github.com/opscode/chef-zero)

Chef Zero is a simple, easy-install, in-memory Chef server that can be useful for Chef Client testing and chef-solo-like tasks that require a full Chef Server. Because Chef Zero runs in memory, it's super fast and lightweight. This makes it perfect for testing against a "real" Chef Server without mocking the entire Internet.


# Enough words. Let's start with the practice

First of all you must have installed Ruby and Rubygems. Let's create [monit](http://mmonit.com/monit/) cookbook by TDD. I generate structure of coobook by [berkshelf](http://berkshelf.com/):

{% highlight bash %}
$ ruby -v
ruby 2.0.0p353 (2013-11-22 revision 43784) [x86_64-darwin13.0.0]
$ gem install berkshelf
Successfully installed berkshelf-2.0.10
1 gem installed
$ berks cookbook monit
create  monit/files/default
create  monit/templates/default
create  monit/attributes
create  monit/definitions
create  monit/libraries
create  monit/providers
create  monit/recipes
create  monit/resources
create  monit/recipes/default.rb
create  monit/metadata.rb
create  monit/LICENSE
create  monit/README.md
create  monit/Berksfile
create  monit/Thorfile
create  monit/chefignore
create  monit/.gitignore
   run  git init from "./monit"
create  monit/Gemfile
create  monit/Vagrantfile
$ cd monit
{% endhighlight %}

Now we need add in Gemfile gems, which we will use for testing:

{% highlight ruby %}
source 'https://rubygems.org'

gem 'berkshelf'

gem 'foodcritic'
gem 'fauxhai'
gem 'chefspec'
gem 'busser-minitest'
gem 'test-kitchen', '1.0.0.rc.2'
group :integration do
  gem 'kitchen-vagrant', '0.12.0'
end
{% endhighlight %}

And execure "bundle" command to install this gems.

# Using ChefSpec

Next we should create tests for our cookbook:

File: spec/spec\_helper.rb

{% highlight ruby %}
require 'chefspec'
require 'chefspec/berkshelf'

RSpec.configure do |config|

end
{% endhighlight %}

File: spec/unit/recipes/default\_spec.rb

{% highlight ruby %}
require 'chefspec'

describe 'monit::default' do
  let(:chef_run) { ChefSpec::Runner.new.converge(described_recipe) }

  it 'install monit package' do
    expect(chef_run).to install_package('monit')
  end

  it 'enable monit service' do
    expect(chef_run).to enable_service('monit')
  end

  it 'create direcory for custom services' do
    expect(chef_run).to create_directory('/etc/monit/conf.d/').with(
      user:   'root',
      group:  'root'
    )
  end

  it 'create main monit config' do
    expect(chef_run).to create_template('/etc/monit/monitrc')
  end

end
{% endhighlight %}

Of course tests will be fallen:

{% highlight bash %}
$ rspec

monit::default
  install monit package (FAILED - 1)
  enable monit service (FAILED - 2)
  create direcory for custom services (FAILED - 3)
  create main monit config (FAILED - 4)

Failures:

  1) monit::default install monit package
     Failure/Error: expect(chef_run).to install_package('monit')
       expected "package[monit] with" action :install to be in Chef run. Other package resources:



     # ./spec/unit/recipes/default_spec.rb:7:in `block (2 levels) in <top (required)>'

  2) monit::default enable monit service
     Failure/Error: expect(chef_run).to enable_service('monit')
       expected "service[monit] with" action :enable to be in Chef run. Other service resources:



     # ./spec/unit/recipes/default_spec.rb:11:in `block (2 levels) in <top (required)>'

  3) monit::default create direcory for custom services
     Failure/Error: expect(chef_run).to create_directory('/etc/monit/conf.d/').with(
       expected "directory[/etc/monit/conf.d/] with" action :create to be in Chef run. Other directory resources:



     # ./spec/unit/recipes/default_spec.rb:15:in `block (2 levels) in <top (required)>'

  4) monit::default create main monit config
     Failure/Error: expect(chef_run).to create_template('/etc/monit/monitrc')
       expected "template[/etc/monit/monitrc] with" action :create to be in Chef run. Other template resources:



     # ./spec/unit/recipes/default_spec.rb:22:in `block (2 levels) in <top (required)>'

Finished in 0.07275 seconds
4 examples, 4 failures

Failed examples:

rspec ./spec/unit/recipes/default_spec.rb:6 # monit::default install monit package
rspec ./spec/unit/recipes/default_spec.rb:10 # monit::default enable monit service
rspec ./spec/unit/recipes/default_spec.rb:14 # monit::default create direcory for custom services
rspec ./spec/unit/recipes/default_spec.rb:21 # monit::default create main monit config
{% endhighlight %}

Let's fix this tests:

File: attributes/default.rb

{% highlight ruby %}
default[:monit][:notify_email]          = "notify@example.com"
default[:monit][:logfile]               = 'syslog facility log_daemon'

default[:monit][:poll_period]           = 60
default[:monit][:poll_start_delay]      = 120

default[:monit][:mail_format][:subject] = "$SERVICE $EVENT"
default[:monit][:mail_format][:from]    = "monit@#{node['fqdn']}"
default[:monit][:mail_format][:message]    = <<-EOS
Monit $ACTION $SERVICE at $DATE on $HOST: $DESCRIPTION.
Yours sincerely,
monit
EOS

default[:monit][:mailserver][:host] = "localhost"
default[:monit][:mailserver][:port] = nil
default[:monit][:mailserver][:username] = nil
default[:monit][:mailserver][:password] = nil
default[:monit][:mailserver][:password_suffix] = nil

default[:monit][:port] = 3737
default[:monit][:address] = "localhost"
default[:monit][:ssl] = false
default[:monit][:cert] = "/etc/monit/monit.pem"
default[:monit][:allow] = ["localhost"]
{% endhighlight %}

File: templates/default/monitrc.erb

{% highlight ruby %}
set daemon <%= @node[:monit][:poll_period] %>
<% if @node[:monit][:poll_start_delay] %>
  with start delay <%= @node[:monit][:poll_start_delay] %>
<% end %>

set logfile <%= @node[:monit][:logfile] %>

set mailserver <%= @node[:monit][:mailserver][:host] %><%= " port #{@node[:monit][:mailserver][:port]}" if @node[:monit][:mailserver][:port] %>
<% if @node[:monit][:mailserver][:username] %>
  username "<%= @node[:monit][:mailserver][:username] %>"
<% end %>
<% if @node[:monit][:mailserver][:password] %>
  password "<%= @node[:monit][:mailserver][:password] %>"<%= " #{@node[:monit][:mailserver][:password_suffix]}" if @node[:monit][:mailserver][:password_suffix] %>
<% end %>

set eventqueue
    basedir /var/monit  # set the base directory where events will be stored
#    slots 1000          # optionaly limit the queue size

set mail-format {
  from: <%= @node[:monit][:mail_format][:from] %>
  subject: <%= @node[:monit][:mail_format][:subject] %>
  message: <%= @node[:monit][:mail_format][:message] %>
}

set alert <%= @node[:monit][:notify_email] %> NOT ON { action, instance, pid, ppid }

set httpd port <%= node[:monit][:port] %>
  <%= "use address #{node[:monit][:address]}" if node[:monit][:address] %>
<% node[:monit][:allow].each do |a| %>
  allow <%= "#{a}" %>
<% end %>
<% if node[:monit][:ssl] %>
  ssl enable
  pemfile <%= node[:monit][:cert] %>
<% end %>

include /etc/monit/conf.d/*.conf
{% endhighlight %}

File: recipes/default.rb

{% highlight ruby %}
package "monit"
{% endhighlight %}

First test should pass:

{% highlight bash %}
$ rspec

monit::default
  install monit package
  enable monit service (FAILED - 1)
  create direcory for custom services (FAILED - 2)
  create main monit config (FAILED - 3)

  ...

Finished in 0.06091 seconds
4 examples, 3 failures

Failed examples:

rspec ./spec/unit/recipes/default_spec.rb:10 # monit::default enable monit service
rspec ./spec/unit/recipes/default_spec.rb:14 # monit::default create direcory for custom services
rspec ./spec/unit/recipes/default_spec.rb:21 # monit::default create main monit config
{% endhighlight %}

Perfect! Let's fix rest tests:

File: recipes/default.rb

{% highlight ruby %}
package "monit"

service "monit" do
  action [:enable, :start]
  enabled true
  supports [:start, :restart, :stop]
end

directory "/etc/monit/conf.d/" do
  owner  'root'
  group 'root'
  mode 0755
  action :create
  recursive true
end

template "/etc/monit/monitrc" do
  owner "root"
  group "root"
  mode 0700
  source 'monitrc.erb'
  notifies :restart, resources(:service => "monit"), :delayed
end
{% endhighlight %}

And check tests:

{% highlight bash %}
$ rspec

monit::default
  install monit package
  enable monit service
  create direcory for custom services
  create main monit config

Finished in 0.06594 seconds
4 examples, 0 failures
{% endhighlight %}

Ok, tests pass.

# Checking by Foodcritic

Now need check our cookbook by foodcritic:

{% highlight bash %}
$ foodcritic .
FC002: Avoid string interpolation where not required: ./templates/default/monitrc.erb:31
FC019: Access node attributes in a consistent manner: ./attributes/default.rb:8
FC027: Resource sets internal attribute: ./recipes/default.rb:12
FC043: Prefer new notification syntax: ./recipes/default.rb:26
{% endhighlight %}

We should fix this warnings:

FC002: Avoid string interpolation where not required: ./templates/default/monitrc.erb:31

{% highlight bash %}
--- a/templates/default/monitrc.erb
+++ b/templates/default/monitrc.erb
@@ -28,7 +28,7 @@ set alert <%= @node[:monit][:notify_email] %> NOT ON { action, instance, pid, pp
 set httpd port <%= node[:monit][:port] %>
   <%= "use address #{node[:monit][:address]}" if node[:monit][:address] %>
 <% node[:monit][:allow].each do |a| %>
-  allow <%= "#{a}" %>
+  allow <%= a.to_s %>
 <% end %>
 <% if node[:monit][:ssl] %>
   ssl enable
{% endhighlight %}

FC019: Access node attributes in a consistent manner: ./attributes/default.rb:8

{% highlight bash %}
--- a/attributes/default.rb
+++ b/attributes/default.rb
@@ -5,7 +5,7 @@ default[:monit][:poll_period]           = 60
 default[:monit][:poll_start_delay]      = 120

 default[:monit][:mail_format][:subject] = "$SERVICE $EVENT"
-default[:monit][:mail_format][:from]    = "monit@#{node['fqdn']}"
+default[:monit][:mail_format][:from]    = "monit@#{node[:fqdn]}"
 default[:monit][:mail_format][:message]    = <<-EOS
 Monit $ACTION $SERVICE at $DATE on $HOST: $DESCRIPTION.
 Yours sincerely,
{% endhighlight %}

FC027: Resource sets internal attribute: ./recipes/default.rb:12
FC043: Prefer new notification syntax: ./recipes/default.rb:26

{% highlight bash %}
--- a/recipes/default.rb
+++ b/recipes/default.rb
@@ -11,7 +11,6 @@ package "monit"

 service "monit" do
   action [:enable, :start]
-  enabled true
   supports [:start, :restart, :stop]
 end

@@ -28,5 +27,5 @@ template "/etc/monit/monitrc" do
   group "root"
   mode 0700
   source 'monitrc.erb'
-  notifies :restart, resources(:service => "monit"), :delayed
+  notifies :restart, "service[monit]", :delayed
 end
{% endhighlight %}

And check foodcritic and tests:

{% highlight bash %}
$ foodcritic .

$ rspec

monit::default
  install monit package
  enable monit service
  create direcory for custom services
  create main monit config

Finished in 0.07382 seconds
4 examples, 0 failures
{% endhighlight %}

# Working with different OS

Now I will show how work with different OS. In our attributes we add such default attribute:

{% highlight ruby %}
case node[:platform_family]
when "rhel", "fedora", "suse"
  default[:monit][:main_config_path]  = "/etc/monit.conf"
  default[:monit][:includes_dir]      = "/etc/monit.d"
  default[:monit][:cert]              = "/etc/monit.pem"
else
  default[:monit][:main_config_path]  = "/etc/monit/monitrc"
  default[:monit][:includes_dir]      = "/etc/monit/conf.d"
  default[:monit][:cert]              = "/etc/monit/monit.pem"
end
{% endhighlight %}

And change tests:

{% highlight ruby %}
require 'chefspec'

describe 'monit::default' do
  let(:platfom) { 'ubuntu' }
  let(:platfom_version) { '12.04' }
  let(:chef_run) { ChefSpec::Runner.new(platform: platfom, version: platfom_version).converge(described_recipe) }

  it 'install monit package' do
    expect(chef_run).to install_package('monit')
  end

  it 'enable monit service' do
    expect(chef_run).to enable_service('monit')
  end

  it 'create direcory for custom services' do
    expect(chef_run).to create_directory('/etc/monit/conf.d').with(
      user:   'root',
      group:  'root'
    )
  end

  it 'create main monit config' do
    expect(chef_run).to create_template('/etc/monit/monitrc')
  end

  it 'reload daemon on change config' do
    resource = chef_run.template('/etc/monit/monitrc')
    expect(resource).to notify('service[monit]').to(:restart)
  end

  context "rhel system" do
    let(:platfom) { 'centos' }
    let(:platfom_version) { '6.3' }

    it 'create direcory for custom services' do
      expect(chef_run).to create_directory('/etc/monit.d').with(
        user:   'root',
        group:  'root'
      )
    end

    it 'create main monit config' do
      expect(chef_run).to create_template('/etc/monit.conf')
    end

    it 'reload daemon on change config' do
      resource = chef_run.template('/etc/monit.conf')
      expect(resource).to notify('service[monit]').to(:restart)
    end
  end

end
{% endhighlight %}

And fix tests in recipe default.rb:

{% highlight ruby %}
directory node[:monit][:includes_dir] do
  owner  'root'
  group 'root'
  mode 0755
  action :create
  recursive true
end

template node[:monit][:main_config_path] do
  owner "root"
  group "root"
  mode 0700
  source 'monitrc.erb'
  notifies :restart, "service[monit]", :delayed
end
{% endhighlight %}

Now we can again check tests:

{% highlight bash %}
$ rspec

monit::default
  install monit package
  enable monit service
  create direcory for custom services
  create main monit config
  reload daemon on change config
  rhel system
    create direcory for custom services
    create main monit config
    reload daemon on change config

Finished in 0.15188 seconds
8 examples, 0 failures
{% endhighlight %}

# Working with Fauxhai

In default attributes we have such attribute:

{% highlight ruby %}
default[:monit][:mail_format][:from]    = "monit@#{node[:fqdn]}"
{% endhighlight %}

where "fqdn" is attribute from ohai. Let's check by Fauxhai what this attribute will work in corrent way. Add this test:

{% highlight ruby %}
context "mail to attribute" do
  before do
    Fauxhai.mock(platform: platfom, version: platfom_version) # fqdn == fauxhai.local
  end

  it 'it should be monit@fauxhai.local' do
    expect(chef_run).to render_file('/etc/monit/monitrc').with_content(/monit@fauxhai\.local/)
  end
end
{% endhighlight %}

And run tests:

{% highlight bash %}
$ rspec

monit::default
  install monit package
  enable monit service
  create direcory for custom services
  create main monit config
  reload daemon on change config
  rhel system
    create direcory for custom services
    create main monit config
    reload daemon on change config
  mail to attribute
    it should be monit@fauxhai.local

Finished in 0.1829 seconds
9 examples, 0 failures
{% endhighlight %}


# Using test-kitchen

Now let's begin testing by test-kitchen. First we need initialize it:

{% highlight bash %}
$ kitchen init
      create  .kitchen.yml
      append  Thorfile
      create  test/integration/default
      append  .gitignore
      append  .gitignore
{% endhighlight %}

This will create file ".kitchen.yml", which contain all settings for test-kitchen:

{% highlight yaml %}
---
driver:
  name: vagrant

provisioner:
  name: chef_solo

platforms:
  - name: ubuntu-12.04

suites:
  - name: default
    run_list:
      - recipe[monit::default]
    attributes:
{% endhighlight %}

Let's add integration tests:

File: test/integration/default/minitest/test\_default.rb

{% highlight ruby %}
require 'minitest/spec'

describe 'monit::default' do

  it "install monit" do
    package("monit").must_be_installed
  end

  describe "services" do

    # You can assert that a service must be running following the converge:
    it "runs as a daemon" do
      service("monit").must_be_running
    end

    # And that it will start when the server boots:
    it "boots on startup" do
      service("monit").must_be_enabled
    end

  end

end
{% endhighlight %}


About this setting better read on [this page](https://github.com/test-kitchen/test-kitchen#the-kitchen-yaml-format). Next run command "kitchen test" for begin testing:

{% highlight bash %}
$ kitchen test --parallel
-----> Starting Kitchen (v1.0.0.rc.2)
-----> Cleaning up any prior instances of <default-ubuntu-1204>
-----> Destroying <default-ubuntu-1204>...
       Finished destroying <default-ubuntu-1204> (0m0.00s).
-----> Testing <default-ubuntu-1204>
-----> Creating <default-ubuntu-1204>...

       ...

-----> Setting up Busser
      Creating BUSSER_ROOT in /tmp/busser
      Creating busser binstub
      Plugin minitest installed (version 0.2.0)
-----> Running postinstall for minitest plugin
      Finished setting up <default-ubuntu-1204> (0m39.45s).
-----> Verifying <default-ubuntu-1204>...
      Suite path directory /tmp/busser/suites does not exist, skipping.
Uploading /tmp/busser/suites/minitest/test_default.rb (mode=0644)
-----> Running minitest test suite
/opt/chef/embedded/bin/ruby  -I"/opt/chef/embedded/lib/ruby/1.9.1" "/opt/chef/embedded/lib/ruby/1.9.1/rake/rake_test_loader.rb" "/tmp/busser/suites/minitest/test_default.rb"
      Finished verifying <default-ubuntu-1204> (0m1.58s).
{% endhighlight %}

Now we can test our cookbook on different OS. By this technique we check, what environment setuped by cookbook as expected. More about test-kitchen you can read [here](https://github.com/test-kitchen/test-kitchen/wiki/Getting-Started).

# Summary

In this article I am cover how to write Chef cookbook by TDD. Hope this article will help for you write best cookbooks for Chef.

*That’s all folks!* Thank you for reading till the end.