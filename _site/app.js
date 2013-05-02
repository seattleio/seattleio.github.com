var idx = lunr(function () {
  this.field('title', { boost: 10 });
  this.field('tags', { boost: 100 });
  this.field('content');
});

var huh;
$.getJSON("/posts.json", function(data){
  console.time("posts");
  data.pop();

  $.each(data, function(i, post){
    idx.add(post);
    console.log(post)
    huh = idx.search("pizza");
  });
  
  $.each(huh, function(i, item){
    console.log(item.ref, item.score)
  });
  console.timeEnd("posts");
});
