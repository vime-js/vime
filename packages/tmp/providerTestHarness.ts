// it('should change volume', async () => {
//   callAdapter('setVolume', 25);
//   await player.waitForEvent(PlayerEvent.VolumeChange);
//   expect(await get(PlayerProp.Volume)).toEqual(25);
//   // Can't detect sound yet. Refer to https://github.com/puppeteer/puppeteer/issues/516.
//   expect(spy(PlayerEvent.VolumeChange)).toHaveReceivedEventDetail(25);
// });

// it('should change muted', async () => {
//   callAdapter('setMuted', true);
//   await player.waitForEvent(PlayerEvent.MutedChange);
//   // Can't detect sound yet. Refer to https://github.com/puppeteer/puppeteer/issues/516.
//   expect(spy(PlayerEvent.MutedChange)).toHaveReceivedEventDetail(true);
//   // Changing muted should not reload media.
//   await player.setProperty(PlayerProp.Muted, false);
//   await page.waitForChanges();
//   expect(spy(PlayerEvent.LoadStart)).toHaveReceivedEventTimes(0);
// });

// it('should end playback', async () => {
//   callAdapter('play');
//   await player.waitForEvent(PlayerEvent.PlayingChange);
//   callAdapter('setCurrentTime', (await get(PlayerProp.Duration)) - 1.5);
//   await player.waitForEvent(PlayerEvent.PlaybackEnded);
//   await waitSeconds(1);
//   expect(spy(PlayerEvent.PlaybackEnded)).toHaveReceivedEventTimes(1);
//   const endedTime = await get(PlayerProp.CurrentTime);
//   const duration = await get(PlayerProp.Duration);
//   expect(endedTime >= (duration - 1) && endedTime <= (duration + 1)).toBeTruthy();
// });

// it('should loop', async () => {
//   /**
//    * ---------------------------------------------
//    * Loop.
//    * ---------------------------------------------
//    */
//   // set looped true.
//   // wait for playing and check current time.
//   // no playbackstarted event + playbackEnded event.

//   // Changing loop should not reload media.
//   // await player.setProperty(PlayerProp.Loop, false);
//   // await page.waitForChanges();
//   // expect(spy(PlayerEvent.LoadStart)).toHaveReceivedEventTimes(0);
// });

// it('should enter/exit fullscreen', async () => {
//   /**
//    * ---------------------------------------------
//    * Fullscreen.
//    * ---------------------------------------------
//    */
//   // fullscreen (if can set) (check doc if it's set)
//   // isFullscreenActive + vFullscreenChange
// });

// it('should enter/exit picture-in-picture', async () => {
//   // pip (if can set)
//   // pipActive + vPiPChange
//   // document.pictureInPictureElement === provider?
// });

// it('should change playback quality', async () => {
//   // if (await player.callMethod('canSetPlaybackQuality')) {
//   //   const qualities = await get(PlayerProp.PlaybackQualities);
//   //   const newQuality = qualities[Math.floor(Math.random() * qualities.length)];
//   //   // eslint-disable-next-line @stencil/strict-boolean-conditions
//   //   if (newQuality) {
//   //     callAdapter('setPlaybackQuality', newQuality);
//   //     await expect(player).toFireEvent(
//   //       PlayerEvent.PlaybackQualityChange,
//   //       'changing playback quality',
//   //     );
// expect(spy(PlayerEvent.PlaybackQualityChange))
//   .toHaveReceivedEventDetail(newQuality);
//   //   }
//   // }
// });
