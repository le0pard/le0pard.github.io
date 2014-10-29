---
layout: post
title: Zopfli-ffi - Ruby wrapper for zopfli library
date: 2014-10-29 00:00:00
categories:
- ruby
tags:
- ruby
- zopfli
---
Hello my dear friends.

Today we will lear about Zopfli and how you can use it with Ruby.

# What is Zopfli?

[Zopfli](https://code.google.com/p/zopfli/) Compression Algorithm is a new zlib (gzip, deflate) compatible compressor, which at 3.7-8.3% more efficient than standard zlib library at the maximum level of compression. Initially the algorithm was designed for lossless compression [WebP format](/2013/11/23/rails-and-webp/), but it can be applied to other content.

The new algorithm is a standard "deflate" algorithm, so it is compatible with the zlib and gzip, and decompression of data is already supported by all browsers. Just connect zopfli to a server (for example, it can be used with a web server Nginx without changes in the module gzip, simply specifying a new "compressor").

However, compression using Zopfli requires about 100 times more resources than gzip (~100x slower), but the decompression is done in the browser at the same speed.

# Ruby and Zopfli

I wrote zopfli gem - [zopfli-ffi](http://leopard.in.ua/zopfli-ffi/). You can use this gem to work with zopfli (it can work with MRI, JRuby and RBX). This gem have only one main method - `compress`. You should provide file, which you want to compress compressions and file, which should store compressed result.

{% highlight ruby %}
uncompressed_file = 'spec/fixtures/test.txt'
compressed_file = 'spec/fixtures/test.txt.gz'

Zopfli.compress(uncompressed_file, compressed_file)
{% endhighlight %}

You can define format of compression (:zlib is default):

{% highlight ruby %}
Zopfli.compress(uncompressed_file, compressed_file, :zlib)
Zopfli.compress(uncompressed_file, compressed_file, :deflate)
Zopfli.compress(uncompressed_file, compressed_file, :gzip)
{% endhighlight %}

Also you can define number of iterations for compression (greater number - better compression, but slower compression time; default = 15):

{% highlight ruby %}
Zopfli.compress(uncompressed_file, compressed_file, :zlib, 15) # default format
Zopfli.compress(uncompressed_file, compressed_file, :deflate, 5)
Zopfli.compress(uncompressed_file, compressed_file, :zlib, 25)
{% endhighlight %}

# Benchmarking

Let's look at what time work and the result of compression will have Zopfli and ZLib. For this benchmark I created little Ruby script:

{% highlight ruby %}
require 'zopfli_ffi'
require 'zlib'
require 'benchmark'

in_dir = File.expand_path(File.dirname(__FILE__))
out_dir = File.expand_path(File.join(File.dirname(__FILE__), "../tmp/"))

Benchmark.bm(7) do |x|

  x.report("Gzip:") do
    Zlib::GzipWriter.open("#{out_dir}/1.jpg.gz") do |gz|
      gz.write IO.binread("#{in_dir}/1.jpg")
    end
  end

  x.report("Zopfli (5 iterations):") do
    Zopfli.compress("#{in_dir}/1.jpg", "#{out_dir}/1_5.jpg.zfl", :zlib, 5)
  end

  x.report("Zopfli (50 iterations):") do
    Zopfli.compress("#{in_dir}/1.jpg", "#{out_dir}/1_50.jpg.zfl", :zlib, 50)
  end

end
{% endhighlight %}

In the result we have such execution time:

{% highlight bash %}
$ bundle exec ruby spec/benchmark.rb
                        user        system      total         real
Gzip:                   0.600000    0.190000    0.790000      (0.944868)
Zopfli (5 iterations):  124.330000  20.880000   145.210000    (145.643881)
Zopfli (50 iterations): 558.800000  152.280000  711.080000    (713.134134)
{% endhighlight %}

As you can see, Zopfli in ~150 times slower, than Zlib. Also as you can see execution time grows, if we increase number of iterations for compression.

But what about files size? This is result:

{% highlight bash %}
vagrant 11578722 Oct 29 18:52 1.jpg
vagrant  9807633 Oct 29 18:05 1.jpg.gz
vagrant  9747611 Oct 29 18:07 1_5.jpg.zfl
vagrant  9733181 Oct 29 18:19 1_50.jpg.zfl
{% endhighlight %}

As we can see, Zlib reduced file size for 15.29%. Zopfli with 5 iterations reduced file size for 15.814% and with 5 iterations reduced file size for 15.939%. Difference is not too big. So, why you even will consider to use Zopfli?

# Use cases

Zopfli is not good for real-time compression, as it can do Zlib. What is why it is not good idea to activate it for Nginx (as I wrote at begin of the article).

Zopfli can be very useful for systems, which prepare compressed files for distribution (static HTML pages, JS/CSS/etc files) by HTTP protocol. For example, jQuery CDN for distribution of a jQuery library can use gigabytes of network traffic (I don't know real numbers). Zopfli can save huge amount of a network traffic and increase speed of distribution of content, because even 1% is really huge number in this case.

# Summary

Zopfli is a zlib (gzip, deflate) compatible compressor, that can better compress your files (3.7-8.3%). However, you should pay for this very slow compression time (the decompression is done in the browser at the same speed).

*That’s all folks!* Thank you for reading till the end.