---
layout: post
title: Using CORS with Rails
description: ""
categories: 
- rails
tags: 
- rails
- html5
draft: true
---
Hello my dear friends. Today we will talk about CORS and usage it in Rails application. What is CORS?

**Cross-origin resource sharing (CORS)** is a web browser technology specification which defines ways for a web server to allow its resources to be accessed by a web page from a different domain. Such access would otherwise be forbidden by the same origin policy. CORS defines a way in which the browser and the server can interact to determine whether or not to allow the cross-origin request. It is a compromise that allows greater flexibility, but is more secure than simply allowing all such requests. CORS is supported in the following browsers:

 * Chrome 3+
 * Firefox 3.5+
 * Safari 4+
 * Internet Explorer 8+
 * Opera 12+
 
Here is example with using JQuery to send CORS request:

    $.ajax({
      url: "http://some.another.domain/test",
      crossDomain: true,
      xhrFields: {
        withCredentials: true
      }
    })
  
The main parameters:

  * *crossDomain* - should be set to true, if we want to use cross domain request
  * *xhrFields* - a map of fieldName-fieldValue pairs to set on the native XHR object. In this case I set "withCredentials: true". What does do this parameter?
  
## withCredentials

Standard CORS requests do not send or set any cookies by default. In order to include cookies as part of the request, you need to set the XmlHttpRequest’s .withCredentials property to true:

    xhr.withCredentials = true;
    
The .withCredentials property will include any cookies from the remote domain in the request, and it will also set any cookies from the remote domain. Note that these cookies still honor same-origin policies, so your JavaScript code can’t access the cookies from document.cookie or the response headers. They can only be controlled by the remote domain.

## Handling a simple requests

Here’s an example of a simple request:

JavaScript:

    $.ajax({
      url: "http://some.another.domain/test",
      type: "GET",
      crossDomain: true,
      xhrFields: {
        withCredentials: true
      }
    })
    
HTTP Request:

    GET /test HTTP/1.1
    Origin: http://some.another.domain
    Host: some.another.domain
    Accept-Language: en-US
    Connection: keep-alive
    User-Agent: Mozilla/5.0...
    
The first thing to note is that a valid CORS request *always* contains an Origin header. This Origin header is added by the browser, and can not be controlled by the user. The value of this header is the scheme (e.g. http), domain (e.g. bob.com) and port (included only if it is not a default port, e.g. 81) from which the request originates; for example: http://some.another.domain.

Here’s a valid server response:

    Access-Control-Allow-Origin: http://some.another.domain
    Access-Control-Allow-Credentials: true
    Access-Control-Expose-Headers: FooBar
    Content-Type: text/html; charset=utf-8
    
All CORS related headers are prefixed with "Access-Control-". Here’s some more details about each header.

**Access-Control-Allow-Origin (required)** - This header must be included in all valid CORS responses; omitting the header will cause the CORS request to fail. The value of the header can either echo the Origin request header (as in the example above), or be a '\*' to allow requests from any origin. If you’d like any site to be able to access your data, using '\*' is fine. But if you’d like finer control over who can access your data, use an actual value in the header.

**Access-Control-Allow-Credentials (optional)** - By default, cookies are not included in CORS requests. Use this header to indicate that cookies should be included in CORS requests. The only valid value for this header is true (all lowercase). If you don't need cookies, don't include this header (rather than setting its value to false).

The Access-Control-Allow-Credentials header works in conjunction with the withCredentials property on the XmlHttpRequest2 object. Both these properties must be set to true in order for the CORS request to succeed. If .withCredentials is true, but there is no Access-Control-Allow-Credentials header, the request will fail (and vice versa).

Its recommended that you don’t set this header unless you are sure you want cookies to be included in CORS requests.

**Access-Control-Expose-Headers (optional)** - The XmlHttpRequest2 object has a getResponseHeader() method that returns the value of a particular response header. During a CORS request, the getResponseHeader() method can only access simple response headers. Simple response headers are defined as follows:

 * Cache-Control
 * Content-Language
 * Content-Type
 * Expires
 * Last-Modified
 * Pragma

If you want clients to be able to access other headers, you have to use the Access-Control-Expose-Headers header. The value of this header is a comma-delimited list of response headers you want to expose to the client.

## Handling a not-so-simple request

So that takes care of a simple GET request, but what if you want to do something more? Maybe you want to support other HTTP verbs like PUT or DELETE, or you want to support JSON using Content-Type: application/json. Then you need to handle what we’re calling a not-so-simple request.

A not-so-simple request looks like a single request to the client, but it actually consists of two requests under the hood. The browser first issues a preflight request, which is like asking the server for permission to make the actual request. Once permissions have been granted, the browser makes the actual request. The browser handles the details of these two requests transparently. The preflight response can also be cached so that it is not issued on every request.

Here’s an example of a  not-so-simple request:

JavaScript:

    $.ajax({
      url: "http://some.another.domain/test",
      type: "POST",
      crossDomain: true,
      xhrFields: {
        withCredentials: true
      }
    })

Request:

    OPTIONS /test HTTP/1.1
    Origin: http://some.another.domain
    Access-Control-Request-Method: POST
    Host: some.another.domain
    Accept-Language: en-US
    Connection: keep-alive
    User-Agent: Mozilla/5.0...

Like the simple request, the browser adds the Origin header to every request, including the preflight. The preflight request is made as an HTTP OPTIONS request (so be sure your server is able to respond to this method). It also contains a few additional headers:

**Access-Control-Request-Method** - The HTTP method of the actual request. This request header is always included, even if the HTTP method is a simple HTTP method as defined earlier (GET, POST, HEAD).

**Access-Control-Request-Headers** - A comma-delimited list of non-simple headers that are included in the request.

The preflight request is a way of asking permissions for the actual request, before making the actual request. The server should inspect the two headers above to verify that both the HTTP method and the requested headers are valid and accepted.

If the HTTP method and headers are valid, the server should respond with the following:

    OPTIONS /test HTTP/1.1
    Origin: http://some.another.domain
    Access-Control-Request-Method: POST
    Host: some.another.domain
    Accept-Language: en-US
    Connection: keep-alive
    User-Agent: Mozilla/5.0...
    Preflight Response:

    Access-Control-Allow-Origin: http://some.another.domain
    Access-Control-Allow-Methods: GET, POST, PUT
    Access-Control-Allow-Headers: Content-Type
    Content-Type: text/html; charset=utf-8
    
**Access-Control-Allow-Origin (required)** - Like the simple response, the preflight response must include this header.

**Access-Control-Allow-Methods (required)** - Comma-delimited list of the supported HTTP methods. Note that although the preflight request only asks permisions for a single HTTP method, this reponse header can include the list of all supported HTTP methods. This is helpful because the preflight response may be cached, so a single preflight response can contain details about multiple request types.

**Access-Control-Allow-Headers (required if the request has an Access-Control-Request-Headers header)** - Comma-delimited list of the supported request headers. Like the Access-Control-Allow-Methods header above, this can list all the headers supported by the server (not only the headers requested in the preflight request).

**Access-Control-Allow-Credentials (optional)** - Same as simple request.

**Access-Control-Max-Age (optional)** - Making a preflight request on *every* request becomes expensive, since the browser is making two requests for every client request. The value of this header allows the preflight response to be cached for a specified number of seconds.

Once the preflight request gives permissions, the browser makes the actual request. The actual request looks like the simple request, and the response should be processed in the same way:

Request:

    POST /test HTTP/1.1
    Origin: http://some.another.domain
    Host: some.another.domain
    Accept-Language: en-US
    Connection: keep-alive
    User-Agent: Mozilla/5.0...

Actual Response:

    Access-Control-Allow-Origin: http://some.another.domain
    Content-Type: text/html; charset=utf-8

## CORS and Rails

First of all you need setup response headers in Rails application:

    class Api::BaseController < ApplicationController
      before_filter :set_headers
  
      private
  
      def set_headers
        headers['Access-Control-Allow-Origin'] = '*'
        headers['Access-Control-Expose-Headers'] = 'ETag'
        headers['Access-Control-Allow-Methods'] = 'GET, POST, PATCH, PUT, DELETE, OPTIONS, HEAD'
        headers['Access-Control-Allow-Headers'] = '*,x-requested-with,Content-Type,If-Modified-Since,If-None-Match'
        headers['Access-Control-Max-Age'] = '86400'
      end
    end
    
This settings allow requests from any origin (any site to be able to access your data). If you need cookies (Access-Control-Allow-Credentials), then you coudn't use "\*" in Access-Control-Allow-Origin and should set host. In Rails you can do this by setting ORIGIN headers from request to Access-Control-Allow-Origin header in response:

    class Api::BaseController < ApplicationController
      before_filter :set_headers

      private

      def set_headers
        if request.headers["HTTP_ORIGIN"]
        # better way check origin
        # if request.headers["HTTP_ORIGIN"] && /^https?:\/\/(.*)\.some\.site\.com$/i.match(request.headers["HTTP_ORIGIN"])
          headers['Access-Control-Allow-Origin'] = request.headers["HTTP_ORIGIN"]
          headers['Access-Control-Expose-Headers'] = 'ETag'
          headers['Access-Control-Allow-Methods'] = 'GET, POST, PATCH, PUT, DELETE, OPTIONS, HEAD'
          headers['Access-Control-Allow-Headers'] = '*,x-requested-with,Content-Type,If-Modified-Since,If-None-Match,Auth-User-Token'
          headers['Access-Control-Max-Age'] = '86400'
          headers['Access-Control-Allow-Credentials'] = 'true'
        end
      end
    end
    
## Access-Control-Expose-Headers problem

All browsers (except Google Chrome) have buggy getRequestHeader() implementations, so the headers may not be accessible to clients even after you set the Access-Control-Expose-Headers header. In my example, ETag header accessible only in Google Chrome browser. Safari return only simple response headers, while Firefox doesn't return ANY response headers. 

*That’s all folks!* Thank you for reading till the end.