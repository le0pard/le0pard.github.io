---
layout: post
title: Пространство имён в Javascript-коде
wordpress_id: 820
wordpress_url: http://leopard.in.ua/?p=820
categories:
- javascript
tags:
- javascript
---
Этот подход отличается от других методов тем, что позволяет кроме функций и данных видимых снаружи, также определять данные и функции локальные для пространства имен и невидимые снаружи. Код выглядит следующим образом:<pre lang="javascript">App = function(){   // public data   var FooMember = 3;   // public function   function foo()   {     // use private data     alert(_FooMember);     // call private function      _foo();   }   // private data   var _FooMember = 4;   // private function   function _foo()   {   }   return {       FooMember: FooMember,       foo: foo   }}();</pre><!--more-->Использование данного кода очевидно:<pre lang="javascript">   alert(App.FooMember);   App.foo();</pre>Упомяну заодно и технику имитации enumeration в Javascript. Вместо написания кода типа:<pre lang="javascript">   var STORY_NEW = 1;   var STORY_UPDATE = 2;   var STORY_DELETE = 3;   ..........   switch (tag)   {      case STORY_NEW: ...; break;      case STORY_UPDATE: ...; break;      case STORY_DELETE: ...; break;      ...   }</pre>можно написать следующее:<pre lang="javascript">   var StoryAction = {      New: 1,      Update: 2,      Delete: 3,      ....   };   ...   switch (tag)   {      case StoryAction.New: ...; break;      case StoryAction.Update: ...; break;      case StoryAction.Delete: ...; break;      ...   }</pre>Надеюсь, что эти два приёма кому-то покажутся полезными.
