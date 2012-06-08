---
layout: post
title: eAccelerator и open_basedir
wordpress_id: 1005
wordpress_url: http://leopard.in.ua/?p=1005
categories:
- PHP
- разработка
tags:
- разработка
- PHP
---
Наверно многие PHP разработчики работали с таким акселератором, как eAccelerator. eAccelerator является PHP-акселератором, основное назначение которого  состоит в кэшировании бинарного представления кода. Каждый раз при выполнении скрипта, PHP читает все подключаемые файлы и  переводит их в бинарный код, при запросе скрипта операция повторяется.  Задача eAccelerator состоит в сохранении бинарного кода для повторного использования, уменьшая время  выполнения скрипта. Быстрый, простой, легкий в настройке. Что еще пожелать?В новых версиях (а именно с 0.9.6 и 0.9.6.1) была найдена неприятная вещь. При компиляции по умолчанию, а именно через такой набор команд:``<pre lang="bash">phpize./configuremakemake install</pre>``начинаются проблемы с PHP, а именно:<pre lang="bash">PHP Warning:  Unknown: open_basedir restriction in effect. File() is not within the allowed path(s): (&lt;your_open_basedir_dirs&gt;) in Unknown on line 0</pre>Все оказывается просто. При использовании директивы PHP **open_basedir** для обеспечения безопасности, нужно собрать eAccelerator с опцией <span style="font-size: medium;">**``"--without-eaccelerator-use-inode"``**</span>. Данный механизм хранения кэша не совместим с open_basedir, поэтому open_basedir в сочетании с этой опцией приводит к фатальным ошибокам в скриптах.Решение:``<pre lang="bash">phpize./configure --without-eaccelerator-use-inodemakemake install</pre>``Вот и все!
