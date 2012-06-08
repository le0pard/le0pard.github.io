---
layout: post
title: Bort и Suspender - шаблоны Rails-приложений
wordpress_id: 502
wordpress_url: http://leopard.in.ua/?p=502
categories:
- Ruby on Rails
tags:
- Ruby on Rails
---
<div id="container-excerpt">Если вы занимаетесь разработкой rails-приложений, то наверное заметили, что есть набор плагинов и библиотек, которые используются регулярно. Устанавливать их каждый раз при создании скелета нового приложения довольно рутинная задача.Вот тут и приходят на помощь пакеты **Bort** и **Suspender**.</div>Оба этих пакета представляют собой наборы, включающие Rails 2.1 и несколько плагинов и библиотек, которые используются наиболее часто.<!--more-->## Bort
Официально можно назвать “первооткрывателем”, потому что, судя по новостям, именно этот пакет был первым.В комплект входят:- <span class="caps">REST</span>ful Authentication
- User Roles
- OpenID Integration
- Will Paginate
- Rspec &amp; Rspec-rails
- Exception Notifier
- Asset Packager
- Routes (для <span class="caps">REST</span>ful Authentication и функции “забыл пароль”)
- settings.yml (файл с настройками типа “имя сайта”, “адрес сайта”, “адрес почты администратора”, которые используются <span class="caps">REST</span>ful Auth)
- Настройки для Capistrano
- Настройки для хранения сессий в базе данных
- еще некоторые мелочи, как то хелпер “page title” или заранее удаленный файл public/index.html
### Установка
1. Скачайте дистрибутив [http://github.com/fudgestudios/bort/tree](http://github.com/fudgestudios/bort/tree).
2. Распакуйте полученный файл
3. Задайте нужные настройки в database.yml и запустите ``rake db:migrate``
Теперь все готово для начала работы над вашим приложением.Вот пример запущенного приложения[![](http://leopard.in.ua/wp-content/uploads/2008/11/screenshot-300x140.png "screenshot")](http://leopard.in.ua/wp-content/uploads/2008/11/screenshot.png)[![](http://leopard.in.ua/wp-content/uploads/2008/11/screenshot-1-300x199.png "screenshot-1")](http://leopard.in.ua/wp-content/uploads/2008/11/screenshot-1.png)### Ссылки
- [Официальная страница Bort](http://jimneath.org/bort)
- [Репозиторий на GitHub](http://github.com/fudgestudios/bort/tree%22:http://github.com/fudgestudios/bort/tree)
- Страница обратной связи, где вы сможете задать вопросы и посмотреть ответы на вопросы других — [bort.uservoice.com](http://bort.uservoice.com/)
## Suspender
Второй пакет в этом обзоре создала команда [Thoughtbot](http://thoughtbot.com/) (изначально для применения только внутри компании). Кстати, некоторые приложения-участники Rails Rumble 2008 тоже использовали Suspender.### Итак, в пакет входят
**vendor/gems**- mislav-will_paginate
- RedCloth
- mocha
- thoughtbot-factory_girl
- thoughtbot-shoulda
- quietbacktrace
**vendor/plugins**- hoptoad_notifier
- limerick_rake
- mile_marker
- squirrel
**config/initializers**- time_formats.rb (По умолчанию доступны два формата — :short_date и :long_date)
- action_mailer_configs.rb (по умолчанию используется <span class="caps">SMTP</span>)
- hoptoad.rb (здесь вам потребуется <span class="caps">API</span>-ключ [hoptoadapp.com](http://hoptoadapp.com/))
- requires.rb (автоматически загружает все из lib/, lib/extensions, test/mocks/RAILS_ENV)
Как и Bort, этот шаблон поддерживает развертывание приложения с помощью Сapistrano. Кроме того, Suspenders имеет ряд rake-задач для работы с git-репозиторием.### Установка
Начните с репозитория [http://github.com/thoughtbot/suspenders](http://github.com/thoughtbot/suspenders).Далее, чтобы создать новый проект, выполните<pre>``./script/create_project projectname``</pre>и получите новый проект в каталоге ``../projectname``.Чтобы обновить свой пакет Suspender, выполните<pre>``rake git:pull:suspenders ``</pre>### Ссылки
- [Официальная страница Suspenders](http://giantrobots.thoughtbot.com/2008/10/21/suspenders)
- [Репозиторий на GitHub](http://github.com/thoughtbot/suspenders)
## Заключение
Оба этих шаблона решают одну задачу, а какой из них выбрать, решать вам. Приятной работы!
