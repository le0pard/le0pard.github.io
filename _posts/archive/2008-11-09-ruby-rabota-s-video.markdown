---
layout: post
title: Ruby - работа с видео
wordpress_id: 533
wordpress_url: http://leopard.in.ua/?p=533
categories:
- Ruby
tags:
- Ruby
---
_Так как Ruby является интерпретируемым языком программирования — его не считают подходящим для интенсивной работы с видео (кодирование и т.д.). Тем не менее существуют Ruby библиотеки которые предназначены для работы с видео — в основном они взаимодействуют с более быстрыми инструментами и библиотеками._<!--more--><!-- column 1 start -->## RMov (Ruby Quicktime Библиотека)
[Rmov](http://github.com/ryanb/rmov/tree/master) — новая великолепная библиотека от Райан Бэйтс (Ryan Bates), это обертка вокруг Apple QuickTime <span class="caps">API</span> позволяющая открывать, редактировать и экспортировать QuickTime видео. К сожалению  библиотека работает только в  OS X.## RVideo (Ruby Video Processing)
[RVideo](http://rvideo.rubyforge.org/) ([Github](http://github.com/zencoder/rvideo/tree)) — Ruby библиотека, которая взаимодействует с различными программами, например с Ffmpeg позволяя обрабатывать видео и аудио файлы. Например, вы можете использовать RVideo, для преобразования видео в <span class="caps">FLV</span>.## Panda (Видео конвертирование и потоковое вешание)
[Panda](http://www.rubyinside.com/panda-merb-based-video-uploading-encoding-and-streaming-system-1209.html) — Ruby библиотека с открытым исходным кодом позволяющая «загружать, кодировать и потоковое вещание». Интерфейс реализован при помощи фреймворка Merb. Для обработки видео использует различные инструменты, такие как Ffmpeg. Возможна интеграция работы с Amazon EC2 аккаунтом для интенсивной работы.## Hey!Spread (Video Promotion Web Service)
[Hey!Spread](http://github.com/sadikzzz/heyspread-ruby/tree/master) позволяет легко загружать видео на YouTube и Google Video.## Fliqz4R (“White-Label YouTube” <span class="caps">API</span>)
[Fliqz](http://www.fliqz.com/) — это поставщик “plug and play видео решений”. Фактически они представляют backend инфраструктуры для размещения и воспроизведения видео. Либин Пан (Libin Pan) написал также [учебник](http://fliqz.learnhub.com/lesson/page/321_how_to_use_fliqz4_r) о том как использовать  Fliqz в Ruby / Rails ([Fliqz4R](http://github.com/libin/fliqz4r/tree/master) Rails плагин)[Источник](http://rubymag.ru/articles/ruby-rabota-s-video)
