---
title: Build a Blog with Middleman and Host on Github Pages
date: 2015-02-26 23:51 UTC
tags: ruby
---

# Build a Blog with Middleman and Host on Github Pages

For a long time I've been thinking about making the switch to a static site generator and have finally done it! I used Middleman to build this blog and I think that explaining how I built it would make for a great post. Let's get to it.

READMORE

## Installing Middleman

In order to begin you need to have Ruby installed. If you are on a Mac, ruby should already be installed. If you are on Windows, you will need to install it. Getting Ruby set up is outside the scope of this tutorial so I won't be going over it. However, a quick google search will lead you to a lot of resources on how to do it.

Open your terminal and enter the following:

```
$ gem install middleman
```

While Middleman is great for static sites, I am using it for a blog so we will need to add the middleman-blog gem as well.

```
$ gem install middleman-blog
```

Before we can begin, you will need to setup a Github account if you have not done so already. Go [here](https://github.com) and set up an account. You will next need to create a repository that Github will recognize as the repository that has the files you want to host on Github Pages. This next part is important. The name of your repository should have the following format:

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

I used the ```--template=blog``` argument so that the middleman generator would scaffold our project specifically for a blog. The template comes from the middleman-blog gem we added earlier.

Middleman will have created a Gemfile for you and it should look something like this:

```ruby
source 'http://rubygems.org'

gem "middleman", "~> 3.3.9"
gem "middleman-blog", "~> 3.5.3"

# For feed.xml.builder
gem "builder", "~> 3.0"
```

At this point you should now have a minimal blog built with Middleman! Let's get the server running so we can check it out.

```
$ middleman server
```

Go to ```http://localhost:4567``` in your browser and you should see your new blog.

## Adding Livereload and Other Features

When you set up your middleman blog there are a number of features that you will likely want to add. Let's add a few of them.

### Livereload

Livereload is one of my favorite features. It allows you to make changes to your code and then (assuming your server is running) see instant changes in the browser without having to refresh the page.

Our first step is to add the middleman-livereload gem to our Gemfile:

```ruby
# If you have OpenSSL installed, we recommend updating
# the following line to use "https"
source 'http://rubygems.org'

gem "middleman", "~> 3.3.9"
gem "middleman-blog", "~> 3.5.3"
gem "middleman-livereload", "~> 3.3.0"

# For feed.xml.builder
gem "builder", "~> 3.0"
```

Now run bundle install to add the gem to your project:

```
$ bundle install
```

The next thing we have to do is activate Livereload in our ```config.rb``` file. If you scroll down to the bottom of config.rb you will see the Livereload option commented out. Uncomment it.

```ruby
# Reload the browser automatically whenever files change
activate :livereload
```

If your server is still running, stop it and then restart it. Go to ```http://localhost:4567``` in your browser and keep the tab open. Next, go into your editor and delete the example markdown article. Once you do, your browser should refresh and the blog will be completely empty. Keep your server running and open a new tab in your terminal. Now run the following command:

```
$ middleman article "Test Post"
```

If you were watching your browser window you'll notice that the new test post was just added to the list of posts. Pretty neat eh?

Notice how I used the ```middleman article <article-name>``` command to create an article. This is how you create new blog posts in Middleman.

### Middleman Deploy

The middleman-deploy gem allows us to easily deploy our static site to Github Pages or anywhere else we'd like to host the files. I will show you how to set up deployment to Github pages.

Our first task is to add the gem to our Gemfile:

```ruby
# If you have OpenSSL installed, we recommend updating
# the following line to use "https"
source 'http://rubygems.org'

gem "middleman", "~> 3.3.9"
gem "middleman-blog", "~> 3.5.3"
gem "middleman-deploy", "~> 1.0"
gem "middleman-livereload", "~> 3.3.0"

# For feed.xml.builder
gem "builder", "~> 3.0"
```

Next run bundle install:

```
$ bundle install
```

#### Configurations

As we saw before, you configure your app features in ```config.rb```. This is where you configure all of your Middleman extensions. We've added the Livereload extension already, but we still need to configure Middleman Deploy. Open up your config.rb file and add the middleman-deploy configuration just below the ```:blog``` configuration:

```ruby
activate :blog do |blog|
  # This will add a prefix to all links, template references and source paths
  # blog.prefix = "blog"

  # blog.permalink = "{year}/{month}/{day}/{title}.html"
  # Matcher for blog source files
  # blog.sources = "articles/{year}-{month}-{day}-{title}.html"
  # blog.taglink = "tags/{tag}.html"
  # blog.layout = "layouts/blog"
  # blog.summary_separator = /(READMORE)/
  # blog.summary_length = 250
  # blog.year_link = "{year}.html"
  # blog.month_link = "{year}/{month}.html"
  # blog.day_link = "{year}/{month}/{day}.html"
  # blog.default_extension = ".markdown"
  # blog.new_article_template = "layouts/post"

  blog.tag_template = "tag.html"
  blog.calendar_template = "calendar.html"

  # Enable pagination
  # blog.paginate = true
  # blog.per_page = 10
  # blog.page_link = "page/{num}"
end

activate :deploy do |deploy|
  deploy.method = :git
  deploy.branch = 'master'
  deploy.build_before = true
end

activate :directory_indexes
```

We've activated both the ```:deploy``` extension and the ```:directory_indexes``` extension.

##### Set Up Git

Before we can continue, we first need to initialize a git repository. In your terminal run the following command.

```
$ git init
```

We need to set up git so that we can create two different branches to work with: Master and Source. Middleman Deploy will put our static files in the Master branch for us so we don't want to develop in that branch. We will do all of our development in the Source branch and then deploy to the master branch. Let's create the Source branch and push to Github.

```
$ git checkout -b source
$ git add -A
$ git commit -m "Initial commit"
```

At this point we need to add the git remote for our github repository that we created earlier. You do this by running a command with the following format:

```
$ git remote add origin https://github.com/<username>/<username>.github.io.git
```

My username is ryanswapp so I add my remote by running the following command:

```
$ git remote add origin https://github.com/ryanswapp/ryanswapp.github.io.git
```

Once the remote has been added we can push our source files to a Source branch on Github with this command:

```
$ git push --set-upstream origin source
```

Check your github repository that you created and your source files should all be there. Our next step is to deploy!

```
$ middleman deploy
```

Point your browser to ```<username>.github.io``` and you should see that your new blog is live. Mine is located at ```ryanswapp.github.io```. Congratulations, you now have a blog powered by Middleman!

### Article Summaries

Currently, if you post an article the entire post will be listed on the home page. I prefer that just a summary be available on the home page so I will show you how to do that. We first need to add the nokogiri gem to our Gemfile:

```ruby
# If you have OpenSSL installed, we recommend updating
# the following line to use "https"
source 'http://rubygems.org'

gem "middleman", "~> 3.3.9"
gem "middleman-blog", "~> 3.5.3"
gem "middleman-deploy", "~> 1.0"
gem "middleman-livereload", "~> 3.3.0"
gem "nokogiri"

# For feed.xml.builder
gem "builder", "~> 3.0"
```

Now run bundle install to add the gem to our project:

```
$ bundle install
```

We next need to use the summary method in our ```index.html.erb``` file that is in the source directory.

```ruby

# The rest of the file has been omitted for brevity

<% page_articles.each_with_index do |article, i| %>
  <h2><%= link_to article.title, article %> <span><%= article.date.strftime('%b %e') %></span></h2>
  <!-- use article.summary(250) if you have Nokogiri available to show just
       the first 250 characters -->
  <%= article.summary(250) %>
<% end %>

<% if paginate %>
  <% if next_page %>
    <p><%= link_to 'Next page', next_page %></p>
  <% end %>
<% end %>
```

If your server is running you should now see that the home page only lists a 250 character summary of your post.

### Middleman Helpers

Another useful feature of Middleman is that you can add helper methods to customize its functionality. You can declare these helper methods in ```config.rb```. Towards the bottom of the page you should see something similar to this:

```ruby
# Methods defined in the helpers block are available in templates
# helpers do
#   def some_helper
#     "Helping"
#   end
# end
```

 When I first created a blog with Middleman I noticed that the summary of each blog post on the home page displayed the ```h1``` tags in my article. We obviously don't want to display the title twice (link and ```h1```) so lets create a helper to remove the title from the summary. Replace the helper section in your ```config.rb``` file with the following:

 ```ruby
 # Methods defined in the helpers block are available in templates
 helpers do
   def strip_summary(html)
     html.gsub(/<h1.?>.+<\/h1>/, "")
   end
 end
 ```

 We have created a ```strip_summary``` helper method that will remove the ```h1``` from our home page summaries. Now we need to include it in our ```index.html.erb``` file:

```ruby
<% page_articles.each_with_index do |article, i| %>
  <h2 class="article-link"><%= link_to article.title, article %> <span><%= article.date.strftime('%b %e') %></span></h2>
  <!-- use article.summary(250) if you have Nokogiri available to show just
       the first 250 characters -->
  <%= strip_summary article.summary(250) %>
<% end %>

<% if paginate %>
  <% if next_page %>
    <p><%= link_to 'Next page', next_page %></p>
  <% end %>
<% end %>
```

If you still have your server running you will see that the title no longer shows up in your summary. Success!

### Syntax Highlighting

I assume that anyone reading this blog post is a programmer so you will likely want to support syntax highlighting in your blog posts. We will set this up by first adding the redcarpet and middleman-syntax gems:

```ruby
# If you have OpenSSL installed, we recommend updating
# the following line to use "https"
source 'http://rubygems.org'

gem "middleman", "~> 3.3.9"
gem "middleman-blog", "~> 3.5.3"
gem "middleman-deploy", "~> 1.0"
gem "middleman-livereload", "~> 3.3.0"
gem "middleman-syntax"
gem "redcarpet"
gem "nokogiri"

# For feed.xml.builder
gem "builder", "~> 3.0"
```

Run bundle install to add the gems to your project:

```
$ bundle install
```

Now we need to activate the gems in our ```config.rb``` file. Place the following code underneath your ```:deploy``` configuration:

```ruby
activate :deploy do |deploy|
  deploy.method = :git
  deploy.branch = 'master'
  deploy.build_before = true
end

activate :directory_indexes

activate :syntax, :line_numbers => true
set :markdown_engine, :redcarpet
set :markdown, :fenced_code_blocks => true, :smartypants => true
```

In this code we are turning on line numbers in our code blocks and setting the markdown engine to redcarpet. In addition, you may have noticed that our helper broke. The ```h1``` of our posts is now showing in the summary. This is because redcarpet does not add html attributes to elements like the default markdown engine and our regular expression won't catch regular elements. To fix it we need to make the regular expression more basic. Change the helper to:

```ruby
# Methods defined in the helpers block are available in templates
helpers do
  def strip_summary(html)
    html.gsub(/<h1>.+<\/h1>/, "")
  end
end
```

Now the summary should be fine. At this point you can add code to a post like so:

    ```ruby
    def cool
      puts "I'm cool"
    end
    ```

The code is pretty ugly... Let's add some styling so it doesn't look so bad. Create a ```base.css.scss``` file in your ```source/stylesheets/``` directory. Copy and paste the following styles into that file:

```css
// Syntax Highlighting
//.highlight { background-color: rgba(240,240,240,.5) }
.c { color: #999988; font-style: italic } /* Comment */
.err { color: #a61717; background-color: #e3d2d2 } /* Error */
.k { color: #000000; font-weight: bold } /* Keyword */
.o { color: #000000; font-weight: bold } /* Operator */
.cm { color: #999988; font-style: italic } /* Comment.Multiline */
.cp { color: #999999; font-weight: bold; font-style: italic } /* Comment.Preproc */
.c1 { color: #999988; font-style: italic } /* Comment.Single */
.cs { color: #999999; font-weight: bold; font-style: italic } /* Comment.Special */
.gd { color: #000000; background-color: #ffdddd } /* Generic.Deleted */
.ge { color: #000000; font-style: italic } /* Generic.Emph */
.gr { color: #aa0000 } /* Generic.Error */
.gh { color: #999999 } /* Generic.Heading */
.gi { color: #000000; background-color: #ddffdd } /* Generic.Inserted */
.go { color: #888888 } /* Generic.Output */
.gp { color: #555555 } /* Generic.Prompt */
.gs { font-weight: bold } /* Generic.Strong */
.gu { color: #aaaaaa } /* Generic.Subheading */
.gt { color: #aa0000 } /* Generic.Traceback */
.kc { color: #000000; font-weight: bold } /* Keyword.Constant */
.kd { color: #000000; font-weight: bold } /* Keyword.Declaration */
.kn { color: #000000; font-weight: bold } /* Keyword.Namespace */
.kp { color: #000000; font-weight: bold } /* Keyword.Pseudo */
.kr { color: #000000; font-weight: bold } /* Keyword.Reserved */
.kt { color: #445588; font-weight: bold } /* Keyword.Type */
.m { color: #009999 } /* Literal.Number */
.s { color: #d01040 } /* Literal.String */
.na { color: #008080 } /* Name.Attribute */
.nb { color: #0086B3 } /* Name.Builtin */
.nc { color: #445588; font-weight: bold } /* Name.Class */
.no { color: #008080 } /* Name.Constant */
.nd { color: #3c5d5d; font-weight: bold } /* Name.Decorator */
.ni { color: #800080 } /* Name.Entity */
.ne { color: #990000; font-weight: bold } /* Name.Exception */
.nf { color: #990000; font-weight: bold } /* Name.Function */
.nl { color: #990000; font-weight: bold } /* Name.Label */
.nn { color: #555555 } /* Name.Namespace */
.nt { color: #000080 } /* Name.Tag */
.nv { color: #008080 } /* Name.Variable */
.ow { color: #000000; font-weight: bold } /* Operator.Word */
.w { color: #bbbbbb } /* Text.Whitespace */
.mf { color: #009999 } /* Literal.Number.Float */
.mh { color: #009999 } /* Literal.Number.Hex */
.mi { color: #009999 } /* Literal.Number.Integer */
.mo { color: #009999 } /* Literal.Number.Oct */
.sb { color: #d01040 } /* Literal.String.Backtick */
.sc { color: #d01040 } /* Literal.String.Char */
.sd { color: #d01040 } /* Literal.String.Doc */
.s2 { color: #d01040 } /* Literal.String.Double */
.se { color: #d01040 } /* Literal.String.Escape */
.sh { color: #d01040 } /* Literal.String.Heredoc */
.si { color: #d01040 } /* Literal.String.Interpol */
.sx { color: #d01040 } /* Literal.String.Other */
.sr { color: #009926 } /* Literal.String.Regex */
.s1 { color: #d01040 } /* Literal.String.Single */
.ss { color: #990073 } /* Literal.String.Symbol */
.bp { color: #999999 } /* Name.Builtin.Pseudo */
.vc { color: #008080 } /* Name.Variable.Class */
.vg { color: #008080 } /* Name.Variable.Global */
.vi { color: #008080 } /* Name.Variable.Instance */
.il { color: #009999 } /* Literal.Number.Integer.Long */

.highlight {
  margin-bottom: 25px;
}

.highlight pre {
  color: #999;
  font-size: 16px;
  padding: 0 12px;
  line-height: 28px;
  margin-bottom: 30px;
  white-space: pre;
  overflow-x: auto;
  word-break: inherit;
  word-wrap: inherit;
}

.highlight table {
  width: 100%;
  table-layout: fixed;
}
.highlight td {
  padding: 0;
}

.highlight tr {
  border: solid 1px #ddd;
}
.highlight .gutter {
  width: 50px;
}

.gl {
  background: #fafafa;
  border-right: 1px solid #ddd;
  color: #999;

  /* Stop line numbers being visually selected */
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
```

Now add the following code to the head section of your ```layout.erb``` file:

```
<%= stylesheet_link_tag 'base' %>
```

This is how you link to a stylesheet in erb. Now your code should look just like mine!

Let's push our code to Github and deploy our new changes:

```
$ git add -A
$ git commit -m "Added livereload, helpers, and syntax highlighting"
$ git push --set-upstream origin source
$ middleman deploy
```

## Conclusion

You should now have a Middleman blog up and running and all that is left to do is add some styling. I recommend trying out the excellent [Skeleton CSS](http://getskeleton.com/) boilerplate. It is lightweight and adds some simple styles as well as a grid. I have moved away from using Bootstrap and Foundation because of the bloat that comes with them. Skeleton is now my go-to boilerplate code.

If you have any questions please feel free to leave them in the comments. In addition, if you'd like me to add anything else to the tutorial please leave a comment or send an email to ryan@swapp.sexy. Thanks!
