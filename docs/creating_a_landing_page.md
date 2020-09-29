# Creating a VideoSDR Landing Page

## What you need to get started:

* A webpage editor that allows you to insert custom HTML elements into your page.

* A code snippet provided by VideoSDR.

## Follow these simple steps. 

### 1. Insert the code snippet into the header of your webpage

> :warning: If you were not issued a code snippet, please contact VideoSDR before continuing.

Your code snippet will look something like this:

```
<script src="https://s3.amazonaws.com/code.videosdr.com/videosdr-min.js?projectId=XXXX&movieName=YYYY"></script>
```

### 2.  Insert the video content into the body of your webpage.

Use following HTML fragment as a starting point.  It centers the video within the page and limits its width to 640 pixels.  It places a personalized title above the image.  Place this fragment into the body of the page at the desired position for display.

```
<h1 class="videosdr-when-loaded" style="visibility:hidden;text-align:center">{{ first_name }}, I have an idea for {{ company }}!</h1>
<div style="width: 100%; display: flex; justify-content: center;">
  <video id="my-video" controls="controls" style="max-width: 640px" width="100%"></video>
</div>
```

If you wish to customize this content, see below for Advanced Options.

## Advanced Options

### Options for the video element.

At minimum, the video element must include the `id` and `controls` attributes as shown here:

```
<video id="my-video" controls="controls"></video>
```

It is also recommended that you maximize the width of the video but limit it for larger screens.  The following fragment maximizes the width and places a limit of 640 pixels on it. 

Do not specify a height for the image.  Instead let the video be displayed at its original aspect ratio.

```
<div style="width: 100%; display: flex; justify-content: center;">
  <video id="my-video" controls="controls" style="max-width: 640px" width="100%"></video>
</div>
```

### Options for personalized text.

You may create personalized text anywhere in the page.  The text can include any of the 
field values associated with the contact the page is addressed to (e.g. first_name, company).
Field names within double braces {{ }} are replaced with the values that they reference. 

Personalized text must appear within an element having `class` attribute equal to videosdr-when-loaded, as shown below.  It is also recommended that you hide the element initially using a style attribute, as shown below. videosdr-when-loaded elements are automatically unhidden when the personalized data is ready.

```
<h1 class="videosdr-when-loaded" style="visibility: hidden">Hi {{ first_name }}!</h1>
```

You may create as many video-sdr-when-loaded elements as you like.
page, so that partial text is not displayed.

Don't put videosdr-when-loaded elements inside other videosdr-when-loaded elements.

</body>
</html>
