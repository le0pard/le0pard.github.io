---
layout: post
title: What is Accelerated Mobile Pages (AMP) and how you can use it
date: 2016-09-08 00:00:00
categories:
- web
tags:
- web
- performance
---
Hello my dear friends. Today we will talk about [Accelerated Mobile Pages (AMP)](https://www.ampproject.org/) and how it can help to you speedup your website.

# What is Accelerated Mobile Pages (AMP)?

Speed of loading your web page is really matters today. Many studies have shown that page load has a direct impact on sales. For instance, [every 100ms delay costs 1% of sales for Amazon store](http://www.gduchamp.com/media/StanfordDataMining.2006-11-28.pdf). This is especially important on mobile phones and tablets. [Facebook's Instant Articles](https://instantarticles.fb.com/) and [Apple News](https://www.apple.com/news/) are answering these issues in their own way. Fortunately, the [Accelerated Mobile Pages (AMP)](https://www.ampproject.org/) Project, while promoted by Google, is an open-source project and you should give it a try. AMP in action consists of three different parts:

 * **AMP HTML** is HTML with some restrictions for reliable performance and some extensions for building rich content beyond basic HTML;
 * The **AMP JS** library ensures the fast rendering of AMP HTML pages;
 * The **Google AMP Cache** can be used to serve cached AMP HTML pages;

<amp-video width="360" height="720" autoplay loop
  src="https://www.google.com/images/google-blog-assets/amp-phone-10062015.mp4"
  poster="/assets/images/web/amp/placeholder.png">
 <div fallback>
   <p>Your browser doesn’t support HTML5 video</p>
 </div>
</amp-video>


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

Next, make sure that your AMP page is actually valid AMP, or it won't get discovered and distributed by third-party platforms like Google Search. To validate:

 * Open your page in your browser;
 * Add `#development=1` to the URL, for example, [http://leopard.in.ua/#development=1](http://leopard.in.ua/#development=1);
 * Open the Chrome DevTools console and check for validation errors;

# Migration leopard.in.ua to AMP

I decided to migrate this website to AMP. It is working on top of [Jekyll](https://jekyllrb.com/) and this is what I change inside it:

 * Added all needed html tags/attributes and removed all JS code from pages (except AMP scripts);
 * Change `<img>` tags to `<amp-img>` and provide width and height attributes for its;
 * Inline CSS code in `<style amp-custom>`. I used for this new feature of Jekyll, which allow compile scss/sass files on a fly:
 {% highlight html %}{% raw %}
{% capture include_to_scssify %}{% include sass/styles.scss %}{% endcapture %}
<style amp-custom>{{ include_to_scssify | scssify }}</style>
 {% endraw %}{% endhighlight %}
 but scss/sass files moved in `_includes` directory.

 * Back Google Analytic script by `amp-analytics` component. Example:
  {% highlight html %}{% raw %}
<amp-analytics type="googleanalytics" id="googleAnalytics">
 <script type="application/json">
 {
   "vars": {
     "account": "{{ site.analytics.google_tracking_id }}"
   },
   "triggers": {
     "trackPageview": {
       "on": "visible",
       "request": "pageview"
     }
   }
 }
 </script>
</amp-analytics>
  {% endraw %}{% endhighlight %}

 * Back social buttons by `amp-social-share` component. Example:
 {% highlight html %}{% raw %}
<amp-social-share
  type="twitter"
  width="40"
  height="30"></amp-social-share>
<amp-social-share
  type="facebook"
  width="40"
  height="30"
  data-param-app_id="{{ site.sharing.facebook_app_id }}"></amp-social-share>
<amp-social-share
  type="gplus"
  width="40"
  height="30"></amp-social-share>
<amp-social-share
  type="email"
  width="40"
  height="30"></amp-social-share>
 {% endraw %}{% endhighlight %}

 * Return [Disqus](https://disqus.com/) was little tricky, because AMP doesn't contain component for it. I found solution by using `amp-iframe` component on github:
 {% highlight html %}{% raw %}
<amp-iframe
   height="400"
   sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
   frameborder="0"
   src="https://tempest.services.disqus.com/engage-iframe/amp/?forum={{ site.comments.disqus_short_name }}&amp;disqus_url={{ page.url | prepend: site.baseurl | prepend: site.url }}"
>
  <div placeholder class="disqus-placeholder__wrap">
    <div class="disqus-placeholder">
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1024" height="1024" viewBox="0 0 1024 1024" class="disqus-placeholder__svg"><path d="M524.456259,1012.5 C404.195712,1012.5 294.23718,968.012444 209.221899,894.419296 L0,923.35537 L80.8289496,721.399852 C52.6676835,658.493741 36.8688345,588.659481 36.8688345,515 C36.8688345,240.254704 255.169612,17.5 524.456259,17.5 C793.721065,17.5 1012,240.254704 1012,515 C1012,789.796889 793.728345,1012.5 524.456259,1012.5 L524.456259,1012.5 Z M790.685065,520.577519 L790.685065,519.191889 C790.685065,375.631815 690.679079,273.264741 518.245928,273.264741 L332.008806,273.264741 L332.008806,770.764741 L515.48659,770.764741 C689.259367,770.772111 790.685065,664.130222 790.685065,520.577519 L790.685065,520.577519 L790.685065,520.577519 Z M520.29905,648.534519 L465.825784,648.534519 L465.825784,395.531815 L520.29905,395.531815 C600.305295,395.531815 653.409813,441.707185 653.409813,521.344037 L653.409813,522.729667 C653.409813,603.037222 600.305295,648.534519 520.29905,648.534519 L520.29905,648.534519 Z"></path></svg>
      LOADING DISCUSSION
    </div>
  </div>
</amp-iframe>
 {% endraw %}{% endhighlight %}

# Results

After all this changes need to check results. Page without AMP:

<a href="http://sql-joins.leopard.in.ua/"><amp-img src="/assets/images/web/amp/without_amp.png" alt="without_amp" title="without_amp" width="981" height="629" layout="responsive" class="aligncenter size-full wp-image-1950" /></a>

With AMP:

<a href="http://sql-joins.leopard.in.ua/"><amp-img src="/assets/images/web/amp/with_amp.png" alt="with_amp" title="with_amp" width="962" height="568" layout="responsive" class="aligncenter size-full wp-image-1950" /></a>

The results are impressive, even for a simple site like this without much bloat. The Start Render time drops from 2.091 seconds to under a 0.793 seconds and the overall load plummets (from 493kb to 231kb) as does the number of resources loaded (31 versus 11). Very nice!

# Summary

This article describes what is AMP and how it can help to build web pages for static content that render fast. This technology can be used for news web portals, blogs and similar websites, where static content is a major resource for customers. You can look, who [already support AMP](https://www.ampproject.org/who/) (this resource too). I do not cover fully all usage of AMP, aspecially Google AMP Cache, which also can add additional speed for AMP pages, but in this case better create separate AMP pages and provide link to them with AMP Cache by `<link rel="amphtml" href="https://cdn.ampproject.org/c/s/YOUR_AMP_PAGE">` tag inside non-AMP page.

*That’s all folks!* Thank you for reading till the end.