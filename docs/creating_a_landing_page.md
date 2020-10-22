# Creating a VideoSDR Landing Page

## What you need to get started:

* A webpage editor that allows you to insert custom HTML elements into your page.

## Follow these simple steps. 

### 1. Insert the code snippet into the header of your webpage

Your code snippet will be formed something like the following sample:

```
<script src="https://s3.amazonaws.com/code.videosdr.com/videosdr-min.js?projectId=myproject&movieName=mymovie&format=dash"></script>
```

In this sample, `projectId` , `movieName` and `format` are query parameters, and the values of those
query parameters are `myproject` , `mymovie` and `dash` , respectively.

A full list of available query parameters and their values is below.

| Name | Description | Example |
| ---- | ----------- | ------- |
|projectId|The ImpossibleFX project ID|ab892-83860a-002788fc|
|movieName|The ImpossibleFX movie name|OutreachCampaign1|
|format|The desired video format|hls, dash, mp4|
|videoElementId|The ID of the <video> element in the HTML page.|my-video|

### 2.  Insert the video content into the body of your webpage.

Use following HTML fragment as a starting point.  It centers the video within the page and limits its width to 640 pixels.  It places a personalized title above the image.  Place this fragment into the body of the page at the desired position for display.

```
<h1 class="videosdr-when-loaded" style="visibility:hidden;text-align:center">{{{ first_name }}}, I have an idea for {{{ company }}}!</h1>
<div style="width: 100%; display: flex; justify-content: center;">
  <video id="my-video" poster="https://s3.amazonaws.com/assets.vidvoy.com/loading-bar.gif" style="max-width: 640px" width="100%"></video>
</div>
```

If you wish to customize this content, see below for Advanced Options.

## Advanced Options

### Options for the video element.

At minimum, the video element must include the `id` attribute as shown here:

```
<video id="my-video"></video>
```

#### Sizing

It is also recommended that you maximize the width of the video but limit it for larger screens.  The following fragment maximizes the width and places a limit of 640 pixels on it. 

Do not specify a height for the image.  Instead let the video be displayed at its original aspect ratio.

```
<div style="width: 100%; display: flex; justify-content: center;">
  <video id="my-video" style="max-width: 640px" width="100%"></video>
</div>
```

#### Placeholder

Some time will pass between when the page loads and when the first frame of the video is loaded.
During this time, it is better to show a "loading" animation image than the default black box.
Use the "poster" attribute of the video element to refer to your placeholder image as shown below. 
We provide `https://s3.amazonaws.com/assets.vidvoy.com/loading-bar.gif` as a convenience but you
may use your own image.

```
<video id="my-video" poster="https://s3.amazonaws.com/assets.vidvoy.com/loading-bar.gif"></video>
```

### Options for personalized text.

You may create personalized text anywhere in the page.  The text can include any of the 
field values associated with the contact the page is addressed to (e.g. first_name, company).
Field names within triple braces {{{ }}} are replaced with the values that they reference. 

Personalized text must appear within an element having `class` attribute equal to videosdr-when-loaded, as shown below.  It is also recommended that you hide the element initially using a style attribute, as shown below. videosdr-when-loaded elements are automatically unhidden when the personalized data is ready.

```
<h1 class="videosdr-when-loaded" style="visibility: hidden">Hi {{{ first_name }}}!</h1>
```

You may create as many `video-sdr-when-loaded` elements as you like.

Don't put videosdr-when-loaded elements inside other videosdr-when-loaded elements.

</body>
</html>
