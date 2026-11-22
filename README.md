# UIKit / iOS 4.2.1

An interactive web catalog of the iOS 4.2.1 (8C148) UIKit controls and their period styles.

```sh
python3 -m http.server 8080
```

Open http://localhost:8080. The site is static and uses relative paths for GitHub Pages. No Apple binary, artwork, or fonts are distributed.

Run the browser smoke test with Node 22+ and Chrome:

```sh
google-chrome --headless --remote-debugging-port=9222 --user-data-dir="$(mktemp -d)" about:blank &
node tests/gallery.mjs http://127.0.0.1:8080/
```

The switch, slider and rounded-rect button use the existing iOS 4 gallery styles. The other specimens are CSS, SVG and JavaScript recreations, not native UIKit. See [coverage and source notes](COVERAGE.md).
