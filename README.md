# NativeScript Video Editor

[![Build Status][build-status]][build-url]
[![NPM version][npm-image]][npm-url]
[![Downloads][downloads-image]][npm-url]
[![Twitter Follow][twitter-image]][twitter-url]

[build-status]:https://travis-ci.org/triniwiz/nativescript-video-editor.svg?branch=master
[build-url]:https://travis-ci.org/triniwiz/nativescript-video-editor
[npm-image]:http://img.shields.io/npm/v/nativescript-video-editor.svg
[npm-url]:https://npmjs.org/package/nativescript-video-editor
[downloads-image]:http://img.shields.io/npm/dm/nativescript-video-editor.svg
[twitter-image]:https://img.shields.io/twitter/follow/triniwiz.svg?style=social&label=Follow%20me
[twitter-url]:https://twitter.com/triniwiz

## Prerequisites / Requirements

**Note Android min-sdk is 18**

## Installation

Describe your plugin installation steps. Ideally it would be something like:

```javascript
tns plugin add nativescript-video-editor
```

## Usage 

### Transcode

```typescript
import { VideoEditor } from 'nativescript-video-editor';
// parameters passed to transcodeVideo
VideoEditor.transcodeVideo(
            filePath, // the path to the video on the device
            'outputFileName', // the file name for the transcoded video
            width,
            height,
            videoBitrate,
            fps,
            saveToLibrary, // optional, defaults to true
            function(progress) {} // info will be a number from 0 to 100
).then(function(file){})
.catch(function(error) {})
```


### Create a JPEG thumbnail from a video
```typescript
import { VideoEditor } from 'nativescript-video-editor';
VideoEditor.createThumbnail(
        filePath, // the path to the video on the device
        'outputFileName', // the file name for the JPEG image
        60, // optional, location in the video to create the thumbnail (in seconds)
        320, // optional, width of the thumbnail
        480, // optional, height of the thumbnail
        100 // optional, quality of the thumbnail (between 1 and 100)
)
.then(function(file){})
.catch(function(error) {})
```


### Get info on a video (width, height, orientation, duration, size, & bitrate)
```typescript
import { VideoEditor } from 'nativescript-video-editor';
VideoEditor.getVideoInfo(
        filePath, // the path to the video on the device
).then(function(info){})
 .catch(function(error) {})
```
## License

Apache License Version 2.0, January 2004
