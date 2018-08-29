# clapper-playback-speed-plugin-extended
This is extended version of https://github.com/Viewly/clappr-playback-speed

Plugin for [Clappr](https://github.com/clappr/clappr)

## Requirements

## Development

```sh
yarn install
yarn dev
```

## Usage
```
new Clappr.Player({
  source: "http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4",
  poster: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/HelloWorld.svg/512px-HelloWorld.svg.png",
  parentId: "#player",
  ...
  plugins: [PlaybackSpeedPlugin],
  playbackSpeedPluginConfig: {
          playbackSpeeds: [
            {value: 0.25, label: '0.25x'},
            {value: 0.5, label: '0.5x'},
            {value: 0.75, label: '0.75x'},
            {value: 1.0, label: 'Normal'},
            {value: 1.5, label: '1.5x'},
            {value: 2, label: '2x'},
            {value: 3, label: '3x'},
          ],
        }
});
```

##Sample Image
![Sample](https://image.prntscr.com/image/rc29nRB1TgCJa5AnalwcDQ.png)

## Support
emre.karatasoglu@hotmail.com
