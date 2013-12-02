---
layout: post
title: Chef cookbooks development by TDD
date: 2013-12-01 00:00:00
categories:
- chef
tags:
- chef
- tdd
---
Hello my dear friends. Today we will continue to talk about Chef. But today my article will be about Chef cookbooks by [TDD](http://en.wikipedia.org/wiki/Test-driven_development). If you don't know what is Chef and how to use it, then you should better start with my [articles](/2013/01/04/chef-solo-getting-started-part-1/) about it. All code examples you can find here: [github.com/le0pard/chef-tdd-monit](https://github.com/le0pard/chef-tdd-monit).

# Chef testing tools

First, let's look what tools exist to test Chef cookbooks today.

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

## Test-kitchen

* [Site](https://github.com/test-kitchen/test-kitchen)

Test-kitchen is a convergence integration test harness for configuration management systems.

## Chef Zero

* [Site](https://github.com/opscode/chef-zero)

Chef Zero is a simple, easy-install, in-memory Chef server that can be useful for Chef Client testing and chef-solo-like tasks that require a full Chef Server. Because Chef Zero runs in memory, it's super fast and lightweight. This makes it perfect for testing against a "real" Chef Server without mocking the entire Internet.


# Enough words. Let's start with the practice

First of all you should have installed Ruby and Rubygems. Let's create [monit](http://mmonit.com/monit/) cookbook by TDD. I generated structure of coobook by [berkshelf](http://berkshelf.com/):

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

Now we need to add gems in Gemfile, which we will use for testing:

{% highlight ruby %}
source 'https://rubygems.org'

gem 'berkshelf'

gem 'foodcritic'
gem 'fauxhai'
gem 'chefspec'
gem 'busser-bats'
gem 'busser-minitest'
gem 'test-kitchen', '1.0.0.rc.2'
group :integration do
  gem 'kitchen-vagrant', '0.12.0'
end
{% endhighlight %}

And you should to execute "bundle" command to install this gems.

## Using ChefSpec

First of all we should create tests for our monit cookbook:

File: spec/spec\_helper.rb

{% highlight ruby %}
require 'chefspec'
require 'chefspec/berkshelf' # I use berkshelf, but it also have librarian support

RSpec.configure do |config|
  #empty
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

Of course tests failed:

{% highlight bash %}
$ rspec

monit::default
  install monit package (FAILED - 1)
  enable monit service (FAILED - 2)
  create direcory for custom services (FAILED - 3)
  create main monit config (FAILED - 4)

 ...

Finished in 0.07275 seconds
4 examples, 4 failures

Failed examples:

rspec ./spec/unit/recipes/default_spec.rb:6 # monit::default install monit package
rspec ./spec/unit/recipes/default_spec.rb:10 # monit::default enable monit service
rspec ./spec/unit/recipes/default_spec.rb:14 # monit::default create direcory for custom services
rspec ./spec/unit/recipes/default_spec.rb:21 # monit::default create main monit config
{% endhighlight %}

Let's fix these tests by writing cookbook code:

File: attributes/default.rb

{% highlight ruby %}
default[:monit][:notify_email]          = "notify@example.com"
default[:monit][:logfile]               = 'syslog facility log_daemon'

default[:monit][:poll_period]           = 60
default[:monit][:poll_start_delay]      = 120

...
{% endhighlight %}

File: templates/default/monitrc.erb

{% highlight ruby %}
set daemon <%= @node[:monit][:poll_period] %>
<% if @node[:monit][:poll_start_delay] %>
  with start delay <%= @node[:monit][:poll_start_delay] %>
<% end %>
...
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

Perfect! Let's fix rest of the tests:

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

And again I will check tests:

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

Ok, tests passed.

## Checking by Foodcritic

Now we need to check our cookbook by foodcritic:

{% highlight bash %}
$ foodcritic .
FC002: Avoid string interpolation where not required: ./templates/default/monitrc.erb:31
FC019: Access node attributes in a consistent manner: ./attributes/default.rb:8
FC027: Resource sets internal attribute: ./recipes/default.rb:12
FC043: Prefer new notification syntax: ./recipes/default.rb:26
{% endhighlight %}

We have a few warnings in the code. Let's fix them:

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

And I will check foodcritic and tests:

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

## Working with different operating systems

Now I will show how to work with different operating systems. I will add such default attributes in our attributes :

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

And I will change tests:

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

Now we should fix tests in recipe:

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

And we again will check tests:

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

## Working with Fauxhai

In default attributes we have such attribute:

{% highlight ruby %}
default[:monit][:mail_format][:from]    = "monit@#{node[:fqdn]}"
{% endhighlight %}

where "fqdn" is attribute from ohai. Let's check by Fauxhai is this attribute will work corrently. Add this test:

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

May be this example is not perfect for Fauxhai (because we couldn't change "fqdn" using method "mock"), but this should help you to understand how you can use it.

## Using test-kitchen, bats and minitest

Now let's begin testing using test-kitchen. First we need to initialize it:

{% highlight bash %}
$ kitchen init
      create  .kitchen.yml
      append  Thorfile
      create  test/integration/default
      append  .gitignore
      append  .gitignore
{% endhighlight %}

This command will create file ".kitchen.yml", which contains all settings for test-kitchen:

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
    attributes: {}
{% endhighlight %}

About this setting you can read here [this page](https://github.com/test-kitchen/test-kitchen#the-kitchen-yaml-format). Let's add integration tests. I use them for this [bats](https://github.com/sstephenson/bats):

File: test/integration/default/bats/default.bats

{% highlight bash %}
@test "monit is installed and in the path" {
  which monit
}

@test "monit configuration dir exists" {
  [ -d "/etc/monit" ]
}
{% endhighlight %}

And [minitest](https://github.com/seattlerb/minitest):

File: test/integration/default/minitest/test\_default.rb

{% highlight ruby %}
require 'minitest/autorun'

describe 'monit::default' do

  it "install monit" do
    assert system('apt-cache policy monit | grep Installed | grep -v none')
  end

  describe "services" do

    # You can assert that a service must be running following the converge:
    it "runs as a daemon" do
      assert system('/etc/init.d/monit status')
    end

    # And that it will start when the server boots:
    it "boots on startup" do
      assert File.exists?(Dir.glob("/etc/rc5.d/S*monit").first)
    end

  end

end
{% endhighlight %}

It is not neccessary to use bats and minitests together in the same cookbook. I use both in this cookbook to show simple example.

Finaly, run command "kitchen test" to begin testing:

{% highlight bash %}
$ kitchen test --parallel
-----> Starting Kitchen (v1.0.0.rc.2)
-----> Cleaning up any prior instances of <default-ubuntu-1204>
-----> Destroying <default-ubuntu-1204>...
       Finished destroying <default-ubuntu-1204> (0m0.00s).
-----> Testing <default-ubuntu-1204>
-----> Creating <default-ubuntu-1204>...

       ...

-----> Running bats test suite
✓ monit is installed and in the path
✓ monit configuration dir exists

2 tests, 0 failures
-----> Running minitest test suite
/opt/chef/embedded/bin/ruby  -I"/opt/chef/embedded/lib/ruby/1.9.1" "/opt/chef/embedded/lib/ruby/1.9.1/rake/rake_test_loader.rb" "/tmp/busser/suites/minitest/test_default.rb"
Run options: --seed 42931

# Running tests:

 Installed: 1:5.3.2-1
. * monit is running
      ..

      Finished tests in 0.027586s, 108.7507 tests/s, 108.7507 assertions/s.

      3 tests, 3 assertions, 0 failures, 0 errors, 0 skips
      Finished verifying <default-ubuntu-1204> (0m2.94s).
-----> Destroying <default-ubuntu-1204>...

{% endhighlight %}

Of course my tests are not designed to work on different types of systems (on CentOS they will fail), my goal was to show how you can test environment after your cookbook. More about test-kitchen you can read [here](https://github.com/test-kitchen/test-kitchen/wiki/Getting-Started).

# Summary

In this article I covered how to write Chef cookbook by TDD. Hope it will help you to write better cookbooks for Chef. All code examples you can find here: [github.com/le0pard/chef-tdd-monit](https://github.com/le0pard/chef-tdd-monit).

*That’s all folks!* Thank you for reading till the end.
