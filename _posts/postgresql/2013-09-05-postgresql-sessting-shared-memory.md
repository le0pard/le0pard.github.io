---
layout: post
title: Setting up shared memory for PostgreSQL
date: 2013-09-05 00:00:00
categories:
- postgresql
tags:
- postgresql
- shared memory
---

Hello my dear friends. In this article I will cover about setting up shared memory on Linux for PostgreSQL.

# What is shared memory?

**Shared memory** is memory that may be simultaneously accessed by multiple programs with an intent to provide communication among them or avoid redundant copies. Shared memory is an efficient means of passing data between programs. Using memory for communication inside a single program, for example among its multiple threads, is also referred to as shared memory.

# PostgreSQL and shared memory

A message like

{% highlight bash %}
FATAL:  could not create shared memory segment: Invalid argument
DETAIL:  Failed system call was shmget(key=5440001, size=4011376640, 03600).
{% endhighlight %}

probably means your kernel's limit on the size of shared memory is smaller than the work area PostgreSQL is trying to create (4011376640 bytes in this example). Or it could mean that you do not have System-V-style shared memory support configured into your kernel at all. As a temporary workaround, you can try starting the server with a smaller-than-normal number of buffers (shared_buffers).

# Configure shared memory

We must to setup our Unix system shared memory, if we want tune PostgreSQL. We can by [this link] (http://www.postgresql.org/docs/current/static/kernel-resources.html) and see how to setup it. But what values to set for shmmax and shmall? To do this, I made a small script. Its mission - to calculate and display the size of shared memory, which is half the available memory on the server:

{% highlight bash %}
#!/bin/bash
# simple shmsetup script
page_size=`getconf PAGE_SIZE`
phys_pages=`getconf _PHYS_PAGES`
shmall=`expr $phys_pages / 2`
shmmax=`expr $shmall \* $page_size`
echo kernel.shmmax = $shmmax
echo kernel.shmall = $shmall
{% endhighlight %}

For example, for a server with 2GB of RAM script will generate the following:

{% highlight bash %}
kernel.shmmax = 1055092736
kernel.shmall = 257591
{% endhighlight %}

Here SHMMAX maximum size (in bytes) on the segment of shared memory, is set to 1 GB. SHMALL - the total amount of shared memory (in pages), which all processes on the server can use. The number of bytes in a page depends on the operating system, basically, the default is 4096 bytes. In order to have these data have applied for Linux (Ubuntu, Debian), run this command from the root (./shmsetup - the script):

{% highlight bash %}
$ ./shmsetup >> /etc/sysctl.conf
{% endhighlight %}

And check that:

{% highlight bash %}
$ sysctl -p
{% endhighlight %}

Also do not forget about semaphores in the system:

{% highlight bash %}
$ ipcs -l
------ Semaphore Limits --------
max number of arrays = 128
max semaphores per array = 250
max semaphores system wide = 32000
max ops per semop call = 32
semaphore max value = 32767
{% endhighlight %}

The values in sysctl:

{% highlight bash %}
$ sysctl kernel.sem = 250 32000 32 128
{% endhighlight %}

All four values may need to be increased on systems with a large number of processes.

# PostgreSQL 9.3

In 9.3, PostgreSQL has switched from using SysV shared memory to using Posix shared memory and mmap for memory management. This allows easier installation and configuration of PostgreSQL, and means that except in usual cases, system parameters such as SHMMAX and SHMALL no longer need to be adjusted.

# Summary

As can be seen, setting up shared memory on Linux for PostgreSQL is not so hard. Good luck.

*That’s all folks!* Thank you for reading till the end.