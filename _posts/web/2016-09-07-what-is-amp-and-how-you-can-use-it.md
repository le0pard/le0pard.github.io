---
layout: post
title: What is Accelerated Mobile Pages (AMP) and how you can use it
date: 2016-09-07 00:00:00
categories:
- web
tags:
- web
- performance
published: false
---
Hello my dear friends. Today we will talk about [Accelerated Mobile Pages (AMP)](https://www.ampproject.org/) and how it can help to you speedup your website.

# What is Accelerated Mobile Pages (AMP)?

Speed of loading your web page is really matters today. Many studies have shown that page load has a direct impact on sales. For instance, [every 100ms delay costs 1% of sales for Amazon store](http://www.gduchamp.com/media/StanfordDataMining.2006-11-28.pdf). This is especially important on mobile phones and tablets. [Facebook's Instant Articles](https://instantarticles.fb.com/) and [Apple News](https://www.apple.com/news/) are answering these issues in their own way. Fortunately, the [Accelerated Mobile Pages (AMP)](https://www.ampproject.org/) Project, while promoted by Google, is an open-source project and you should give it a try. AMP in action consists of three different parts:

 * **AMP HTML** is HTML with some restrictions for reliable performance and some extensions for building rich content beyond basic HTML;
 * The **AMP JS** library ensures the fast rendering of AMP HTML pages;
 * The **Google AMP Cache** can be used to serve cached AMP HTML pages;

### AMP HTML

AMP HTML is basically HTML extended with custom AMP properties. Though most tags in an AMP HTML page are regular HTML tags, some HTML tags are replaced with AMP-specific tags. These custom elements, called AMP HTML components, make common patterns easy to implement in a performant way. For example, the amp-img tag provides full srcset support even in browsers that don’t support it yet. Learn how to create your first AMP HTML page.

### AMP JS

The AMP JS library implements all of AMP's best performance practices, manages resource loading and gives you the custom tags mentioned above, all to ensure a fast rendering of your page. Among the biggest optimizations is the fact that it makes everything that comes from external resources asynchronous, so nothing in the page can block anything from rendering. Other performance techniques include the sandboxing of all iframes, the pre-calculation of the layout of every element on page before resources are loaded and the disabling of slow CSS selectors.

### Google AMP Cache

The [Google AMP Cache](https://developers.google.com/amp/cache/) is a proxy-based content delivery network for delivering all valid AMP documents. It fetches AMP HTML pages, caches them, and improves page performance automatically. When using the Google AMP Cache, the document, all JS files and all images load from the same origin that is using HTTP 2.0 for maximum efficiency.

The cache also comes with a built-in validation system which confirms that the page is guaranteed to work, and that it doesn't depend on external resources. The validation system runs a series of assertions confirming the page's markup meets the AMP HTML specification. Another version of the validator comes bundled with every AMP page. This version can log validation errors directly to the browser’s console when the page is rendered, allowing you to see how complex changes in your code might impact performance and user experience.

# Anatomy of an AMP Page

Here is a minimalist AMP page:

{% highlight html %}
<!doctype html>
<html amp>
 <head>
   <meta charset="utf-8">
   <link rel="canonical" href="hello-world.html">
   <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">
   <style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style><noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
   <script async src="https://cdn.ampproject.org/v0.js"></script>
 </head>
 <body>Hello World!</body>
</html>
{% endhighlight %}

An AMP page is simply a regular HTML, page with a few extra rules and restrictions:

 * The top of the page must have the following:
 {% highlight html %}<html amp>{% endhighlight %}
 You can also use the:
 {% highlight html %}<html ⚡>{% endhighlight %}
 * Contain a `<link rel="canonical" href="$SOME_URL" />` tag inside their head that points to the regular HTML version of the AMP HTML document or to itself if no such HTML version exists;
 * Contain a `<meta name="viewport" content="width=device-width,minimum-scale=1">` tag inside their head tag. It's also recommended to include `initial-scale=1`;
 * You must inline all your CSS in your HEAD tag (no external stylesheets allowed) using a `<style amp-custom>` tag;
 * You must include the following code as the last items before your `</head><body>` tag:
 {% highlight html %}
<style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style><noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
<script async src="https://cdn.ampproject.org/v0.js"></script>{% endhighlight %}
 * You must remove any other javascript from your code (whether inline or external);
 * Image tags (`<img>`) must be replaced with amp-img tags (`<amp-img>`) and similarly with other media. This of course means that normal HTML readers can no longer parse or display the page contents without executing the AMP Javascript;
 * Other items (e.g. forms) must also be removed;
 * You must implement [Schema.org NewsArticle](http://schema.org/NewsArticle), [Schema.org Article](http://schema.org/Article) or [Schema.org BlogPosting](http://schema.org/BlogPosting) meta detail in your HEAD and also include an image of at least 696 pixels, if you want Google to use your AMP pages in the Top stories carousel;





# Summary

This article describes some techniques for speeding up the testing of your Ruby project at Travis-CI. Of course others techniques can be exist which I did not mention, but these ones helped to reduce the testing time of the projects in several times.

*That’s all folks!* Thank you for reading till the end.