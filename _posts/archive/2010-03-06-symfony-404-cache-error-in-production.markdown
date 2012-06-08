---
layout: post
title: symfony 404 cache error in production
wordpress_id: 966
wordpress_url: http://leopard.in.ua/?p=966
categories:
- Новости
- PHP
tags:
- PHP
---
Да-да-да! На столько непонятный заголовок. Все очень просто. Есть такой популярный PHP фреймворк - [Symfony](http://www.symfony-project.org/). Все в нем хорошо, вот только недавно обнаружилась одна плохая бага: при включенном кешировании (а именно использовании contextual параметра в кеше) на продакшене при попытке вызова 404 сайт просто вываливается с ошибкой, примерно с такой:<pre lang="bash">PHP Fatal error: Uncaught exception 'sfException' with message 'A cache key must contain both a module and an action parameter' in /var/www/clients/client2/web6/lib/vendor/symfony/lib/view/sfViewCacheManager.class.php:246#012Stack trace:#012#0 /var/www/clients/client2/web6/lib/vendor/symfony/lib/view/sfViewCacheManager.class.php(145): sfViewCacheManager-&gt;convertParametersToKey(Array)#012#1 /var/www/clients/client2/web6/lib/vendor/symfony/lib/view/sfViewCacheManager.class.php(478)</pre>Проблема решается просто. При создании ключа для contextual кеша используется модель и экшен текущей страницы. А на при попытке вызова несуществующей страницы требуется указать, что модель и экшен брать для 404 страницы. А вот и сам фикс:<pre lang="php">Index: lib/view/sfViewCacheManager.class.php===================================================================--- lib/view/sfViewCacheManager.class.php       (revision 28275)+++ lib/view/sfViewCacheManager.class.php       (working copy)@@ -142,6 +142,10 @@       if (!$contextualPrefix)       {         list($route_name, $params) = $this-&gt;controller-&gt;convertUrlStringToParameters($this-&gt;routing-&gt;getCurrentInternalUri());+       if(!isset($params['module']) || !isset($params['action'])){+               $params['module'] = sfConfig::get('sf_error_404_module');+               $params['action'] = sfConfig::get('sf_error_404_action');+       }         $cacheKey = $this-&gt;convertParametersToKey($params);       }       else</pre>Вот и все. Теперь 404 будет работать и на продакшене. [Тикет на symfony trac.](http://trac.symfony-project.org/ticket/8339)
