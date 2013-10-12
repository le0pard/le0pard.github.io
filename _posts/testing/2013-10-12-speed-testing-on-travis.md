---
layout: post
title: Speed up testing of ruby projects on Travis-CI
date: 2013-10-12 00:00:00
categories:
- testing
tags:
- testing
- travis
---
Hello my dear friends. Today we will talk about [Travis-CI](https://travis-ci.org/) testing and how to speed up testing for ruby projects.

# Caching .bundle directory

For many ruby projects a lot of time for preparing a build are spend by Travis-CI. The main reason for this is the installation of the required gems for your project. Eric Barendt and Matias Korhonen found a good solution for this problem - caching all needed gems in AWS S3. For this purpose they created [bundle_cache](https://rubygems.org/gems/bundle_cache) gem. Let's setup it.

First of all, you need AWS credentials and you should create the AWS S3 bucket, where cached gems will be stored. This gem need to set some environment variables.

{% highlight bash %}
AWS_S3_KEY=<your aws access key>
AWS_S3_SECRET=<your aws secret>
AWS_S3_BUCKET=<your bucket name>
AWS_S3_REGION=<optional, aws s3 region, default us-east-1>
BUNDLE_ARCHIVE=<the filename to use for your cache>
{% endhighlight %}

So we need change our .travis.yml file in project:

{% highlight yaml %}
language: ruby
bundler_args: --without development --path=~/.bundle
rvm:
- 2.0.0
before_install:
- 'echo ''gem: --no-ri --no-rdoc'' > ~/.gemrc'
- gem install bundler bundle_cache
- bundle_cache_install
before_script:
- cp config/database.travis.yml config/database.yml
- bundle exec rake db:create db:migrate db:schema:load
after_script:
- bundle_cache
env:
  global:
  - BUNDLE_ARCHIVE="test-bundle"
  - AWS_S3_BUCKET="travisci-bundler-cache"
  - RAILS_ENV=test
{% endhighlight %}

Main commands are located in the keys "before\_install", "bundler_args", "env" and "after\_script". Let's analyze what each command are doing:

{% highlight yaml %}
bundler_args: --without development --path=~/.bundle # set for bundler install all gems, except "development" group and use "~/.bundle" folder for this gems
before_install:
- 'echo ''gem: --no-ri --no-rdoc'' > ~/.gemrc' # skip installing docs for gems
- gem install bundler bundle_cache # install bundler and bundle_cache gems
- bundle_cache_install # download cached gems and unpack them in "~/.bundle" folder
after_script:
- bundle_cache # pack "~/.bundle" folder and upload to AWS S3
env:
  global:
  - BUNDLE_ARCHIVE="test-bundle" # set name for cached gems file
  - AWS_S3_BUCKET="travisci-bundler-cache" # set S3 bucket name
{% endhighlight %}

Also you'll need to add your AWS credentials to a secure section there.  Adding of this credentials is simple:

1. Install the travis gem using command `gem install travis`
2. Log into Travis with `travis login --auto` (from inside of your project respository directory), for Travis Pro use command `travis login --pro`.
3. Encrypt your S3 credentials using command `travis encrypt AWS_S3_KEY="" AWS_S3_SECRET="" --add` (be sure you add your actual credentials inside the double quotes)

In your .travis.yml file something like this will be added :

{% highlight yaml %}
env:
  global:
  - BUNDLE_ARCHIVE="test-bundle"
  - AWS_S3_BUCKET="travisci-bundler-cache"
  - RAILS_ENV=test
  - secure: wqeqweheo3H743Iob4s8qweqwec0tcv0JGlg8JBhccCPnIiFUArqwe=
{% endhighlight %}

When you first start testing on Travis-CI you will see the next:

{% highlight bash %}
$ echo 'gem: --no-ri --no-rdoc' > ~/.gemrc
$ gem install bundler bundle_cache
Fetching: bundler-1.3.5.gem (100%)
Successfully installed bundler-1.3.5
Fetching: uuidtools-2.1.4.gem (100%)
Successfully installed uuidtools-2.1.4
Fetching: nokogiri-1.5.10.gem (100%)
Building native extensions.  This could take a while...
Successfully installed nokogiri-1.5.10
Fetching: aws-sdk-1.21.0.gem (100%)
Successfully installed aws-sdk-1.21.0
Fetching: bundle_cache-0.1.0.gem (100%)
Successfully installed bundle_cache-0.1.0
5 gems installed
$ bundle_cache_install
=> Downloading the bundle
There's no such archive!
$ bundle install --without development --path=~/.bundle

....

$ bundle_cache
Checking for changes
=> There was no existing digest, uploading a new version of the archive
=> Preparing bundle archive
=> Uploading the bundle
  => Uploading 18 parts
    => Uploading /home/travis/test-bundle-x86_64.tgz.aaa
      => Uploaded
    => Uploading /home/travis/test-bundle-x86_64.tgz.aab
      => Uploaded
    => Uploading /home/travis/test-bundle-x86_64.tgz.aac
      => Uploaded
    => Uploading /home/travis/test-bundle-x86_64.tgz.aad
      => Uploaded
    => Uploading /home/travis/test-bundle-x86_64.tgz.aae
      => Uploaded
    => Uploading /home/travis/test-bundle-x86_64.tgz.aaf
      => Uploaded
    => Uploading /home/travis/test-bundle-x86_64.tgz.aag
      => Uploaded
    => Uploading /home/travis/test-bundle-x86_64.tgz.aah
      => Uploaded
    => Uploading /home/travis/test-bundle-x86_64.tgz.aai
      => Uploaded
    => Uploading /home/travis/test-bundle-x86_64.tgz.aaj
      => Uploaded
    => Uploading /home/travis/test-bundle-x86_64.tgz.aak
      => Uploaded
    => Uploading /home/travis/test-bundle-x86_64.tgz.aal
      => Uploaded
    => Uploading /home/travis/test-bundle-x86_64.tgz.aam
      => Uploaded
    => Uploading /home/travis/test-bundle-x86_64.tgz.aan
      => Uploaded
    => Uploading /home/travis/test-bundle-x86_64.tgz.aao
      => Uploaded
    => Uploading /home/travis/test-bundle-x86_64.tgz.aap
      => Uploaded
    => Uploading /home/travis/test-bundle-x86_64.tgz.aaq
      => Uploaded
    => Uploading /home/travis/test-bundle-x86_64.tgz.aar
      => Uploaded
  => Completed multipart upload
=> Uploading the digest file
All done now.
{% endhighlight %}

But for the next testing you will see the similar image:

{% highlight bash %}
$ echo 'gem: --no-ri --no-rdoc' > ~/.gemrc
$ gem install bundler bundle_cache
Fetching: bundler-1.3.5.gem (100%)
Successfully installed bundler-1.3.5
Fetching: uuidtools-2.1.4.gem (100%)
Successfully installed uuidtools-2.1.4
Fetching: nokogiri-1.5.10.gem (100%)
Building native extensions.  This could take a while...
Successfully installed nokogiri-1.5.10
Fetching: aws-sdk-1.21.0.gem (100%)
Successfully installed aws-sdk-1.21.0
Fetching: bundle_cache-0.1.0.gem (100%)
Successfully installed bundle_cache-0.1.0
5 gems installed
$ bundle_cache_install
=> Downloading the bundle
  => Completed bundle download
=> Extract the bundle
=> Downloading the digest file
  => Completed digest download
=> All done!
$ bundle install --without development --path=~/.bundle

....

$ bundle_cache
Checking for changes
=> There were no changes, doing nothing
All done now.
{% endhighlight %}

Command "bundle install" will work very fast, because all needed gems are already present in "~/.bundle" folder. For my project testing speed was faster for 5 minutes (the duration of testing was decreased from 13 to 8 minutes).

# Loading database scheme without rake command

When you run `rake db:create db:migrate`, command is load the Rails environment, which of course is not so fast. You can load your database scheme much faster by using built-in database tools (mysql, psql). Set in "config/application.rb" for your rails project:

{% highlight ruby %}
config.active_record.schema_format = :sql
{% endhighlight %}

In this case you rails app database scheme will be stored in sql format. Next, you should add such commands in ".travis.yml" file (example for PostgreSQL):

{% highlight ruby %}
before_install:
 - "psql -c 'create database DB_NAME;' -U postgres"
 - "psql -U postgres -q -d DB_NAME -f db/structure.sql"
 - "cp -f config/database.travis.yml config/database.yml"
{% endhighlight %}

In you project file "database.travis.yml" should exist, which contains "DB\_NAME". For my project testing speed was faster for 1 minutes (the duration of testing decreased from 8 to 7 minutes).

# Parallelizing your builds across virtual machines

To speed up a test suite, you can split it to the several parts using Travis-CI build [matrix](http://about.travis-ci.org/docs/user/build-configuration/#The-Build-Matrix) feature. Say you want to split up your unit tests and your integration tests into two different build jobs. They’ll run in parallel and fully utilize the available build capacity for your account.

Here's an example on how to utilize this feature in your .travis.yml:

{% highlight yaml %}
env:
  - TEST_SUITE=units
  - TEST_SUITE=integration
script: "bundle exec rake test:$TEST_SUITE"
{% endhighlight %}

Travis will determine the build matrix based on the environment variables and schedule two builds to run.

Depending on the size and complexity of your test suite you can split it up even further. You could separate different concerns for the integration tests into different subfolders and run them in separate stages of the matrix building.

{% highlight yaml %}
env:
  - TESTFOLDER=spec/features
  - TESTFOLDER=spec/requests
  - TESTFOLDER=spec/models
script: "bundle exec rspec $TESTFOLDER"
{% endhighlight %}

# Paralellizing your build on one VM

Travis CI VMs run on 1.5 virtual cores. This is not exactly a concurrency, which allows to parallelize a lot, but it can give a nice speedup depending on case you use. Parallelizing the test suite on one VM depends on the language and test runner, which you use, so you will have to research your options. For Ruby and RSpec you can use [parallel_tests](https://github.com/grosser/parallel_tests) gem.

# Summary

This article describes some techniques for speeding up the testing of your Ruby project at Travis-CI. Of course others techniques can be exist which I did not mention, but these ones helped to reduce the testing time of the projects in several times.

*That’s all folks!* Thank you for reading till the end.