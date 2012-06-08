---
layout: post
title: Утечка адресной книги в Mail.Ru
wordpress_id: 370
wordpress_url: http://leopard.in.ua/?p=370
categories:
- защита и безопасность информации
tags:
- защита и безопасность информации
---
В популярном сервисе бесплатной почты Mail.Ru обнаружена уязвимость, позволяющая злоумышленнику получить адресную книгу пользователя этого сервиса. Она относится к разряду Cross-Site Request Forgery, то есть из-за недостаточной проверки источника запроса можно получить доступ к адресной книге. Уязвимость рассматривается как критическая. Как утверждает автор уязвимости, еще несколько крупных порталов Рунета подвержено подобного рода атакам.пример атаки:[ Mail.Ru Addressbook Hijacking](http://trytofindoutthetruth.googlepages.com/hijack.html)Приведено в образовательных целях. Данные из адресной книги нигде не сохраняются и не никакие внешние источники не отправляются. Производитя отображение Вашей адресной книги только в Вашем бразуере.Под катом два скрина<!--more-->[![](http://leopard.in.ua/wp-content/uploads/2008/09/screenshot-1_1-300x52.png "screenshot-1_1")](http://leopard.in.ua/wp-content/uploads/2008/09/screenshot-1_1.png)[![](http://leopard.in.ua/wp-content/uploads/2008/09/screenshot_5-300x80.png "screenshot_5")](http://leopard.in.ua/wp-content/uploads/2008/09/screenshot_5.png)
