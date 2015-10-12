---
layout: post
title: Improving security of your web applications with the Content Security Policy
date: 2015-10-13 00:00:00
categories:
- security
tags:
- security
- content security policy
---

<style>
  .describe-table {
    font-size: 0.9rem;
    border: 1px solid #CCC;
    width: 100%;
  }
  .describe-table td, .describe-table th {
    border: 1px solid #CCC;
    padding: 10px;
  }
</style>

Hello my dear friends.

Today we will talk about Content Security Policy and how it can help your to improve security of your web applications.

# What is Content Security Policy?

[Content Security Policy (CSP)](https://en.wikipedia.org/wiki/Content_Security_Policy) is an added layer of security that helps to detect and mitigate certain types of attacks, including [Cross Site Scripting (XSS)](https://en.wikipedia.org/wiki/Cross-site_scripting) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware.

# Usage example

In many cases many web applications do not need CSP, if they do not store and show some HTML/CSS data that user inputs. But in case when your web application should show some custom user content (html pages with css, some files, etc), you need to have good filter engine, which will remove any inline JavaScript code (`<script>` tags, `onclick` from `<a>` links, etc). For example, if you build web mail client, you cann't remove all HTML from email tags, because email will be broken and customer will not be happy to read broken email. So you need to prevent JavaScript inline code injection by this HTML email for hackers with any posibility.

# How to use it

Instead of blindly trust to everything that a server delivers, CSP defines the `Content-Security-Policy` HTTP header that allows you to create a whitelist of sources of trusted content, and instructs the browser to execute or render only resources from those sources. Even if an attacker can find a hole through which to inject script, the script won't match the whitelist, and therefore won't be executed.

For example, if we trust `cdn.example.com` to deliver valid code, and we trust ourselves to do the same, let's define a policy that only allows script to execute when it comes from one of those two sources:

{% highlight bash %}
Content-Security-Policy: script-src 'self' cdn.example.com
{% endhighlight %}


This head can contain such directives:

<table class="describe-table">
  <tr>
    <th style="width: 180px">Directive</th>
    <th style="width: 200px">Example Value</th>
    <th>Description</th>
  </tr>
  <tr>
    <td style="text-align: center">default-src</td>
    <td style="text-align: center">'self' cdn.example.com</td>
    <td>The "default-src" is the default policy for loading content such as JavaScript, Images, CSS, Font's, AJAX requests, Frames, HTML5 Media. See the <b>Source List</b> for possible values</td>
  </tr>
  <tr>
    <td style="text-align: center">script-src</td>
    <td style="text-align: center">'self' js.example.com</td>
    <td>Defines valid sources of JavaScript</td>
  </tr>
  <tr>
    <td style="text-align: center">style-src</td>
    <td style="text-align: center">'self' css.example.com</td>
    <td>Defines valid sources of stylesheets</td>
  </tr>
  <tr>
    <td style="text-align: center">img-src</td>
    <td style="text-align: center">'self' img.example.com</td>
    <td>Defines valid sources of images</td>
  </tr>
  <tr>
    <td style="text-align: center">connect-src</td>
    <td style="text-align: center">'self'</td>
    <td>Applies to XMLHttpRequest (AJAX), WebSocket or EventSource. If it is not allowed, the browser emulates a 400 HTTP status code</td>
  </tr>
  <tr>
    <td style="text-align: center">font-src</td>
    <td style="text-align: center">font.example.com</td>
    <td>Defines valid sources of fonts</td>
  </tr>
  <tr>
    <td style="text-align: center">object-src</td>
    <td style="text-align: center">'self'</td>
    <td>Defines valid sources of fonts</td>
  </tr>
  <tr>
    <td style="text-align: center">font-src</td>
    <td style="text-align: center">font.example.com</td>
    <td>Defines valid sources of plugins, eg &lt;object&gt;, &lt;embed&gt; or &lt;applet&gt;</td>
  </tr>
  <tr>
    <td style="text-align: center">media-src</td>
    <td style="text-align: center">media.example.com</td>
    <td>Defines valid sources of audio and video, eg HTML5 &lt;audio&gt;, &lt;video&gt; elements</td>
  </tr>
  <tr>
    <td style="text-align: center">child-src (old version frame-src)</td>
    <td style="text-align: center">'self'</td>
    <td>Defines valid sources for loading frames</td>
  </tr>
  <tr>
    <td style="text-align: center">sandbox</td>
    <td style="text-align: center">allow-forms allow-scripts</td>
    <td>Enables a sandbox for the requested resource similar to the iframe sandbox attribute. The sandbox applies a same origin policy, prevents popups, plugins and script execution is blocked. You can keep the sandbox value empty to keep all restrictions in place, or add values: allow-forms allow-same-origin allow-scripts, and allow-top-navigation</td>
  </tr>
  <tr>
    <td style="text-align: center">report-uri</td>
    <td style="text-align: center">/report</td>
    <td>Instructs the browser to POST a reports of policy failures to this URI. You can also append "-Report-Only" to the HTTP header name to instruct the browser to only send reports (does not block anything)</td>
  </tr>
</table>



## Source List

All of the directives that end with "-src" support similar values known as a source list. Multiple source list values can be space seperated with the exception of "*" and "none" which should be the only value.

<table class="describe-table">
  <tr>
    <th style="width: 180px">Source Value</th>
    <th style="width: 200px">Example</th>
    <th>Description</th>
  </tr>
  <tr>
    <td style="text-align: center">*</td>
    <td style="text-align: center">img-src *</td>
    <td>Wildcard, allows anything</td>
  </tr>
  <tr>
    <td style="text-align: center">'none'</td>
    <td style="text-align: center">object-src 'none'</td>
    <td>Prevents loading resources from any source</td>
  </tr>
  <tr>
    <td style="text-align: center">'self'</td>
    <td style="text-align: center">script-src 'self'</td>
    <td>Allows loading resources from the same origin (same scheme, host and port)</td>
  </tr>
  <tr>
    <td style="text-align: center">data:</td>
    <td style="text-align: center">img-src 'self' data:</td>
    <td>Allows loading resources via the data scheme (eg Base64 encoded images)</td>
  </tr>
  <tr>
    <td style="text-align: center">domain.example.com</td>
    <td style="text-align: center">img-src img.example.com</td>
    <td>Allows loading resources via the data scheme (eg Base64 encoded images)</td>
  </tr>
  <tr>
    <td style="text-align: center">*.example.com</td>
    <td style="text-align: center">img-src *.example.com</td>
    <td>Allows loading resources from the any subdomain under example.com</td>
  </tr>
  <tr>
    <td style="text-align: center">https:</td>
    <td style="text-align: center">img-src https:</td>
    <td>Allows loading resources only over HTTPS on any domain</td>
  </tr>
  <tr>
    <td style="text-align: center">'unsafe-inline'</td>
    <td style="text-align: center">script-src 'unsafe-inline'</td>
    <td>Allows use of inline source elements such as style attribute, onclick, or script tag bodies (depends on the context of the source it is applied to)</td>
  </tr>
  <tr>
    <td style="text-align: center">'unsafe-eval'</td>
    <td style="text-align: center">script-src 'unsafe-eval'</td>
    <td>Allows unsafe dynamic code evaluation such as JavaScript eval()</td>
  </tr>
</table>


# Usage example

As you can see we can combine all this values for "Content Security Policy" header and create most flexible rule for our app. Let's create a little example. I am using Rails app with [global gem](https://github.com/railsware/global) to make it work with "Content Security Policy". First I create global yml file with configuration (`config/global/content_security_policy.yml`):

{% highlight yaml %}
default:
  enabled: false
  default_src: "*"
  script_src: "'self' localhost:3000 localhost:9292"
  object_src: "'self'"
  style_src: "'self' 'unsafe-inline' 'unsafe-eval'"
  img_src: "* data:"
  media_src: "'none'"
  child_src: "'self'"
  font_src: "'self' data:"
  connect_src: "'self' ws://localhost:9292"

development:
  enabled: true
{% endhighlight %}

And user `default_headers` inside rails app (`config/application.rb`):

{% highlight ruby %}
require File.expand_path('../boot', __FILE__)

require 'rails/all'

require File.expand_path('../../lib/loaderio_redis_config', __FILE__)

Bundler.require(:default, Rails.env)

# global initialize
Global.configure do |config|
  config.environment = Rails.env.to_s
  config.config_directory = File.expand_path('../global', __FILE__)
  config.namespace = "Global"
end

module YourCoolApp
  class Application < Rails::Application
    secure_headers = {
      'X-Frame-Options' => 'SAMEORIGIN',
      'X-XSS-Protection' => '1; mode=block',
      'X-Content-Type-Options' => 'nosniff'
    }

    if Global.content_security_policy.enabled?
      secure_headers.merge!(
        'Content-Security-Policy' => "default-src #{Global.content_security_policy.default_src}; script-src #{Global.content_security_policy.script_src}; object-src #{Global.content_security_policy.object_src}; style-src #{Global.content_security_policy.style_src}; img-src #{Global.content_security_policy.img_src}; media-src #{Global.content_security_policy.media_src}; child-src #{Global.content_security_policy.child_src}; frame-src #{Global.content_security_policy.child_src}; font-src #{Global.content_security_policy.font_src}; connect-src #{Global.content_security_policy.connect_src}"
      )
    end

    config.action_dispatch.default_headers = secure_headers

    ...
{% endhighlight %}

After restarting of the Rails app you should see "Content Security Policy" header in any HTTP response from your app. If someone will try to inject JS code in your app (`onclick` in link), it will get such JS error:

<a href="/assets/images/security/csp/csp1.png"><img src="/assets/images/security/csp/csp1.png" alt="CSP error" title="CSP error" width="800" class="aligncenter size-full" /></a>


# Subresource Integrity

Many sites uses a content delivery network (CDN) to serve static assets such as JavaScript, CSS, and images to our users. The CDN makes web browsing faster by delivering assets from data centers that are geographically close to the end user and by using hardware and software that is optimized for quickly serving static assets. The compromise of a major CDN could be devastating to the security of the hundreds of thousands of sites that depends on it. If our CDN were to be compromised, it could be used to serve malicious JavaScript to all our users, rendering our many XSS mitigations and transport security useless. Content Security Policy is invaluable for protecting against traditional XSS attacks, but it provides no defense against an attacker who can control assets served from whitelisted sources.

To prevent this type of attack, you can use [Subresource Integrity](http://www.w3.org/TR/SRI/) browser technology. The website author includes an `integrity` attribute on JavaScript and CSS tags, specifying the cryptographic digest of the resource being loaded from the third party. When the browser fetches the resource, it computes the file's digest and compares it with the value from the `integrity` attribute. If the values match, the resource is loaded. Otherwise, the browser refuses to load the resource. Example:

{% highlight html %}
<script src="/assets/application-asdhhwheruhsjkadlslkdl.js" integrity="sha256-TvVUHzSfftWg1rcfL6TIJ0XKEGrgLyEq6lsd29qs="></script>
{% endhighlight %}

If you are using Rails with sprockets-rails gem (version >= 3), you can add `integrity` key to your `javascript_include_tag` helper to activate this feature:

{% highlight ruby %}
javascript_include_tag :application, integrity: true
# => "<script src="/assets/application.js" integrity="sha-256-TvVUHzSfftWg1rcfL6TIJ0XKEGrgLyEq6lEpcmrG9qs="></script>"
{% endhighlight %}

More info about Subresource Integrity you can read in [this article](http://githubengineering.com/subresource-integrity/).

# Browser Support

CSP is designed to be fully backward compatible; browsers that don't support it still work with servers that implement it, and vice-versa. Browsers that don't support CSP simply ignore it, functioning as usual, defaulting to the standard same-origin policy for web content. If the site doesn't offer the CSP header, browsers likewise use the standard same-origin policy.

<table class="describe-table">
  <tr>
    <th>Header</th>
    <th>Chrome</th>
    <th>FireFox</th>
    <th>Safari</th>
    <th>Internet Explorer/Edge</th>
  </tr>
  <tr>
    <td style="font-weight: bold">Content-Security-Policy (1.0)</td>
    <td>25+</td>
    <td>23+</td>
    <td>7+</td>
    <td>-</td>
  </tr>
  <tr>
    <td>X-Content-Security-Policy</td>
    <td>-</td>
    <td>4.0+</td>
    <td>-</td>
    <td>10+ (limited)</td>
  </tr>
  <tr>
    <td>X-Webkit-CSP</td>
    <td>14+</td>
    <td>-</td>
    <td>6+</td>
    <td>-</td>
  </tr>
</table>

As you can see in this table, CSP have good support for major browsers. Internet Explorer 10-11 and Edge have partial support for CSP via the `X-Content-Security-Policy` header, but even then they only appear to support the optional "sandbox" directive. More info on [caniuse](http://caniuse.com/#feat=contentsecuritypolicy).

# Summary

Content Security Policy can provide the additional security layer for your apps against XSS and data injection attacks (XSS is in third place in the ranking of the key risks of Web-based applications under the 2013 OWASP).

*That’s all folks!* Thank you for reading till the end.