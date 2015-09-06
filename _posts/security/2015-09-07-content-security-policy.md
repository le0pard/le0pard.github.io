---
layout: post
title: Improving security of your web application with the Content Security Policy
date: 2015-09-07 00:00:00
categories:
- security
tags:
- security
- content security policy
published: false
---
Hello my dear friends.

Today we will lear about Content Security Policy and how it can help your to make your web application more secure.

# What is Content Security Policy?

Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware.

CSP is designed to be fully backward compatible; browsers that don't support it still work with servers that implement it, and vice-versa. Browsers that don't support CSP simply ignore it, functioning as usual, defaulting to the standard same-origin policy for web content. If the site doesn't offer the CSP header, browsers likewise use the standard same-origin policy.

# Example of usage

In most cases many web application no need CSP, if it does't store and show some HTML/CSS data from user input. But if your web application should show some custom user content (html pages with css, some files, etc), in this case you need have good filter engine, which will remove eny inline JavaScript code (`<script>` tags, `onclick` from `<a>` links, etc). For example, if you build you web mail client, you cannot remove all HTML tags from email, because it will be broken and customer will not be happy to read broken email. So you need to prevent any posibility for hackers to inject JavaScript inline code by this HTML email.

# How to use it

Enabling CSP is as easy as configuring your web server to return the `Content-Security-Policy` HTTP header. This head can contain such directives:

 * default-src
 * script-src
 * object-src
 * style-src
 * img-src
 * media-src
 * frame-src
 * font-src
 * connect-src
 * sandbox
 * report-uri


# Browser Support

<table style="width: 100%">
  <tr style="border: 1px solid #CCC">
    <th>Header</th>
    <th>Chrome</th>
    <th>FireFox</th>
    <th>Safari</th>
    <th>Internet Explorer/Edge</th>
  </tr>
  <tr style="border: 1px solid #CCC;">
    <td style="font-weight: bold">Content-Security-Policy (1.0)</td>
    <td>25+</td>
    <td>23+</td>
    <td>7+</td>
    <td>-</td>
  </tr>
  <tr style="border: 1px solid #CCC">
    <td>X-Content-Security-Policy</td>
    <td>-</td>
    <td>4.0+</td>
    <td>-</td>
    <td>10+ (limited)</td>
  </tr>
  <tr style="border: 1px solid #CCC">
    <td>X-Webkit-CSP</td>
    <td>14+</td>
    <td>-</td>
    <td>6+</td>
    <td>-</td>
  </tr>
</table>

As you can see in this table, CSP have good support for major browsers. Internet Explorer 10-11 and Edge have partial support for CSP via the `X-Content-Security-Policy` header, but even then they only appear to support the optional sandbox directive. More info you can see on [caniuse](http://caniuse.com/#feat=contentsecuritypolicy).

# Summary



*That’s all folks!* Thank you for reading till the end.