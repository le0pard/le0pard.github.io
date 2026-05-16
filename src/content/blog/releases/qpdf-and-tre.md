---
title: "New open-source releases: QPDF WASM for client-side PDFs and TreRegex for fuzzy matching in Ruby and Node.js"
description: "New open-source releases: QPDF WASM for client-side PDFs and TreRegex for fuzzy matching in Ruby and Node.js"
pubDate: 2026-05-16
tags:
  - regex
  - tre
  - fuzzy regex
  - qpdf
  - pdf
---

Hello everyone. Today I want to share three new open-source projects I've recently released. While they solve completely different problems and are built for different ecosystems—one is a client-side WebAssembly application for PDF processing, and the other two bring high-performance fuzzy regular expressions to both Ruby and Node.js—they all aim to provide fast, secure, and robust solutions to common development challenges.

### QPDF WASM - PDF Optimizer & Compressor

Dealing with PDF files—whether it's optimizing them for web viewing, compressing them, or removing passwords—usually means relying on third-party online tools. The problem is that uploading sensitive documents to an external server is a huge privacy risk. On the other hand, using command-line tools locally isn't always convenient for everyday users.

To solve this, I built **[QPDF WASM](https://qpdf-wasm.leopard.in.ua/)** ([Source Code](https://github.com/le0pard/qpdf-wasm)).

It is a fast, secure, browser-based tool to optimize, compress, and decrypt PDF files. Powered by the excellent QPDF library compiled to **WebAssembly (WASM)**, this application processes all files locally on your device via Web Workers. Your sensitive documents never leave your computer.

#### Key Features

* **Privacy First (100% Local Processing):** Files are converted directly in your browser. No data is ever sent to or stored on an external server.
* **Web Optimize (Linearization):** Restructures PDF files to enable "Fast Web View," allowing browsers to instantly display the first page of a document without waiting for the entire file to download.
* **Maximum Compression:** Applies heavy suite compression algorithms (`--object-streams=generate`, `--compression-level=9`, etc.) to significantly reduce PDF file size for archiving or emailing.
* **Offline Capable:** Includes a Service Worker, allowing the app to function without an internet connection after the initial load.

The tool is built with SvelteKit, uses Web Workers integrated via Comlink to prevent UI freezing during heavy processing, and features split-view PDF embedding.

You can try the **[Live Demo](https://qpdf-wasm.leopard.in.ua/)** or check out the code on **[GitHub](https://github.com/le0pard/qpdf-wasm)**.

---

### TreRegex - Approximate (fuzzy) regular expression matching

In both the Ruby and JavaScript ecosystems, standard regular expressions are strictly exact. If you are searching text containing typos, OCR errors, or variations in spelling, standard `Regexp` will fail. While string distance metrics (like Levenshtein distance) exist, they usually require comparing whole strings against other whole strings.

To address this, I've released **TreRegex** for both Ruby and Node.js.

TreRegex provides high-performance interfaces to the TRE C library. It brings robust approximate (fuzzy) regular expression matching to your apps, allowing you to search for a pattern *within* a larger body of text while permitting a configurable number of errors (insertions, deletions, and substitutions).

#### Key Features Across Both Libraries
* **Approximate Matching:** Find matches even if the target string has missing, extra, or substituted characters.
* **Granular Control:** You can set strict limits on `max_errors` / `maxErrors`, or fine-tune by specific error types (`max_insertions`, `max_deletions`, `max_substitutions`).
* **Multi-byte Unicode Safety:** Under the hood, C strings are just byte arrays, which breaks indexing when multi-byte characters (like emojis 🍎) are involved. TreRegex transparently maps these underlying C byte-offsets back to native Ruby character indices or JavaScript UTF-16 code units, making it 100% safe.

#### 1. TreRegex for Ruby

The Ruby gem uses `FFI` to interface with the TRE C library.

**Installation:**
```ruby
gem 'tre_regex'

```

**Usage Example:**

```ruby
require 'tre_regex'

regex = TreRegex::Regex.new('apple')

# Allow up to 1 error (in this case, a deletion)
result = regex.exec('I ate an aple', max_errors: 1)
# => {
#      match: "aple",
#      submatches: [],
#      index: 9,
#      end_index: 13,
#      cost: 1,
#      errors: {insertions: 0, deletions: 1, substitutions: 0}
#    }

# Safe Unicode string slicing:
matched_string = 'I ate an aple'[result[:index]...result[:end_index]]
# => "aple"

```

Source Code: **[tre_regex on GitHub](https://github.com/le0pard/tre_regex)** | Rubygems: **[tre_regex](https://rubygems.org/gems/tre_regex)**

#### 2. TreRegex for Node.js (`@tre-regex/regex`)

The Node.js package uses `napi-rs` to securely and efficiently bridge the TRE C library via Rust. Pre-built binaries are provided for most major operating systems and architectures, making installation seamless.

**Installation:**

```bash
npm install @tre-regex/regex
# or
yarn add @tre-regex/regex

```

**Usage Example:**

```javascript
import { TreRegex } from '@tre-regex/regex'

const regex = new TreRegex('apple')

// Allow up to 1 error
const result = regex.exec('I ate an aple', { maxErrors: 1 })
/* => {
  matchText: "aple",
  submatches: [],
  index: 9,
  endIndex: 13,
  cost: 1,
  errors: { insertions: 0, deletions: 1, substitutions: 0 }
} */

// Safe UTF-16 string slicing:
const matchedString = 'I ate an aple'.slice(result.index, result.endIndex)
// => "aple"

```

Source Code: **[tre-regex on GitHub](https://github.com/le0pard/tre-regex)** | NPM: **[@tre-regex/regex](https://www.npmjs.com/package/@tre-regex/regex)**

---

All three projects are open-source under the MIT license. I hope you find them useful in your daily workflows or applications! As always, your feedback, bug reports, and pull requests on GitHub are very welcome.

