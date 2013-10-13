---
layout: post
title: Binary serialization formats
date: 2013-10-13 00:00:00
categories:
- formats
tags:
- formats
- serialization formats
---
Hello my dear friends. Today we will talk about binary serialization formats.

# Binary serialization formats

Serialization is the process of translating data structures or object state into a format that can be stored and resurrected later in the same or another computer environment. In most cases binary serialization formats is not human-readable, but it can effectively compress the data, which is very usefull for caches, inter process communication, message brokers, etc. For my development tasks very important select good binary serialization format, which will used for distributed system for inter communication and storage. Let's look at the most interesting of these formats.

## BSON

* [Site](http://bsonspec.org/)

BSON is a computer data interchange format used mainly as a data storage and network transfer format in the MongoDB database. It is a binary form for representing simple data structures and associative arrays (called objects or documents in MongoDB). BSON has a huge number of implementations. Compared to JSON, BSON is designed to be efficient both in storage space and scan-speed. The key advantage is its traversability, which makes it suitable for storage purposes, but comes at the cost of over-the-wire encoding size (in some cases, BSON will use more space than JSON due to the length prefixes and explicit array indices).

{% highlight ruby %}
2.0.0p247 :002 > a = { key: "example"}.to_bson
 => "\x16\x00\x00\x00\x02key\x00\b\x00\x00\x00example\x00\x00"
2.0.0p247 :003 > BSON::Document.from_bson(StringIO.new(a))
 => {"key"=>"example"}
{% endhighlight %}

## MessagePack

* [Site](http://msgpack.org/)

MessagePack is a binary form for representing simple data structure like arrays and associative arrays. MessagePack aims to be as compact and simple as possible. MessagePack has a huge number of implementations. MessagePack is designed to be fast. It's transparently compatible with JSON, despite BSON's reputation as the recommended binary JSON equivalent. In my humble opinion, MessagePack better for networking communication and BSON better for storage purpose.

{% highlight ruby %}
2.0.0p247 :002 > msg = MessagePack.pack({ key: "example"})
 => "\x81\xA3key\xA7example"
2.0.0p247 :003 > MessagePack.unpack(msg)
 => {"key"=>"example"}
{% endhighlight %}

## BERT

* [Site](http://bert-rpc.org/)

Originally comde from Erlang. Specification written by Tom Preston-Werner, founder of Github, and used heavily there. BERT has a huge number of implementations. In some simple Ruby benchmarking, I noticed that BERT was an order of magnitude slower at serialization than BSON or MessagePack. This may not be true in other language ports, however.

{% highlight ruby %}
2.0.0p247 :002 > a = BERT.encode({ key: "example"})
 => "\x83h\x03d\x00\x04bertd\x00\x04dictl\x00\x00\x00\x01h\x02d\x00\x03keym\x00\x00\x00\aexamplej"
2.0.0p247 :003 > BERT.decode(a)
 => {:key=>"example"}
{% endhighlight %}

## Protocol Buffers

* [Site](https://code.google.com/p/protobuf/)

Protocol Buffers are a method of serializing structured data. As such, they are useful in developing programs to communicate with each other over a wire or for storing data. The method involves an interface description language that describes the structure of some data and a program that generates from that description source code in various programming languages for generating or parsing a stream of bytes that represents the structured data. Google developed Protocol Buffers for use internally. Does not provide an RPC mechanism but instead focuses on interchange protocols. Widely implemented, though not all are of the same quality/completion.

## Cap'n Proto

* [Site](http://kentonv.github.io/capnproto/)

Cap'n Proto is an insanely fast data interchange format and capability-based RPC system. Cap'n Proto much faster, than Protocol Buffers, because there is no encoding/decoding step. The Cap'n Proto encoding is appropriate both as a data interchange format and an in-memory representation. Developed by Kenton Varda, who was the primary author of Protocol Buffers version 2. At the moment exists a C++ and Python implementations, for Erlang, Ruby and Rust under development.

## Apache Thrift

* [Site](http://thrift.apache.org/)

Thrift is an interface definition language that is used to define and create services for numerous languages. It is used as a remote procedure call (RPC) framework and was developed at Facebook. Thrift's goal is "to enable efficient and reliable communication across programming languages". Solving many aspects of cross-platform services, it generates RPC code for clients and servers, providing a compact, deterministic, and versionable interchange protocol.

## Apache Avro

* [Site](http://avro.apache.org/docs/current/)

Apache Avro is a data serialization system. Avro requires schemas when data is written or read. Most interesting is that you can use different schemas for serialization and deserialization, and Avro will handle the missing/extra/modified fields. Providing a schema with binary data allows each datum be written without overhead. The result is more compact data encoding, and faster data processing. Avro might be a good choice if the rigidity of Protocol Buffers or Thrift is too much for you.

## Blink protocol

* [Site](http://blinkprotocol.org/)

The Blink Protocol is a standardized method for defining how to exchange messages in and between systems. Blink makes it easy for people to define what information to exchange and how. It also eliminates friction in the communications machinery. The philosophy of Blink is that efficient communication follows from making every word tell. At the moment exists a Java implementation. Protocol Buffers relatively more efficient at encoding a message with many absent fields. The decoding of Protocol Buffers messages will be somewhat more expensive as a result of this relaxed ordering. Blink requires fields to be encoded strictly in specification order.

## Sereal

* [Site](https://github.com/Sereal/Sereal)

Sereal is a binary data serialization format, which was written for Perl, but right now also have Go, Java, Python, Objective-C and Ruby language ports. By [benchmarks](https://github.com/Sereal/Sereal/wiki/Sereal-Comparison-Graphs) have good speed of encoding and decoding.

{% highlight ruby %}
2.0.0p247 :002 > a = Sereal.encode({ key: "example"})
 => "=srl\x01\x00Qckeygexample"
2.0.0p247 :003 > Sereal.decode(a)
 => {"key"=>"example"}
{% endhighlight %}

## Bencode

* [Site](https://wiki.theory.org/BitTorrentSpecification)

Bencode is the encoding used by the peer-to-peer file sharing system BitTorrent for storing and transmitting loosely structured data. Bencoding is most commonly used in torrent files. These metadata files are simply bencoded dictionaries.

While less efficient than a pure binary encoding, bencoding is simple and (because numbers are encoded as text in decimal notation) is unaffected by endianness, which is important for a cross-platform application like BitTorrent. It is also fairly flexible, as long as applications ignore unexpected dictionary keys, so that new ones can be added without creating incompatibilities.

## Gobs

* [Site](http://golang.org/pkg/encoding/gob/)

Specific to the Go language binary serialization format. There is no need for a separate interface definition language or "protocol compiler". The data structure itself is all the package should need to figure out how to encode and decode it. Main goal "to transmit a data structure across a network or to store it in a file, it must be encoded and then decoded again".

## Abstract Syntax Notation One (ASN.1)

* [Site](http://www.itu.int/ITU-T/asn1/index.html)

Abstract Syntax Notation One (ASN.1) is a standard and notation that describes rules and structures for representing, encoding, transmitting, and decoding data in telecommunications and computer networking. The formal rules enable representation of objects that are independent of machine-specific encoding techniques. Because of the widespread use of ASN.1 in 1988 moved to its own standard X.208. Beginning in 1995, significantly revised ASN.1 standard describes X.680.

## Boost Serialization

* [Site](http://www.boost.org/libs/serialization/)

Specific to the C++ language binary serialization format. The biggest problem is the lack of compatibility of different versions of the library. In my humble opinion, boost serialization is great for storing applications local data, but not for networking communication.

# Summary

As can be seen in the list, there are many implementations of binary serialization formats. Which one to choose depends on you, and of course, the problem that it will solve.

*That’s all folks!* Thank you for reading till the end.