(function(getVideoParamsUrl, projectId, movieName, videoElementId) {
  function playVideo(videoParams) {
    var player = fxplayer(videoElementId, {format: "hls"});
    player.projectid = projectId;
    player.movie = movieName;
    player.params = videoParams;
    player.play();
  }
  var url = new URL(window.location.href);
  var key = url.searchParams.get("key");
  if (key) {
    var request = new XMLHttpRequest();
    request.open("GET", getVideoParamsUrl + "?key=" + key);
    request.send();
    request.onload = function() {
      if (request.status == 200) {
        var data = JSON.parse(request.response);
        if (data.Items && data.Items.length) {
          playVideo(data.Items[0]);
        }
      }
    }
  }
  else {
    playVideo({
      first_name: url.searchParams.get("first_name") || "",
      company: url.searchParams.get("company") || "",
      city: url.searchParams.get("city") || "",
      screenshot: url.searchParams.get("screenshot") || ""
    });
    history.replaceState("", "", location.origin + location.pathname);
  }
})(
  "https://almqm0z6kf.execute-api.us-east-1.amazonaws.com/live/getvideoparams",
  "76a79067-e3df-4acc-9fbc-2cddf8f19740",
  "final_product_demo",
  "my-video"
);
