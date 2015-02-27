---
title: Build a Blog with Middleman and Host on Github Pages
date: 2015-02-26 23:51 UTC
tags: ruby
published: false
---

# Build a Blog with Middleman and Host on Github Pages

For a long time I've been thinking about making the switch to a static site generator and have finally done it! I used Middleman to build this blog and I think that explaining how I built it would make for a great post. Let's get to it.

## Installing Middleman

In order to begin you need to have Ruby installed. If you are on a Mac, ruby should already be installed. If you are on Windows, you will need to install it. Getting Ruby set up is outside the scope of this tutorial so I won't be going through it. However, a quick google search will lead you to a lot of resources on how to do it.

Open your terminal and enter the following:

```
$ gem install middleman
```

While Middleman is great for static sites, I am using it for a blog so we will need to add the middleman-blog gem as well.

```
$ gem install middleman-blog
```

Before we can begin, you will need to setup a Github account. Go [here](https://github.com) and set up an account. You will next need to create a repository that github will recognize as a repository that you want to host on Github Pages. This next part is important. The name of your repository should have the following format:

 ```
 <account-name>.github.io
 ```

 My github username is ryanswapp so mine would be:

 ```
 ryanswapp.github.io
 ```

Once you have that set up it is time to begin. Make a directory wherever you want to store your blog and cd into it.

```
$ cd /path/to/your/middleman/directory
```

Our next step is to initialize the Middleman app and cd into the directory.

```
$ middleman init ryanswapp.github.io --template=blog
$ cd ryanswapp.github.io
```

Middleman will have created a gemfile for you and it should look something like this:

```ruby
source 'http://rubygems.org'

gem "middleman", "~> 3.3.9"
gem "middleman-blog", "~> 3.5.3"

# For feed.xml.builder
gem "builder", "~> 3.0"
```

Our next step is to bundle the gems:

```
$ bundle install
```

