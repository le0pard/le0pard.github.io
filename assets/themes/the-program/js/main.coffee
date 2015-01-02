LeoSite =
  repos: []
  recentlyUpdatedRepos: []
  reposInclude: [
    "mongodb_logger"
    "omniauth-yammer"
    "postgresql_book"
    "LibreOfficeCSVGenerator"
    "rwbox"
    "go-falcon"
    "my_little_nosql"
    "chef_book"
    "webp-ffi"
    "redis_pool"
    "pgtune"
    "sql-joins-app"
    "moscow_yammer2"]
  additionalProjects: [
      {
          "html_url": "https://github.com/railsware/piro",
          "owner": {
            "login": "railsware",
            "gravatar_id": "567813ae37032181ef4de2ba5900f07b",
            "url": "https://api.github.com/users/railsware",
            "avatar_url": "https://secure.gravatar.com/avatar/567813ae37032181ef4de2ba5900f07b?d=https://a248.e.akamai.net/assets.github.com%2Fimages%2Fgravatars%2Fgravatar-orgs.png",
            "id": 9354
          },
          "description": "PiRo - it's Rocket for you Pivotal Tracker account",
          "clone_url": "https://github.com/railsware/piro.git",
          "git_url": "git://github.com/railsware/piro.git",
          "has_wiki": true,
          "ssh_url": "git@github.com:railsware/piro.git",
          "watchers": 28,
          "forks_count": 6,
          "has_issues": true,
          "watchers_count": 28,
          "pushed_at": "2012-05-26T09:46:15Z",
          "forks": 6,
          "language": "CoffeeScript",
          "created_at": "2011-12-27T22:08:34Z",
          "open_issues": 1,
          "open_issues_count": 1,
          "mirror_url": null,
          "size": 264,
          "fork": false,
          "updated_at": "2012-07-27T20:52:39Z",
          "full_name": "railsware/piro",
          "name": "piro",
          "url": "https://api.github.com/repos/railsware/piro",
          "svn_url": "https://github.com/railsware/piro",
          "private": false,
          "id": 3059286,
          "has_downloads": true,
          "homepage": "piro.railsware.com"
        },
        {
            "html_url": "https://github.com/railsware/smt_rails",
            "owner": {
              "login": "railsware",
              "gravatar_id": "567813ae37032181ef4de2ba5900f07b",
              "url": "https://api.github.com/users/railsware",
              "avatar_url": "https://secure.gravatar.com/avatar/567813ae37032181ef4de2ba5900f07b?d=https://a248.e.akamai.net/assets.github.com%2Fimages%2Fgravatars%2Fgravatar-orgs.png",
              "id": 9354
            },
            "description": "Shared mustache templates for rails 3.",
            "clone_url": "https://github.com/railsware/smt_rails.git",
            "git_url": "git://github.com/railsware/smt_rails.git",
            "has_wiki": true,
            "ssh_url": "git@github.com:railsware/smt_rails.git",
            "watchers": 63,
            "forks_count": 7,
            "has_issues": true,
            "watchers_count": 63,
            "pushed_at": "2012-07-14T01:39:19Z",
            "forks": 7,
            "language": "Ruby",
            "created_at": "2012-04-10T17:32:53Z",
            "open_issues": 0,
            "open_issues_count": 0,
            "mirror_url": null,
            "size": 140,
            "fork": false,
            "updated_at": "2012-08-04T06:04:03Z",
            "full_name": "railsware/smt_rails",
            "name": "smt_rails",
            "url": "https://api.github.com/repos/railsware/smt_rails",
            "svn_url": "https://github.com/railsware/smt_rails",
            "private": false,
            "id": 3985037,
            "has_downloads": true,
            "homepage": "http://blog.railsware.com/2012/04/12/shared-mustache-templates-for-rails-3/"
          },
          {
              "html_url": "https://github.com/railsware/sht_rails",
              "owner": {
                "login": "railsware",
                "gravatar_id": "567813ae37032181ef4de2ba5900f07b",
                "url": "https://api.github.com/users/railsware",
                "avatar_url": "https://secure.gravatar.com/avatar/567813ae37032181ef4de2ba5900f07b?d=https://a248.e.akamai.net/assets.github.com%2Fimages%2Fgravatars%2Fgravatar-orgs.png",
                "id": 9354
              },
              "description": "Shared handlebars templates for Rails 3",
              "clone_url": "https://github.com/railsware/sht_rails.git",
              "git_url": "git://github.com/railsware/sht_rails.git",
              "has_wiki": true,
              "ssh_url": "git@github.com:railsware/sht_rails.git",
              "watchers": 16,
              "forks_count": 2,
              "has_issues": true,
              "watchers_count": 16,
              "pushed_at": "2012-05-21T11:54:11Z",
              "forks": 2,
              "language": "Ruby",
              "created_at": "2012-05-19T21:36:59Z",
              "open_issues": 0,
              "open_issues_count": 0,
              "mirror_url": null,
              "size": 192,
              "fork": false,
              "updated_at": "2012-08-04T05:36:26Z",
              "full_name": "railsware/sht_rails",
              "name": "sht_rails",
              "url": "https://api.github.com/repos/railsware/sht_rails",
              "svn_url": "https://github.com/railsware/sht_rails",
              "private": false,
              "id": 4381088,
              "has_downloads": true,
              "homepage": "http://blog.railsware.com/2012/05/21/shared-handlebars-templates-for-rails-3/"
            }
    ]
  init: ->
    $.getJSON "https://api.github.com/users/le0pard/repos?type=public&per_page=100&callback=?", (result) ->
      myRepos = result.data
      $ ->
        $.each myRepos, (i, repo) ->
          LeoSite.repos.push repo if repo.name and $.inArray(repo.name, LeoSite.reposInclude) isnt -1
        # Convert pushed_at to Date.
        repos = LeoSite.repos.concat(LeoSite.additionalProjects)
        $.each repos, (i, repo) ->
          repo.pushed_at = new Date(repo.pushed_at)
          weekHalfLife = 1.146 * Math.pow(10, -9)
          pushDelta = (new Date) - Date.parse(repo.pushed_at)
          createdDelta = (new Date) - Date.parse(repo.created_at)
          weightForPush = 1
          weightForWatchers = 1.314 * Math.pow(10, 7)
          repo.hotness = weightForPush * Math.pow(Math.E, -1 * weekHalfLife * pushDelta)
          repo.hotness += weightForWatchers * repo.watchers / createdDelta
        # Sort by highest # of watchers.
        repos.sort (a, b) ->
          return 1  if a.hotness < b.hotness
          return -1  if b.hotness < a.hotness
          0
        LeoSite.repos = repos
        # render all repos
        LeoSite.renderRepos()

  renderRepos: ->
    # repos
    reposContent = []
    repoTemplate = '<li class="repo grid-1 {{language_lower}}"><a href="{{html_url}}"><h2>{{name}}</h2><h3>{{language}}</h3><p>{{description}}</p></a></li>'
    $.each LeoSite.repos, (i, repo) ->
      repo.language_lower = repo.language.toLowerCase() if repo.language?
      reposContent.push Mustache.render(repoTemplate, repo)
    $("#repos").html(reposContent.join(""))

$ -> LeoSite.init() if $("#repos").length