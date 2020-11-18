---
title: Loading Media
sidebar_label: Loading Media
---

## File

### Empty

```js
player.src = null;
```

### Media Stream

```js
player.src = new MediaStream();
```

### Relative Path

```js
player.src = '/media/audio.mp3';
```

### URL

```js
player.src = 'https://mysite.com/video.mp4';
```

### Object

```js
player.src = { src: '/media/video.mp4', type: 'video/mp4' };
```

### Array

```js
player.src = [
  '/media/video.mp4',
  '/media/video.ogg'
];
```

### Array of Objects

This also demonstrates how to pass in qualities which are optional.

```js
player.src = [{ 
  src: '/media/video-1080.mp4', 
  type: 'video/mp4',
  quality: 1080
}, { 
  src: '/media/video-1080.ogg', 
  type: 'video/ogg',
  quality: 1080
}, { 
  src: '/media/video-720.mp4', 
  type: 'video/mp4',
  quality: 720
}, { 
  src: '/media/video-720.ogg', 
  type: 'video/ogg',
  quality: 720
}];
```
## YouTube

### Empty

```js
player.src = null;
```

### Shorthand

```js
player.src = 'youtube/{videoId}';
```

### URL

`https://`, `www` and `.com` are optional.

```js
player.src = 'https://www.youtube.com/{videoId}';
```

### Shortened URL

`https://` and `www` are optional.

```js
player.src = 'https://www.youtu.be/{videoId}';
```

### Watch URL

`https://`, `www` and `.com` are optional.

```js
player.src = 'https://www.youtube.com/watch?v={videoId}';
```

### Embed URL

`https://`, `www` and `.com` are optional.

```js
player.src = 'https://www.youtube.com/embed/{videoId}';
```

## Vimeo

### Empty

```js
player.src = null;
```

### Shorthand

```js
player.src = 'vimeo/{videoId}';
```

### URL

`https://`, `www` and `.com` are optional.

```js
player.src = 'https://www.vimeo.com/{videoId}';
```

### Embed URL

```js
player.src = 'player.vimeo.com/video/{videoId}';
```

## Dailymotion

### Empty

```js
player.src = null;
```

### Shorthand

```js
player.src = 'dailymotion/{videoId}';
```

### URL

`https://`, `www` and `.com` are optional.

```js
player.src = 'https://www.dailymotion.com/{videoId}';
```

### Shortened URL

`https://` and `www` are optional.

```js
player.src = 'https://www.dai.ly/{videoId}';
```

### Watch URL

`https://`, `www` and `.com` are optional.

```js
player.src = 'https://www.dailymotion.com/video/{videoId}';
```

### Embed URL

`https://`, `www` and `.com` are optional.

```js
player.src = 'https://www.dailymotion.com/embed/video/{videoId}';
```
