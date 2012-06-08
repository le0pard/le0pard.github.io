---
layout: post
title: Кеширование в PHP. Memcache
wordpress_id: 398
wordpress_url: http://leopard.in.ua/?p=398
categories:
- PHP
- memcache
tags:
- PHP
- memcache
---
Сегодня я расскажу о кешировании при помощи MemCache в PHP. Для начала узнаем что такое MemCache (надеюсь вы знаете что такое PHP, иначе эта статья не для Вас).**Memcached** (читается мемкэ́шт) — алгоритм кэширования различных объектов в оперативной памяти. Позволяет, используя специальное API (для Perl, PHP, Python, Java и др.), сохранить в ОЗУ блок данных, сопоставленный с определённым символьным ключом.Сервер memcached был разработан для сайта **LiveJournal**, имеющего более миллиона посетителей в сутки. Его применение снизило загрузку серверов баз данных в разы.<!--more-->В API memcached есть только базовые функции: выбор сервера, установка и разрыв соединения, добавление, удаление, обновление и получение объекта. Для каждого объекта устанавливается время жизни, от 1 секунды до бесконечности. При переполнении памяти более старые объекты автоматически удаляются. Для PHP также есть уже готовые библиотеки PECL для работы с memcached, которые дают дополнительную функциональность.## Установка memcache под Windows
1. [Скачиваем сервер memcached (memcached-1.2.1-win32.zip)](http://jehiah.cz/projects/memcached-win32/)
2. Распаковываем полученный архив на диск, например, в c:\memcache\
3. Далее запускаем из командной строки: c:\memcache\memcached.exe -d install, тем самым устанавливая memcached как сервис.
4. Теперь, осталось только запустить этот сервис: c:\memcache\memcached.exe -d start
5. Все, memcache установнен на вашей машине и уже работает. Список всех доступных команд получаем так: c:\memcache\memcached.exe -h
## Установка модуля для PHP (опять же под Windows)
Здесь тоже все предельно просто.1. [Скачиваем расширение для установленной у вас версии PHP](http://pecl4win.php.net/ext.php/php_memcache.dll)
2. Копируем полученный файл php_memcache.dll в директорию расширений для PHP. Например, у меня это C:\server\usr\local\php5\ext\
3. Добавляем в файл php.ini строку extension = php_memcache.dll, в раздел Dynamic Extensions.
4. Перезапускаем сервер. Все, memcache установлен! Данный факт можно проверить при помощи функции phpinfo();
## Установка под Linux
А линуксоиды и сами справятся с установкой. Один совет, устанавливайте из репозитария - меньше гемороя будет. :)Например, для Debian(Ubuntu):<pre lang="bash">apt-get install memcached libmemcache0 php5-memcache</pre>и будет вам счастье.## Создание класса
Подготовительный этап окончен, теперь приступаем к программированию. Напишем мы класс для работы с memcached. Вот сам код:<pre lang="php">&lt;?phpclass CACHE_MemCache {private $memcache;private $timeLife;private $compress;/**** @param string $host - хост сервера memcached* @param int $port - порт сервера memcached* @param int $compress - [0,1], сжимать или нет данные перед* помещением в память*/public function __construct($host, $port = 11211, $compress = 0){$this-&gt;memcache = new Memcache;$this-&gt;memcache-&gt;connect($host, $port);$this-&gt;compress = ($compress) ? MEMCACHE_COMPRESSED : 0;}public function load($valueID, $timeLife){$this-&gt;timeLife = $timeLife;return $this-&gt;memcache-&gt;get($valueID);}public function save($valueID, $value){return $this-&gt;memcache-&gt;set($valueID, $value, $this-&gt;compress, $this-&gt;timeLife);}public function delete($valueID){$this-&gt;memcache-&gt;delete($valueID);}public function __destruct(){$this-&gt;memcache-&gt;close();}}?&gt;</pre>Честно говоря обьяснять то и нечего, но чуток поясню.<pre lang="php">public function __construct($host, $port = 11211, $compress = 0)</pre>Создает обьект по хосту, порту ($host, $port) а так же указывает нужно нам сжатие или нет.<pre lang="php">public function load($valueID, $timeLife)</pre>Пробует загрузить данные по ключу $valueID с интервалом жизни $timeLife (в секундах). Если не получится - вернет false.<pre lang="php">public function save($valueID, $value)</pre>Сохранение данных $value по ключу $valueID<pre lang="php">public function delete($valueID)</pre>Удаление данных по ключу $valueID<pre lang="php">public function __destruct()</pre>Деструктор обьекта, закрывает подключение к memcached серверу.## Использование класса
Все. Теперь на уже настроенной машине пишем можем тестировать наш класс<pre lang="php">$cache = new CACHE_MemCache('127.0.0.1', 11211);if ($data = $cache-&gt;load('key_data', 60*60)){return $data;} else {//тут мы берем данные или из бази (или от куда нам надо)// $data пришла//сохраняем в мемкеш, поскольку он оказался уже чист$cache-&gt;save('key_data', $data);return $data;}</pre>Вот и все. Если данные по ключу key_data сохранились (хранятся час в нашем случае), то мы просто возращаем их, иначе - обращаемся к базе данных (или файлу, где они хранятся), записываем данные по ключу в memcache и возращаем данные.**Удачи в программировании!!!**
