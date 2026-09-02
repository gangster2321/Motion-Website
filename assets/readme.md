# assets/

Drop your own files here and reference them from `js/projects-data.js`.
Paths are relative to `index.html`, so no leading slash.

    assets/
      videos/   .mp4 files   ->  video: 'assets/videos/reel.mp4'
      images/   .jpg/.png    ->  image: 'assets/images/board.jpg'
                                 thumb: 'assets/images/poster.jpg'

**Videos.** A local video with no `thumb` will show its own first frame as the
card thumbnail. Give it a `thumb` if you want to control which frame appears.

**Images.** Card thumbnails are displayed at roughly 16:9 and cropped to fill,
so keep the subject near the centre. Around 1600px wide is plenty.

**Naming.** Stick to lowercase, hyphens, no spaces — `punchout-demo.mp4`, not
`Punchout Demo.mp4`. Spaces and capitals break on some web hosts.

You don't have to use this folder at all: `projects-data.js` also accepts
YouTube IDs and `drive:FILE_ID`, which keeps large video files out of the repo.
