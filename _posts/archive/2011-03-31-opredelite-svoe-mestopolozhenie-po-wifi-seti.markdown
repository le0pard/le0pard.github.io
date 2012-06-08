---
layout: post
title: Определите свое местоположение по WiFi сети
wordpress_id: 1174
wordpress_url: http://leopard.in.ua/?p=1174
categories:
- Linux
- разработка
- интересно
tags:
- Linux
- разработка
- интересно
---
Простой скрипт. Определяет местоположение. Вы должны работать через Wifi.``iwlist wlan0 scan | sed -n 's/.* Address: //p;T;s/ //g;q' |sed 's/.*/{version:1.1.0,host:maps.google.com,request_address:true,address_language:'${LANG/.*/}',wifi_towers:[{mac_address:"&amp;",signal_strength:8,age:0}]}/' |curl -sX POST -d @- www.google.com/loc/json |sed -e 'h;s/.*latitude":\([^,]*\).*/\1/;G;s/\n[^\n]*longitude":\([^,]*\).*/,\1\n/;s|^|http://maps.google.com/maps?q=|;x;s/[,{]/\n/g;s/["}]//g;s/:/\t/g;s/\n//;G'``Вот gist: [https://gist.github.com/897131](https://gist.github.com/897131)Не забудьте поставить curl.Как это работает? Google собирает информацию о том, где расположены какие точки доступа (по MAC).Первая часть (iwlist wlan0 scan | sed -n 's/.* Address: //p;T;s/ //g;q' ) — это просто определение мака.
