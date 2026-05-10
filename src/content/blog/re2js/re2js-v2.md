---
title: "Re2js v2.2.0: linear-time lookbehinds, RE2Set, and a pure JS architecture"
description: "Re2js v2.2.0: linear-time lookbehinds, RE2Set, and a pure JS architecture"
pubDate: 2026-04-14
tags:
- regex
- re2js
- redos
- re2
---

Hello my dear friends. Today I will talk about regular expressions and usage of the new re2js 2.2.0 release in your JavaScript applications. What is re2js?

If you've spent enough time working with Node.js or browser performance, you've likely run into the headache of Catastrophic Backtracking (ReDoS). JavaScript's native `RegExp` engine uses a backtracking algorithm, which is highly expressive but can degrade to `O(2^N)` exponential time when fed complex patterns or malicious input.

To solve this, developers usually turn to Google's RE2 engine, often via native C++ bindings or WebAssembly. But native bindings don't run in the browser or on Edge workers, and WASM bundles can be heavy. Furthermore, the official C++ RE2 engine intentionally omits support for lookarounds (like lookbehinds).

Today, I am releasing **re2js 2.2.0**. It is a 100% pure JavaScript regex engine that guarantees `O(n)` linear-time execution, is completely immune to ReDoS, and runs anywhere JS does.

I've made some major architectural changes in this release to push JS performance to its limits, including adding linear-time lookbehinds and a highly optimized multi-pattern matching API. Here is a look under the hood at what's new.

## A Pure JS Execution Architecture

Instead of wrapping native binaries, re2js is a complete JavaScript port of the C++ RE2 and Go regexp engines. It implements Pike's Virtual Machine with a multi-tiered execution architecture:

* **Lazy DFA (Deterministic Finite Automaton):** A high-speed, state-fusing engine used for boolean testing (like `.test()`).
* **Pike VM NFA (Nondeterministic Finite Automaton):** A fallback engine that safely tracks parallel execution threads to guarantee `O(n)` time, safely handling traps like `(a+)+b`.
* **OnePass:** A fast-path engine specifically for strictly anchored, 1-unambiguous regexes.

To get C++-like memory efficiency in V8, I heavily rely on flat Int32Array structures and strict object-pooling. This bypasses the V8 garbage collector and JS Call Stack limits entirely, allowing re2js to parse massive multi-megabyte strings without throwing `Maximum call stack size exceeded` errors.

## Multi-Pattern Matching (RE2Set)

If you're building an HTTP router, a log parser, or a profanity filter, you often need to check a single string against hundreds of regular expressions. Running a `for` loop over 100 native regexes takes `O(100N)` time.

To solve this, 2.2.0 introduces the RE2Set API. Instead of running numerous regular expressions in a loop, RE2Set compiles them into a single state machine and finds all matches in a single pass, ensuring `O(n)` linear time execution.

Here is a basic example of evaluating multiple expressions at once:

```js
import { RE2Set } from 're2js';

const set = new RE2Set();
set.add('error');
set.add('warning');
set.add('critical');

// The set must be compiled before use
set.compile();

// Finds all matches simultaneously in a single linear pass
console.log(set.match('The system encountered a critical error.'));
// Outputs: [0, 2]
```

### Example: Fast JS Routing with RE2Set

This feature is incredibly powerful for applications like routing engines. Below is an example demonstrating how to build a blazingly fast JavaScript HTTP router using RE2Set to find matched routes in `O(n)` time and extract groups only for the winning routes:

```js
import { RE2Set, RE2JS } from 're2js'

class Router {
  constructor() {
    this.set = new RE2Set()
    this.routes = []
  }

  addRoute(pattern, handler) {
    // compile the individual regex (for extracting groups later)
    const re = RE2JS.compile(pattern)

    // add the raw string to the blazing-fast Set
    const id = this.set.add(pattern)

    // store them together
    this.routes[id] = { re, handler }
  }

  compile() {
    this.set.compile()
  }

  execute(path) {
    // find WHICH routes matched in O(N) time
    const matchedIDs = this.set.match(path)

    if (matchedIDs.length === 0) {
      return '404 Not Found'
    }

    // extract groups ONLY for the routes that won
    for (const id of matchedIDs) {
      const route = this.routes[id]
      const matcher = route.re.matcher(path)

      if (matcher.matches()) {
        const params = matcher.getNamedGroups()
        return route.handler(params)
      }
    }
  }
}

// --- Usage ---
const router = new Router()

router.addRoute('^/users/(?P<id>\\d+)$', (params) => `User ID: ${params.id}`)
router.addRoute('^/posts/(?P<slug>[a-z-]+)$', (params) => `Post: ${params.slug}`)

router.compile()

console.log(router.execute('/users/42')) // Outputs: "User ID: 42"
```

## Keeping Bundles Small: Base64 VLQ Delta Compression

To achieve full PCRE compliance, a regex engine needs to support Unicode property escapes (e.g., `\p{Greek}`). However, shipping the raw code-point lookup arrays for the entire Unicode specification usually results in megabytes of bundle bloat.

To fix this, I borrowed a trick from JavaScript Source Maps: **Base64 Variable-Length Quantity (VLQ) Delta Compression**.

Instead of shipping raw Uint32Arrays, re2js delta-encodes the Unicode range tables and compresses them into dense Base64 strings. At runtime, they are lazily decompressed. This allows me to provide full Unicode support while keeping the library footprint incredibly small—perfect for frontend applications and Cloudflare Workers.

## Linear-Time Lookbehinds

This is the feature I am most excited about.

Google's official C++ RE2 engine does not support lookbehinds.

However, re2js implements a newly developed **captureless linear-time lookbehind algorithm** [published by researchers at EPFL (École Polytechnique Fédérale de Lausanne)](https://arxiv.org/pdf/2311.17620).

By evaluating Lookbehinds (`(?<=...)` and `(?<!...)`) as parallel, reversed automata threads that execute simultaneously alongside the main string progression, re2js can resolve complex zero-width assertions without ever backtracking.

*(If you are interested in the computer science behind this, I highly recommend reading the EPFL article: [Regular Expressions with Lookarounds in Linear Time](https://systemf.epfl.ch/blog/re2-lookbehinds/)).*

```js
import { RE2JS } from 're2js';

// Native engines freeze infinitely on this ReDoS trap.
// Google C++ RE2 throws a syntax error because it lacks lookbehinds.
// re2js parses it safely in milliseconds.
const re = RE2JS.compile('(?<=(a+)+)b', RE2JS.LOOKBEHINDS);

console.log(re.test('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaab')); // true
```

## Conclusion

With the release of `re2js 2.2.0`, you no longer have to choose between execution safety and bundle size in your JavaScript applications. By bringing a pure JS execution architecture, linear-time lookbehinds, and the powerful RE2Set API, I believe this library provides a robust solution for environments where native bindings simply aren't an option.

If you want to dive deeper or start using it in your projects, you can find the source code and documentation on the [re2js GitHub repository](https://github.com/le0pard/re2js) or test your patterns safely in the [RE2JS Playground](https://re2js.leopard.in.ua/).

Thank you for reading, and happy coding!
