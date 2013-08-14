var postsEl = $('#tumblr');

//get('info', blogInfo);

get('posts', postsIndex);


function blogInfo(data){
  console.log(data.response.blog)
}

function postsIndex(data){
  var posts = data.response.posts;
  var post = '';

  for (var i = 0; i < 5 && i < posts.length; i++){

    var post_date = moment(posts[i].date, 'YYYY-MM-DD HH:mm:ss Z');

    var post_html = '<a href="' + posts[i].post_url + '" target="_blank">';
    post_html += '<p class="post-date">' + post_date.format("MMMM Do YYYY, h:mm a") + '</p>';

    post = $('<div class="post"></div>').html(post_html);

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

function get(resource, callback){
  $.ajax({
    type: 'get',
    url: 'http://api.tumblr.com/v2/blog/seattleio.tumblr.com/' + resource,
    dataType: 'jsonp',
    data: {
      tag: 'featured',
      api_key: 'GucczLgzlxYpKSfLcg79KqzbyYQA3QtubHJ9jYqh89r6IptwIt'
    },
    success: callback
  });
}