var postsEl = $('#tumblr');

//get('info', blogInfo);

get('posts', postsIndex);

function get(resource, callback){
  $.ajax({
    type: 'get',
    url: 'http://api.tumblr.com/v2/blog/seattleio.tumblr.com/' + resource,
    dataType: 'jsonp',
    data: {
      api_key: 'GucczLgzlxYpKSfLcg79KqzbyYQA3QtubHJ9jYqh89r6IptwIt'
    },
    success: callback
  });
}

function blogInfo(data){
  console.log(data.response.blog)
}

function postsIndex(data){
  var posts = data.response.posts;
  var post = '';

  for (var i = 0; i < 5 && i < posts.length; i++){

    post = $('<div class="post"></div>').html('<a href="' + posts[i].post_url + '" target="_blank">');

    if (posts[i].title === undefined){
      if (posts[i].caption.length > 200) {
        var caption = posts[i].caption.substring(0, 200) + ' ...';
      } else {
        var caption = posts[i].caption;
      }
      $(post).children('a').append('<h3 class="post-title">' + caption + '</h3>');
    } else {
      $(post).children('a').append('<h3 class="post-title">' + posts[i].title + '</h3>');
    }
    
    $(postsEl).append(post);
  }
}