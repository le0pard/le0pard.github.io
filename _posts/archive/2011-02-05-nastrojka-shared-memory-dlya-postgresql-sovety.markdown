---
layout: post
title: Настройка shared memory для PostgreSQL
wordpress_id: 1151
wordpress_url: http://leopard.in.ua/?p=1151
categories:
- интересно
- postgresql
tags:
- интересно
- postgresql
---
## <span style="font-size: 13px; font-weight: normal;">Для меня это частая работа. Вам выдали сервер, вы поставили PostgreSQL, начали его тюнить и пошли такие ошибки:</span>
FATAL: could not create shared memory segment: Invalid argumentDETAIL: Failed system call was shmget(key=5440001, size=4011376640, 03600)Это значит, что мы забыли настроить на наше Unix системе shared memory. Идем по [адресу](http://www.postgresql.org/docs/current/static/kernel-resources.html) и смотрим как настроить наш тип ОС. Но какие значения ставить shmmax и shmall? Для этого сделан небольшой скрипт. Его задача - посчитать и вывести размер shared memory, который равен половине доступной на сервере памяти (всей доступной).<!--more--><pre lang="bash">#!/bin/bash# simple shmsetup scriptpage_size=`getconf PAGE_SIZE`phys_pages=`getconf _PHYS_PAGES`shmall=`expr $phys_pages / 2`shmmax=`expr $shmall \* $page_size`echo kernel.shmmax = $shmmaxecho kernel.shmall = $shmall</pre>[Ссылка на скрипт](https://gist.github.com/812606)Например, для сервера с 2Гб RAM скрипт выдаст следующее:<pre lang="bash">kernel.shmmax = 1055092736kernel.shmall = 257591</pre>Здесь SHMMAX максимальный размер (в байтах) на сегменте shared memory, установлен в 1 Гб. SHMALL - общее количество разделяемой памяти (в страницах), какое все процессы на сервере могут использовать. Количество байтов в странице зависит от операционной системы; в, основном, по умолчанию 4096 байт.Для того, что бы эти данные применились для Linux, выполните данную команду от root (./shmsetup - данный скрипт):<pre lang="bash">./shmsetup &gt;&gt; /etc/sysctl.conf</pre>И проверьте правильность:<pre lang="bash">sysctl -p</pre>**ЗЫ.** Также не забываем про семафоры в системе:<pre lang="bash">$ ipcs -l...------ Пределы семафоров --------максимальное количество массивов = 128максимум семафоров на массив = 250максимум семафоров на всю систему = 32000максимум операций на вызов семафора = 32максимальное значение семафора = 32767</pre>Значения в sysctl:<pre lang="bash">$ sysctl kernel.semkernel.sem = 250 32000  32 128</pre>Все четыре значения, возможно, потребуется увеличить на системах с большим число процессов.Удачи.
