---
layout: post
title: Check your build status in Travis CI by Sphero
date: 2013-09-19 00:00:00
categories:
- sphero
- fun
tags:
- sphero
- fun
---

Hello my dear friends. In this article we will learn how to check our travis ci build status by sphero.

# What is Sphero?

<a href="/assets/images/fun/sphero/sphero1.png"><amp-img src="/assets/images/fun/sphero/sphero1.png" alt="sphero" title="sphero" width="644" height="483" class="aligncenter" /></a>

Sphero is small spherical robot. More info you can find on [official page](http://www.gosphero.com/) and see it in [this video](http://www.youtube.com/watch?v=5Bg88VkWGOQ).

Yes, this is just a toy. But this toy have [development docs](https://github.com/orbotix/DeveloperResources) and [many SDKs](https://developer.gosphero.com/). So you can create applications, which will manipulate Sphero for your needs.

# Travis CI

Travis CI is a hosted continuous integration service for the open source community. It is integrated with GitHub and can test many languages. I using Travis CI for my Open Source projects and for me good to know, if some my project have failed tests.

# Code

I chouse to use Ruby to write "SBSC" (Sphero Build Status Checker). For Ruby today exist very good library for working with robots - [Artoo](http://artoo.io/). Let's create Gemfile and add to it needed library:

{% highlight ruby %}
source 'http://rubygems.org'

gem 'artoo'
gem 'artoo-sphero'
gem 'hybridgroup-sphero'
gem 'hybridgroup-serialport'
gem 'travis'
{% endhighlight %}

Next we write code for for our "SBSC":

{% highlight ruby %}
require 'artoo'
require 'artoo/robot'
require 'travis'


class CISpheroRobot < Artoo::Robot
  connection :sphero, adaptor: :sphero
  device :sphero, driver: :sphero

  work do
    ci_repo = "le0pard/omniauth-yammer" # change on your github repo
    ci_branch = "master"
    repo = Travis::Repository.find(ci_repo)
    sphero.set_color(0, 0, 0) # reset to white color

    every(60.seconds) do
      case repo.branch(ci_branch).state
      when 'passed'
        puts "Your #{ci_repo} is green"
        sphero.set_color(0, 0, 0) # reset to white color
      when 'failed'
        puts "Your #{ci_repo} is failed"
        5.times do
          sphero.set_color rand(255),rand(255),rand(255)
          sphero.roll 20, rand(360)
          sleep 0.5
        end
      else
        sphero.set_color(0, 0, 0)
      end
    end
  end
end


CISpheroRobot.work!(CISpheroRobot.new(connections: {sphero: {port: '/dev/tty.Sphero-GGY-AMP-SPP'}}))
{% endhighlight %}

So I created class "CISpheroRobot", which have block "work". In this method you can manipulate by sphero by object "sphero" with methods "set_color", "roll", etc. In the port you can see I used '/dev/tty.Sphero-GGY-AMP-SPP'. To find this info you can in terminal of MacOS "ls /dev/tty\*".

<a href="/assets/images/fun/sphero/sphero.png"><amp-img src="/assets/images/fun/sphero/sphero.png" alt="sphero" title="sphero" width="625" height="345" class="aligncenter" /></a>

# Result

Result you can see on this video (sorry for not good quality):

<amp-youtube
    data-videoid="P4JlJ3KrduA"
    layout="responsive"
    width="480" height="270">
</amp-youtube>


*That’s all folks!*