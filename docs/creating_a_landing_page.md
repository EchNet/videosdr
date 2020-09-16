# Creating a VideoSDR Landing Page

## What you need to get started:

* A webpage editor that allows you to insert custom HTML elements into your page.

* A code snippet provided by VideoSDR.

## Follow these simple steps. 

### 1. Insert the code snippet into the *header* of your webpage

> :warning: If you were not issued a code snippet, please contact VideoSDR before continuing.

Your code snippet will look something like this:

```
<script src="https://s3.amazonaws.com/code.videosdr.com/videosdr-min.js" projectId="<<<-your-impossible-io-project-id->>>" movieName="<<<-your-impossible-io-movie-name->>>"></script>
```

### 2.  Insert the video element

Place the video element into the body of the page at the desired position for display.

At minimum, the video element must include the `id` and `controls` attributes as shown here:

```
<video id="my-video" controls="controls"></video>
```

You may also wish to add styling to your video element.  The following HTML fragment is provided as
a suggestion.  It centers the video within the page and limits its width to 640 pixels.

```
<div style="width: 100%; display: flex; justify-content: center;">
  <video id="my-video" controls="controls" style="max-width: 640px" width="100%"></video>
</div>
```

### 3.  Insert personalized text

You may insert personalized text anywhere in the page.  The text can include any of the 
field values associated with the contact the page is addressed to (e.g. name, company).

Personalized text must appear within an element having `class` attribute equal to videosdr-when-loaded, as shown below.

Field names within double braces {{ }} are replaced with the values that they reference.  See 
below.

```
<h1 class="videosdr-when-loaded">{{ first_name }}, I have an idea for {{ company }}!</h1>
```

You may create as many video-sdr-when-loaded elements as you like.

All videosdr-when-loaded elements are hidden until the personalized data is loaded into the 
page, so that partial text is not displayed.

Don't put videosdr-when-loaded elements inside other videosdr-when-loaded elements.

</body>
</html>
