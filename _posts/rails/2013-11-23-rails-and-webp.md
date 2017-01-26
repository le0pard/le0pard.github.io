---
layout: post
title: Speed up your Ruby on Rails application using WebP images
date: 2013-11-23 00:00:00
categories:
- rails
tags:
- rails
- webp
---
Hello my dear friends.

Today we will speed up our rails application using webp images.

# What is WebP?

[WebP](https://developers.google.com/speed/webp/) is an image format that employs both lossy and lossless compression. It was developed by Google. As we can see [on this page](http://caniuse.com/webp), today only Google Chrome (+ Android) and Opera support this type of images. But it is not a problem. We can show webp images in these browsers, but in another browsers we will show a png, jpg or gif images.

# WebP and Ruby on Rails

After the release of webp library I wrote webp gem - [webp-ffi](http://leopard.in.ua/webp-ffi/). You can use this gem to work with webp images in Ruby. Two good Ruby gems were released later  - [sprockets-webp](https://github.com/kavu/sprockets-webp) and [carrierwave-webp](https://github.com/kavu/carrierwave-webp). Sprockets-webp provides a Rails Asset Pipeline hook for converting PNG and JPEG assets to the WebP format. At first, just add this gem in the Gemfile:

{% highlight ruby %}
gem 'sprockets-webp'
{% endhighlight %}

And run:

{% highlight bash %}
$ bundle
{% endhighlight %}

Put some PNGs and JPGs into "app/assets/images" and you can test converter locally with the Rake task:

{% highlight bash %}
$ bundle exec rake assets:precompile RAILS_ENV=production
{% endhighlight %}

Now for each image webp will be created:

{% highlight bash %}
$ ls public/assets | grep webp
app_view-c1c11c4587eb1e6583df7825b76354eb.png.webp
bg-51830e3641c265cb246d752c57df3c20.jpg.webp
favicon-c594206ef399e642bd7024986158976c.png.webp
feature01-62e93a154b58089fe25e63a4e5087cf2.png.webp
feature02-24ee54e80423624080977fc17828bf23.png.webp
feature03-67de13538e75226fcdb1e4dd15d258bb.png.webp
feature04-28c1d1d55b982341f371ef519df06d36.png.webp
feature05-54a3ca87cd4ea2b4d8c6476181940b95.png.webp
feature06-7a7881a2640f8b879ec4defeb07e7d9b.png.webp
feature07-4b206a44dbf7181a1f653b157b8183de.png.webp
feature08-800ee165d1e6e854f55d92282a2df09d.png.webp
icon01-93581fe0eeaab8d135282a15f5ef8e3f.png.webp
icon02-e8efdd17d3f1f5d13f1d878240d55970.png.webp
icon03-1f3e94e02160b9fbeb2036490973150d.png.webp
logo-e424b8ca2552edb04331faf0da7f213c.png.webp
signin_block-3af7fa120ca9a6ea11d7bf63c1ec062b.png.webp
toggle-ae225a8eda983bb3344c2f496749cb3e.png.webp
{% endhighlight %}

If you want to convert images upload by users in your application, you can use carrierwave-webp (of course, if you use for this purpose [carrierwave](https://github.com/carrierwaveuploader/carrierwave) gem).

# Nginx with WebP

We have to show webp images only in browsers, which support this format. For this purpose we will use [Ngnix](http://nginx.org/) web server. Chrome and Opera advertise image/webp on its Accept header for all image requests. Now, we have to configure our Nginx server for automatically choosing the right file.

{% highlight bash %}
location ~ ^/(assets)/  {
   # check Accept header for webp, check if .webp is on disk
   if ($http_accept ~* "webp") { set $webp "true"; }
   if (-f $request_filename.webp) { set $webp "${webp}-local"; }
   if ($webp = "true-local") {
    add_header Vary Accept;
    access_log   off;
    expires      30d;
    rewrite (.*) $1.webp break;
   }

   root /some/folder/current/public;
   expires max;
   add_header  Cache-Control public;
   access_log  off;
   gzip_static  on;
   gzip_proxied any;
   break;
}
{% endhighlight %}

Then, we check if the Accept header is an advertising WebP. Then we check if there is a corresponding file with a .webp extension on disk. If both conditions match, we serve the WebP asset and add "Vary: Accept" header.

# Results

Now we can see results of our work. First we check the speed of loading of our assets in Firefox ([full image](/assets/images/rails/webp1.png)):

<a href="/assets/images/rails/webp2.png"><img src="/assets/images/rails/webp2.png" alt="Firefox Webp" title="Firefox Webp" class="aligncenter" /></a>

As we can see, many big image have size 145.07 Kb. Now let's check the result in Chrome ([full image](/assets/images/rails/webp3.png)):

<a href="/assets/images/rails/webp4.png"><img src="/assets/images/rails/webp4.png" alt="Chrome Webp" title="Chrome Webp" class="aligncenter" /></a>

As we can see, image with size 145.07 Kb was converted in webp image with size 17.2 Kb. Another images also have smaller size, than png or jpeg images. By the way, the visual quality of images has not become worse.

<a href="/assets/images/rails/webp5.png"><img src="/assets/images/rails/webp5.png" alt="Webp" title="Webp" class="aligncenter" /></a>

As the result we reduced load time of rails application almoust in 2 times: before we have in average time 800ms, now an average response time of the page is 500ms.

# Summary

As we can see using webp images, we have accelerated load speed of our application in Chrome and Opera browsers. Hopefully support of this image format will come into sight in Firefox (and maybe in IE).

*That’s all folks!* Thank you for reading till the end.