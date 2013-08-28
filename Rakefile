task :default => [:"jekyll:runserver"]

namespace :jekyll do
  desc "run local server"
  task :runserver do
    system('browserify game/game.js -o game-bundle.js')
    system('jekyll serve --watch')
  end
end