# jekyll starterkit
> example of a jekyll implementation.

## Unique designs for posts and static pages
You can include custom css and js files by adding the following to the yaml front matter of a post or static page:
```yaml
slug: slug-of-post
custom:  
  css: true  
  js: true
```

You'll need a css file at ```/post-assets/slug-of-post/style.css```.
And a js file at ```/post-assets/slug-of-post/index.js```.

You can generate these custom files with:
```
rake jekyll:custom slug-of-post
```

## layouts
### default.html

### article.html


## includes
### main menu

### sidebar

### custom css and js files

### google analytics


## feeds

### rss
    yoururl/rss.xml

### jsonp
    yoururl/posts.json

Example of getting at the jsonp feed of posts using jquery:

```javascript
$.ajax({
  url: 'http://localhost:4000/posts.json',
  dataType: 'jsonp',
}).done( posts );

function posts(res){
  res.posts.pop(res.posts.length);
  var posts = res.posts;
  posts.forEach(function(post, id){
    console.log(id, post);
  });
}
```