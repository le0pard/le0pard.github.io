---
layout: post
title: ! 'HipHop для PHP: Сравнение'
wordpress_id: 1182
wordpress_url: http://leopard.in.ua/?p=1182
categories:
- Ruby
- PHP
- интересно
tags:
- Ruby
- PHP
- интересно
---
Если кто еще не слышал, HipHop – это компилятор кода PHP в C++. Т.е. он преобразует PHP код в C++ код для дальнейшей компиляции. HipHop достигает этого, путем исследования вашего PHP приложения и на его основе строить C++ проект. C++ проект потом компилируется и запускается на собственном веб серврере. Это дает возможность исключить PHP Zend engine и Apache из цепочки. HipHop выпущен Facebook под opensource лицензией.Есть такой интересный сайт [http://shootout.alioth.debian.org](http://shootout.alioth.debian.org/) который позволяет произвести сравнение языков скорости языков программирования для разных тестов. Я решил собрать у себя HipHop и провести сравнение PHP vs HipHop vs Ruby1.9 (ruby я добавил из интереса). Собрать сам HipHop не трудно - [https://github.com/facebook/hiphop-php/wiki](https://github.com/facebook/hiphop-php/wiki) - на данной странице все отлично написано.<!--more-->Итак мы имеем:<pre lang="bash">$ uname -aLinux leo-VirtualBox 2.6.35-28-generic #49-Ubuntu SMP Tue Mar 1 14:40:58 UTC 2011 i686 GNU/Linux$ ruby -vruby 1.9.2p188 (2011-03-28 revision 31204) [i686-linux]$ php -vPHP 5.3.3-1ubuntu9.3 with Suhosin-Patch (cli) (built: Jan 12 2011 16:08:14)Copyright (c) 1997-2009 The PHP GroupZend Engine v2.3.0, Copyright (c) 1998-2010 Zend Technologies    with XCache v1.3.0, Copyright (c) 2005-2009, by mOo</pre>
---
### Тест #1: n-body (Perform an N-body simulation of the Jovian planets).
Гравитационная задача N тел. [Подробнее](http://ru.wikipedia.org/wiki/%D0%93%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B0%D1%86%D0%B8%D0%BE%D0%BD%D0%BD%D0%B0%D1%8F_%D0%B7%D0%B0%D0%B4%D0%B0%D1%87%D0%B0_N_%D1%82%D0%B5%D0%BB)Код для n-body на PHP: [http://shootout.alioth.debian.org/u32/benchmark.php?test=nbody&amp;lang=php](http://shootout.alioth.debian.org/u32/benchmark.php?test=nbody&lang=php)Код для n-body на Ruby1.9: [http://shootout.alioth.debian.org/u32/benchmark.php?test=nbody&amp;lang=yarv](http://shootout.alioth.debian.org/u32/benchmark.php?test=nbody&lang=yarv)Проводим тестирование:**PHP**<pre lang="bash">$ /usr/bin/time -f "%U" php -n /home/leo/temp/hiphop_test/nbody.php 50000000-0.169075164-0.1690599071106.99</pre>**HipHop**<pre lang="bash">$ /usr/bin/time -f "%U" /home/leo/temp/hiphop_test/nbody/program 50000000-0.169075164-0.169059907630.13</pre>**Ruby 1.9**<pre lang="bash">$ /usr/bin/time -f "%U" ruby nbody.rb 50000000-0.169075164-0.1690599071829.22</pre>Последнее в выводе всех экспериментов время выполнения скрипта в секундах. Как видим меньше всего времени затратил HipHop (630.13 сек), за ним PHP(1106.99 сек), а потом уже Ruby 1.9(1829.22 сек).
![n-body тест (меньше - лучше)](https://chart.googleapis.com/chart?chxt=x,y&cht=bvs&chd=t:1106.99,630.13,1829.22&chco=4d89f9|0000FF|76A4FB&chls=2.0&chs=320x200&chxl=0:|Php|HipHop|Ruby1.9&chds=0,2000&chbh=50&chxr=1,0,2000,500 "n-body тест (меньше - лучше)")

n-body тест (меньше - лучше)
Скорость HipHop по сравнению с PHP приблизительно на **175%** выше в этом тесте.
---
### Тест #2: fannkuch-redux (Repeatedly access a tiny integer-sequence).
Код для fannkuch-redux на PHP: [http://shootout.alioth.debian.org/u32/benchmark.php?test=fannkuchredux&amp;lang=php](http://shootout.alioth.debian.org/u32/benchmark.php?test=fannkuchredux&lang=php)Код для fannkuch-redux на Ruby1.9: [http://shootout.alioth.debian.org/u32/benchmark.php?test=fannkuchredux&amp;lang=yarv](http://shootout.alioth.debian.org/u32/benchmark.php?test=fannkuchredux&lang=yarv)Проводим тестирование:**PHP**<pre lang="bash">$ /usr/bin/time -f "\n%U" php -n /home/leo/temp/hiphop_test/fannkuchredux.php 11556355Pfannkuchen(11) = 51390.83</pre>**HipHop**<pre lang="bash">$ /usr/bin/time -f "\n%U" /home/leo/temp/hiphop_test/fannkuchredux/program 11556355Pfannkuchen(11) = 51167.46</pre>**Ruby 1.9**<pre lang="bash">$ /usr/bin/time -f "\n%U" ruby /home/leo/temp/hiphop_test/fannkuchredux.rb 11556355Pfannkuchen(11) = 51398.72</pre>Последнее в выводе всех экспериментов время выполнения скрипта в секундах. Как видим меньше всего времени затратил HipHop (167.46 сек), за ним PHP(390.83 сек), а потом уже Ruby 1.9(398.72 сек).
![fannkuch-redux тест (меньше - лучше)](https://chart.googleapis.com/chart?chxt=x,y&cht=bvs&chd=t:390.83,167.46,398.72&chco=4d89f9|0000FF|76A4FB&chls=2.0&chs=320x200&chxl=0:|Php|HipHop|Ruby1.9&chds=0,500&chbh=50&chxr=1,0,500,100 "fannkuch-redux тест (меньше - лучше)")

fannkuch-redux тест (меньше - лучше)
Скорость HipHop по сравнению с PHP приблизительно на **233%** выше в этом тесте.
---
### Тест #3: fasta (Generate and write random DNA sequences).
Код для fasta на PHP: [http://shootout.alioth.debian.org/u32/benchmark.php?test=fasta&amp;lang=php](http://shootout.alioth.debian.org/u32/benchmark.php?test=fasta&lang=php)Код для fasta на Ruby1.9: [http://shootout.alioth.debian.org/u32/benchmark.php?test=fannkuchredux&amp;lang=yarv](http://shootout.alioth.debian.org/u32/benchmark.php?test=fasta&lang=yarv)Проводим тестирование:**PHP**<pre lang="bash">$ /usr/bin/time -f "%U" php -n /home/leo/temp/hiphop_test/fasta.php 25000000 &gt; /tmp/out.txt244.62</pre>**HipHop**<pre lang="bash">$ /usr/bin/time -f "%U" /home/leo/temp/hiphop_test/fasta/program 25000000 &gt; /tmp/out.txt82.53</pre>**Ruby 1.9**<pre lang="bash">$ /usr/bin/time -f "%U" ruby /home/leo/temp/hiphop_test/fasta.rb 25000000 &gt; /tmp/out.txt258.80</pre>Последнее в выводе всех экспериментов время выполнения скрипта в секундах. Как видим меньше всего времени затратил HipHop (82.53 сек), за ним PHP(244.62 сек), а потом уже Ruby 1.9(258.80 сек).
![fasta тест (меньше - лучше)](https://chart.googleapis.com/chart?chxt=x,y&cht=bvs&chd=t:244.62,82.53,258.80&chco=4d89f9|0000FF|76A4FB&chls=2.0&chs=320x200&chxl=0:|Php|HipHop|Ruby1.9&chds=0,300&chbh=50&chxr=1,0,300,50 "fasta тест (меньше - лучше)")

fasta тест (меньше - лучше)
Скорость HipHop по сравнению с PHP приблизительно на **296% (почти в 3 раза быстрее)** выше в этом тесте.
---
### Тест #4: spectral-norm (Calculate an eigenvalue using the power method).
Код для spectral-norm на PHP: [http://shootout.alioth.debian.org/u32/program.php?test=spectralnorm&amp;lang=php](http://shootout.alioth.debian.org/u32/program.php?test=spectralnorm&lang=php)Код для spectral-norm на Ruby1.9: [http://shootout.alioth.debian.org/u32/benchmark.php?test=spectralnorm&amp;lang=yarv](http://shootout.alioth.debian.org/u32/benchmark.php?test=spectralnorm&lang=yarv)Проводим тестирование:**PHP**<pre lang="bash">$ /usr/bin/time -f "%U" php -n /home/leo/temp/hiphop_test/spectralnorm.php 55001.274224153708.54</pre>**HipHop**<pre lang="bash">$ /usr/bin/time -f "%U" /home/leo/temp/hiphop_test/spectralnorm/program 55001.274224153355.41</pre>**Ruby 1.9**<pre lang="bash">$ /usr/bin/time -f "%U" ruby /home/leo/temp/hiphop_test/spectralnorm.rb 55001.274224153772.11</pre>Последнее в выводе всех экспериментов время выполнения скрипта в секундах. Как видим меньше всего времени затратил HipHop (355.41 сек), за ним PHP(708.54 сек), а потом уже Ruby 1.9(772.11 сек).
![spectral-norm тест (меньше - лучше)](https://chart.googleapis.com/chart?chxt=x,y&cht=bvs&chd=t:708.54,355.41,772.11&chco=4d89f9|0000FF|76A4FB&chls=2.0&chs=320x200&chxl=0:|Php|HipHop|Ruby1.9&chds=0,800&chbh=50&chxr=1,0,800,100 "spectral-norm тест (меньше - лучше)")

spectral-norm тест (меньше - лучше)
Скорость HipHop по сравнению с PHP приблизительно на **199% (почти в 2 раза быстрее)** выше в этом тесте.
---
### Тест #5: mandelbrot (Generate a Mandelbrot set and write a portable bitmap).
Код для mandelbrot на PHP: [http://shootout.alioth.debian.org/u32/benchmark.php?test=mandelbrot&amp;lang=php](http://shootout.alioth.debian.org/u32/benchmark.php?test=mandelbrot&lang=php)Код для mandelbrot на Ruby1.9: [http://shootout.alioth.debian.org/u32/benchmark.php?test=mandelbrot&amp;lang=yarv](http://shootout.alioth.debian.org/u32/benchmark.php?test=mandelbrot&lang=yarv)Проводим тестирование:**PHP**<pre lang="bash">$ /usr/bin/time -f "%U" php -n /home/leo/temp/hiphop_test/mandelbrot.php 16000 &gt; /tmp/out.txt2217.80</pre>**HipHop**<pre lang="bash">$ /usr/bin/time -f "%U" /home/leo/temp/hiphop_test/mandelbrot/program 16000 &gt; /tmp/out.txt1108.66</pre>**Ruby 1.9**<pre lang="bash">$ /usr/bin/time -f "%U" ruby /home/leo/temp/hiphop_test/mandelbrot.rb 16000 &gt; /tmp/out.txt5708.92</pre>Последнее в выводе всех экспериментов время выполнения скрипта в секундах. Как видим меньше всего времени затратил HipHop (1108.66 сек), за ним PHP(2217.80 сек), а потом уже Ruby 1.9(5708.92 сек).
![mandelbrot тест (меньше - лучше)](https://chart.googleapis.com/chart?chxt=x,y&cht=bvs&chd=t:2217.80,1108.66,5708.92&chco=4d89f9|0000FF|76A4FB&chls=2.0&chs=320x200&chxl=0:|Php|HipHop|Ruby1.9&chds=0,6000&chbh=50&chxr=1,0,6000,1000 "mandelbrot тест (меньше - лучше)")

mandelbrot тест (меньше - лучше)
Скорость HipHop по сравнению с PHP приблизительно **200% (в 2 раза быстрее)** выше в этом тесте.
---
### Тест #6: binary-trees (Allocate and deallocate many many binary trees).
Код для binary-trees на PHP: [http://shootout.alioth.debian.org/u32/program.php?test=binarytrees&amp;lang=php](http://shootout.alioth.debian.org/u32/program.php?test=binarytrees&lang=php)Код для binary-trees на Ruby1.9: [http://shootout.alioth.debian.org/u32/benchmark.php?test=binarytrees&amp;lang=yarv](http://shootout.alioth.debian.org/u32/benchmark.php?test=binarytrees&lang=yarv)Проводим тестирование:**PHP**<pre lang="bash">$ /usr/bin/time -f "%U" php -n /home/leo/temp/hiphop_test/binary_tree.php 16stretch tree of depth 17 check: -1131072 trees of depth 4 check: -13107232768 trees of depth 6 check: -327688192 trees of depth 8 check: -81922048 trees of depth 10 check: -2048512 trees of depth 12 check: -512128 trees of depth 14 check: -12832 trees of depth 16 check: -32long lived tree of depth 16 check: -156.96</pre>**HipHop**<pre lang="bash">$ /usr/bin/time -f "%U" /home/leo/temp/hiphop_test/binary_tree/program 16stretch tree of depth 17 check: -1131072 trees of depth 4 check: -13107232768 trees of depth 6 check: -327688192 trees of depth 8 check: -81922048 trees of depth 10 check: -2048512 trees of depth 12 check: -512128 trees of depth 14 check: -12832 trees of depth 16 check: -32long lived tree of depth 16 check: -112.60</pre>**Ruby 1.9**<pre lang="bash">$ /usr/bin/time -f "%U" ruby /home/leo/temp/hiphop_test/binary_tree.rb 16stretch tree of depth 17 check: -1131072 trees of depth 4 check: -13107232768 trees of depth 6 check: -327688192 trees of depth 8 check: -81922048 trees of depth 10 check: -2048512 trees of depth 12 check: -512128 trees of depth 14 check: -12832 trees of depth 16 check: -32long lived tree of depth 16 check: -114.07</pre>Последнее в выводе всех экспериментов время выполнения скрипта в секундах. Как видим меньше всего времени затратил HipHop (12.60 сек), за ним Ruby 1.9 (хоть сдесь!)(14.07 сек), а потом уже PHP(56.96 сек).
![binary-trees тест (меньше - лучше)](https://chart.googleapis.com/chart?chxt=x,y&cht=bvs&chd=t:56.96,12.60,14.07&chco=4d89f9|0000FF|76A4FB&chls=2.0&chs=320x200&chxl=0:|Php|HipHop|Ruby1.9&chds=0,60&chbh=50&chxr=1,0,60,10 "binary-trees тест (меньше - лучше)")

binary-trees тест (меньше - лучше)
Скорость HipHop по сравнению с PHP приблизительно на **452% (в 4,5 раза быстрее)** выше в этом тесте.
---
## Итог
Как вы можете видеть, HipHop для PHP значительно ускоряет PHP скрипты. Различие в ускорении от 200% до 400% было достигнуто без какого-либо изменения в PHP скриптах.К сожалению, есть некоторые несовместимости со стандартным языком PHP у HipHop: например, отсутствие поддержки GMP библиотеки (не выполняется [pidigits](http://shootout.alioth.debian.org/u32/benchmark.php?test=pidigits&lang=php) тест).В следующей статье постараюсь показать в каких случаях PHP быстрее HipHop.
**_Удачи Вам!_**
