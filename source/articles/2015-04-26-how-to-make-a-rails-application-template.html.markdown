---
title: How to Make a Rails Application Template
date: 2015-04-26 16:23 UTC
tags: ruby
---

# How to Make a Rails Application Template

Rails application templates are a beautiful thing. They serve one purpose: making your life easier. Anyone who has been building Rails applications for a short amount of time surely has wished that they could speed up the process of starting a new project. Now you can! With Rails application templates you can run one command and start with a project that is filled with all the gems, files, and code that you could ever want. Let me give you an example. Lets say we have a template called bootstrap.rb that starts a new project and adds bootstrap styling, a bootstrap menu, and other features. Here is how we would use this template if it was hosted on my website:

```
rails new blog -m http://ryanswapp.com/bootstrap.rb
```

As you can see, in addition to the default ```rails new app_name``` command I added the -m flag followed by the location of the template. Once you hit enter, any setup tasks that your file has declared will be run and you will be sitting pretty. I love using rails application templates for test apps because I can load it full of awesome stuff (bootstrap) in one command and not have to waste time I don't have making a test app less ugly.

Now that we know how to use a template, let’s build one!

## Building a Rails Application Template

Rails templates use the Thor library (a toolkit for building command-line interfaces) to add/remove files and make changes to existing files. I will show you some of the basic features of Thor as we build this template.

As I stated before, we are going to create a template that will create a bootstrap starter app. In any directory on your computer, create a file called ```bootstrap.rb```. I placed my file here:

```
code/rails/application-templates/bootstrap.rb
```

The first thing we are going to do is add a few gems. This is quite easy to do:

```ruby
# Add bootstrap and autoprefixer gems

gem "bootstrap-sass"
gem "autoprefixer-rails"

# Add rails factor gem for heroku

gem_group :production do
  gem "rails_12factor"
end
```

As you can see, adding gems to an application template is almost the same as adding them to a Gemfile.

Next, we want our application template to install these gems. Add this after the previous code:

```
run "bundle install --without production"
```

You can run bash commands with the run command! I added “–without production” to the command because we don’t want the rails_12factor gem to be used in development.

Note: you don’t ever have to add “–without production” to bundle again after the first time you run the command. Rails will automatically do this for you.

Our next step is to remove the README.rdoc file and replace it with a markdown version:

```ruby
# Fix the README

remove_file "README.rdoc"

create_file 'README.md' do <<-TEXT
# Ya Bits

This is a simple rails app with bootstrap!
TEXT
end
```

Thor gives us the ```remove_file``` and ```create_file``` methods. When you create a new file with Thor, you can pass any text you want to a block as shown above.

We will now set our app up to use bootstrap. First, we need to remove the ```application.css``` file and create a new ```application.css.scss``` file. Like we saw before, I am using the ```create_file``` method to insert some text into the file. I’ve imported the bootstrap-sass files at the top and then threw in some CSS classes. Lastly, I add bootstrap to the ```application.js``` file with the ```insert_into_file``` method. This method has three parameters: (1) the file we want to insert something into; (2) the text we want to insert; and (3) where we want the text to be inserted. Notice that I am using a regular expression to find the ```require_tree .``` directive in the ```application.js``` file. Thor provides the ```:before``` and ```:after``` helpers to allow you to choose whether the text is inserted before or after the text in the regular expression.

```ruby
# Begin adding bootstrap to application

remove_file 'app/assets/stylesheets/application.css'

create_file 'app/assets/stylesheets/application.css.scss' do <<-TEXT
  @import "bootstrap";
  @import "bootstrap-sprockets";


  body {
    padding-top: 50px;
  }

  // Helper classes

  .center {
    text-align: center;
  }

TEXT
end

insert_into_file('app/assets/javascripts/application.js', "//= require bootstrap-sprockets\n", :before => /\/\/= require_tree ./)
```

Now we will use the rails generator to create a Pages controller with a home action. We remove the ```home.html.erb``` file and then create a brand new one so we can start fresh. I’ve added a simple bootstrap jumbotron to the home file. Lastly, we make the home page the root path.

```ruby
# Create a home page

generate(:controller, "pages home")

remove_file 'app/views/pages/home.html.erb'

create_file 'app/views/pages/home.html.erb' do <<-TEXT
<div class="jumbotron center">
  <h1>Ya Bits!</h1>
  <p>Thanks for using the bootstrap application template.</p>

</div>
TEXT
end

# Make the home page the uh... home page?

route "root 'pages#home'"
```

I like to start off with a basic bootstrap menu when I’m building starter applications so lets add that as well. We will create a header partial and then insert it into ```application.html.erb```.

```ruby
# Add bootstrap navigation

create_file 'app/views/layouts/_header.html.erb' do <<-TEXT
<nav class="navbar navbar-default navbar-fixed-top" role="navigation">
  <div class="container-fluid">
    <!-- Brand and toggle get grouped for better mobile display -->
    <div class="navbar-header">
      <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
      <%= link_to 'Ya Bits', root_path, class: 'navbar-brand' %>
    </div>

    <!-- Collect the nav links, forms, and other content for toggling -->
    <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
      <ul class="nav navbar-nav navbar-right">
        <li class="<%= 'active' if current_page?(root_path) %>"><%= link_to 'Home', root_path %></li>
      </ul>
    </div>
  </div>
</nav>

TEXT
end

insert_into_file 'app/views/layouts/application.html.erb', "<%= render 'layouts/header' %>\n", :after => /<body>/
```

Ok! We are nearing the end. Let’s also insert the HTML5 Shim and meta tags that bootstrap likes.

```ruby
# Add meta tags and html5 shim

insert_into_file 'app/views/layouts/application.html.erb', :after => /<%= csrf_meta_tags %>/ do <<-TEXT
  <meta charset='utf-8'>
  <meta http-equiv='X-UA-Compatible' content='IE=edge'>
  <meta name='viewport' content='width=device-width, initial-scale=1'>
  <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
  <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
  <!--[if lt IE 9]>
  <script src='https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js'></script>
  <script src='https://oss.maxcdn.com/respond/1.4.2/respond.min.js'></script>
  <![endif]-->
TEXT
end
```

As you can see, the ```insert_into_file``` method also takes a block into which we can add any text that we’d like. The last thing that we need to do is add this new application to git. I use Rubymine and need to add ```.idea/``` to the ```.gitignore``` file so that Rubymine’s files don’t mess with git. In addition, I tell rake to create a new database for me because I generally use postgresql.

```ruby
# I use postgresql most of the time so this will create the database for me

rake("db:create")

# Add rubymine files to gitignore

insert_into_file '.gitignore', :after => /\/tmp/ do <<-TEXT

# Ignore Rubymine files
.idea/

TEXT
end

# Commit that ish to git

run "git init"
run "git add -A && git commit -m 'Initial Commit'"
```

That’s it folks! Feel free to check out the [Thor](http://www.rubydoc.info/github/erikhuda/thor/master/Thor/Actions#insert_into_file-instance_method) documentation as there are many more things you can use it for. In addition, the [edge guides](http://edgeguides.rubyonrails.org/rails_application_templates.html) can be helpful as well.

If you have any questions please feel free to leave me a comment! The github repository for this file is here.
