---
layout: post
title: ! 'Обновления с Ubuntu 8.04 до Ubuntu 8.10: проблемы, решения и т.д.'
wordpress_id: 509
wordpress_url: http://leopard.in.ua/?p=509
categories:
- ubuntu
tags:
- ubuntu
---
[![](http://leopard.in.ua/wp-content/uploads/2008/11/gangtux_ubuntu.png "gangtux_ubuntu")](http://leopard.in.ua/wp-content/uploads/2008/11/gangtux_ubuntu.png)Для начала:_Вечерело... Сидел на своем блоге, обновлял некоторые модули. Почитав о недавнем релизе Ubuntu, подумал "а не обновится ли мне?". Решил - да, надо попробовать. Вот тут и начались мои приключения._ Для справки [Ubuntu](http://ru.wikipedia.org/wiki/Ubuntu_Linux)<!--more-->Как вы думаете, куда я в первую очередь залез? Правильно - на официальный сайт [Ubuntu](http://www.ubuntu.com/news/ubuntu-8.10-desktop) и почитал что там нового нам сделали. 3G поддержка, шифрование, запись инсталятора на USB носитель, гостевая сессия... честно говоря не впечатлило, но "новый софт будет" подумал я. И начал ставить. Расписывать само обновления бесполезно: сделал как написано [тут](http://www.ubuntu.com/getubuntu/upgrading#Network%20Upgrade%20for%20Ubuntu%20Desktops%20(Recommended)) и все прошло как написано там же.После перегрузки ждал я. Дождался окна приветствия, ввел логин и пароль... и все. Мышка и телесного цвета экран (мышка двигается, но толку). Ctrl+Alt+Backspace не помогает - опять окно входа, а после логина - мышка. Начал рыть логи - пусто. Что делать подумал я... И тут спомнил про кнопку сеанс (кнопка есть в каждом окне приветствия Ubuntu). Нажал, выбрал Gnome, подтвердил его по умолчанию... и вуаля - я в системе.** Одна проблема решена.**Загрузился со стандартным звуком заставки (Ура, хоть это не надо трогать - работает), но тут те на - аплет сети не загрузился. Зашел в Система-Параметры-Сеансы - висит в загрузке. Пробую запустить вручную (в консоле набрав nm-applet), ноль реакции. Проверяю сеть - тоже не работает. Нахожу новый менеджер сети - Система-Параметры-Network Configuration. Там висит одно подключение. Пробую отредактировать - ошибка. Удалить - ошибка (read-only он мне намекает). Я в шоке. Хорошо, лезу в Система-Администрирование-Сеть.
[![](http://leopard.in.ua/wp-content/uploads/2008/11/d181d0bdd0b8d0bcd0bed0ba-150x150.png "d181d0bdd0b8d0bcd0bed0ba")](http://leopard.in.ua/wp-content/uploads/2008/11/d181d0bdd0b8d0bcd0bed0ba.png)

Там выставляю настройки и о чудо - заработало. Но без аплета не жизнь же. Долго не буду пояснять как я до этого добрался но пришлось сделать такое. Лезем в **/etc/network/interfaces**. Там чистим все (да, именно чистим), и оставляем такие строчки
<pre lang="bash">auto loiface lo inet loopback</pre>
Перегружаем машину (перегрузка сетевых интерфейсов ничего не дала). И вуаля - аплет появился. Теперь идем по тому же адресу и добавляем Система-Параметры-Network Configuration и добавляем сколько влезет настроек. ВНИМАНИЕ! Не настраивайте после этого сеть через Система-Администрирование-Сеть, иначе проблема повторится.

[![](http://leopard.in.ua/wp-content/uploads/2008/11/d181d0bdd0b8d0bcd0bed0ba-1-150x150.png "d181d0bdd0b8d0bcd0bed0ba-1")](http://leopard.in.ua/wp-content/uploads/2008/11/d181d0bdd0b8d0bcd0bed0ba-1.png)

**Вторую проблему решили.** (Хотя после перезагрузки появился некий интерфейс Auto eth0 который настроен на DHCP. Зачем - понятия не имею)

Самое что для меня неудобное - **KDE4** теперь идет по умолчанию для программ, написаных на Qt. А некоторые знаменитые программы (Akregator, KGet), которые переписываются под KDE4 не имеют и половины функциональности, чем их собратья в KDE3. Обидно. Не баг, но обидно. (KDE3 отсутствует в Синаптике).

Третья проблема - VirtualBox не захотел запускать никакую ОС с ошибкой на **KVM** (Full virtualization on i386 and amd64 hardware). Ну что нам делать? Правильно - избавится от ненужного, по моему мнению, KVM. Идем в синаптик и удаляем. Теперь может спокойно использовать VirtualBox. **Третьей проблемы нет.**

[![](http://leopard.in.ua/wp-content/uploads/2008/11/d181d0bdd0b8d0bcd0bed0ba-3-150x150.png "d181d0bdd0b8d0bcd0bed0ba-3")](http://leopard.in.ua/wp-content/uploads/2008/11/d181d0bdd0b8d0bcd0bed0ba-3.png)

Понятное дело некоторых программ нет (кстати список программ, что удален, был показан во время обновления). Ставим вручную.

В amaroK исчезла вся база музыкальная - пришлось пересоздать.

У меня, как разработчика, что юзает **Aptana**, возникла проблема с отображением браузера внутри IDE. Aptana для этого использовала движок Firefox-2, но тут от него оставили только зависимость. А с Firefox-3 работать не хочет - выбивает ошибку и пишет в логи типа того.

!MESSAGE No more handles (java.lang.UnsatisfiedLinkError: /home/leo/programs/run/aptana/configuration/org.eclipse.osgi/bundles/84/1/.cp/libswt-mozilla-gtk-3236.so: libxpcom.so: cannot open shared $!STACK 0org.eclipse.swt.SWTError: No more handles (java.lang.UnsatisfiedLinkError: /home/leo/programs/run/aptana/configuration/org.eclipse.osgi/bundles/84/1/.cp/libswt-mozilla-gtk-3236.so: libxpcom.so: ca$at org.eclipse.swt.SWT.error(SWT.java:3400)at org.eclipse.swt.SWT.error(SWT.java:3297)at org.eclipse.swt.browser.Browser.<init>(Browser.java:168)at com.aptana.ide.core.ui.browser.BaseBrowserAdapter.createControl(BaseBrowserAdapter.java:55)at com.aptana.ide.server.jetty.portal.PortalEditor.createPartControl(PortalEditor.java:373)at org.eclipse.ui.internal.EditorReference.createPartHelper(EditorReference.java:596)at org.eclipse.ui.internal.EditorReference.createPart(EditorReference.java:372)at org.eclipse.ui.internal.WorkbenchPartReference.getPart(WorkbenchPartReference.java:566)....И т.д. Ладно, есть же **xulrunner**. Ставим его если нет. Пришлось написать файлик runAptana.sh и запихнуть в него такое чудо#!/bin/bashexport MOZILLA_FIVE_HOME=/usr/lib/xulrunner/home/test/aptana/AptanaStudioТеперь запускаем Aptana этим файликом. Только путь /home/test/aptana/ поменяйте на свой - и будет вам счастье.Поставил себе Picasa (для просмотра и публикования фотографий). И тут тебе на - все квадратиками. Запустил его утилиту и выставил шрифты.[![](http://leopard.in.ua/wp-content/uploads/2008/11/d181d0bdd0b8d0bcd0bed0ba-4-150x150.png "d181d0bdd0b8d0bcd0bed0ba-4")](http://leopard.in.ua/wp-content/uploads/2008/11/d181d0bdd0b8d0bcd0bed0ba-4.png)Помогло, но вот только тексты теперь не отображаются (кнопки и остальное пустые). Оказалось wine, под которым запускается Picasa не хватает шрифта Tahoma. Скопировал его с Wine, который в системе был. Теперь все работает.Ну вот вроде основное. Интерфейс не сильно изменен, над юзабилити видно что старались, но не достарались в некоторых местах (как например с сетью). Вкладки наконец появились у файлового менеджера, интеграция рабочего стола с Pidgin и т.д.Ну это проблеммы, а вкусности и расписывать не нужно (думаю это и за меня сделали давно) - лучше их самому проверить. Ведь на фоне их, мои проблеммы - сущий пустяк. **Удачи в освоении Ubuntu.**
</init>
