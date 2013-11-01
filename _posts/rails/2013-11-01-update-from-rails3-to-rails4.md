---
layout: post
title: How I update project from Rails 3 to Rails 4
date: 2013-11-01 00:00:00
categories:
- rails
tags:
- rails
- migration
---
Hello my dear friends.

Work with large projects often requires repayment of the technical debts: update some libs, сode refactoring, etc. In my case I should move the project from rails 3 to rails 4. In this article I will tell how I did it.

## Step 0: Tests!!!

First of all, you project must have huge test coverage. In my project we have 93.52% code covered by tests. Yep, it is hard. But without tests thinking about update of some libs or doing сode refactoring in your project will be the same as playing "Russian roulette" - maybe you will win, maybe no. So first of all, before making update for rails 4 you have to check code coverage in your project ([simplecov](https://github.com/colszowka/simplecov) very good library for this) and cover by tests missed parts.

## Step 1: Ruby 1.9.3 or 2.0.0

Rails 4 requires Ruby 1.9.3 and recommends Ruby 2.0.0. Attempting to run Rails 4 with a Ruby version below 1.9.3 will cause syntax errors or runtime issues. So first of all you should migrate your project to new Ruby version. We have been using the last ruby 2.0.0 in this project, so we did not have such problem :)

## Step 2: Strong\_Parameters

First huge change in the rails 4 is [strong\_parameters](https://github.com/rails/strong_parameters). I began to change project by removing whitelist\_attributes and migration to strong\_parameters. We need to change some settings in our projects to do this. First of all, we have to add strong\_parameters to Gemfile:

{% highlight ruby %}
gem "strong_parameters"
{% endhighlight %}

Next changes will be in "config/application.rb" whitelist\_attributes settings:

{% highlight ruby %}
config.active_record.whitelist_attributes = false
{% endhighlight %}

And then add "strong\_parameters.rb" file in "config/initializers" with this content:

{% highlight ruby %}
ActiveRecord::Base.send(:include, ActiveModel::ForbiddenAttributesProtection)
{% endhighlight %}

After this change you have to remove "attr\_accessible" from models and use "strong\_parameters" in controllers. Use the tests to verify that you migrated without problems in strong\_parameters (I used tests in each step).

## Step 3: Routes

Method "match" can be used only for routes, which should accept several types of requests (GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS).

{% highlight ruby %}
match 'subscriptions/:subscription_id' => 'news#create', via: [:post, :put, :patch]
{% endhighlight %}

But if you have something like this:

{% highlight ruby %}
match '/terms' => 'site#terms'
{% endhighlight %}

you have to change it to a right type of the request:

{% highlight ruby %}
get '/terms' => 'site#terms'
{% endhighlight %}

Again, check all changes by tests :)

## Step 4: Gems

Migration of the rails 3 app to the rails 4 requires gem updates. Some gems in your Gemfile can be migrated to new version, which can work in both in rails 3 and in rails 4. For example, we will start with the migration of the devise gem. First of all, I read changelog of this gem to understand differences between versions and know what to change in migration. Check all by tests (also by manual check, tests do not guarantee 100% success) and select another gem for migration.

The "rails4\_upgrade" gem helps to automate some of the processes required to the upgrade to the Rails 4. It add rake task to check old versions of gems:

{% highlight ruby %}
$ bundle exec rake rails4:check_gems
{% endhighlight %}

Some of gems stopped to support rails 3 and support just rails 4. In this case better to read, what were changed in a gem in changelog and add migration notes, in case you have to do some work with this gem after update to rails 4.

## Step 5: Change Rails version in Gemfile

Open Gemfile in a text editor and change the line that starts with gem 'rails' to:

{% highlight ruby %}
gem 'rails', '~> 4.0.1rc3'
{% endhighlight %}

Why did I use RC? Just because 4.0.0 have some bugs, which broke my app (my main problem was fixed by [this pull request](https://github.com/rails/rails/pull/11496))

Rails 4 also depends on newer versions of gems that drive the asset pipeline (assets group must be removed):

{% highlight ruby %}
gem 'sass-rails', '~> 4.0.0'
gem 'coffee-rails', '~> 4.0.0'
gem 'uglifier', '>= 1.3.0'
{% endhighlight %}

Rails 4 moves many features into gems that were previously shipped with Rails itself. You can found list of this gems on [this page](http://www.andylindeman.com/2013/03/05/gems-extracted-in-rails-4.html). In my case I need:

{% highlight ruby %}
# used cache_page
gem 'actionpack-page_caching', '1.0.0'
# xml requests from some services
gem 'actionpack-xml_parser', '1.0.0'
{% endhighlight %}

After "bundle update rails" you should change your rails app. [railsdiff.org](http://railsdiff.org/) will help you very much with this . In my project I had to  use [this diff](http://railsdiff.org/html/v3.2.15-v4.0.1.rc3.html).

Finally, I continue to update gems, which work only with rails 4

## Step 6: Fix fallen tests

No comments, just check your code and tests.

# Summary

As you can see migration process even of the big rails project is not so complicated if you do it with clear migration plan. There is open source book [upgradingtorails4](http://www.upgradingtorails4.com/), which can be very helpfull (I did this migration before this book was published).

*That’s all folks!* Thank you for reading till the end.