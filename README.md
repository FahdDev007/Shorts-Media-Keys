# Shorts Media Keys

A lightweight, zero-dependency Chrome Manifest V3 extension that finally brings full hardware media key support to YouTube Shorts.

## The Problem
By default, YouTube Shorts does not map your keyboard's "Next Track" and "Previous Track" media keys to scrolling up and down. This forces you to stay inside the browser window to navigate between Shorts.

## The Solution
This extension seamlessly hooks into the browser's native Media Session API. It allows your physical hardware media keys to control YouTube Shorts **even when Chrome is minimized or playing in the background**.

### Features
- ⏯️ **Play/Pause**: Natively supported and deeply integrated.
- ⏭️ **Next Track**: Automatically scrolls down to the next Short.
- ⏮️ **Previous Track**: Automatically scrolls up to the previous Short.
- 🔋 **Zero bloat**: No background scripts chewing up memory. It injects directly into YouTube's environment and only activates when you're actively watching Shorts.
- 🛡️ **Privacy first**: Only requests the base permissions to run on YouTube. It doesn't track you, read your history, or phone home.

## Installation (Manual / Developer)

1. Clone or download this repository.
2. Open Google Chrome (or any other browser you are actively using) and navigate to `chrome://extensions/`.
3. Enable **Developer mode** using the toggle switch in the top right corner.
4. Click the **Load unpacked** button.
5. Select the directory containing this extension (where `manifest.json` is located).

## How It Works Under the Hood

Because YouTube operates as a Single Page Application (SPA), the extension loads quietly on all YouTube pages and activates when the URL switches to `/shorts/`. It safely bypasses YouTube's strict Content Security Policy (CSP) by injecting a native script into the `MAIN` world. This allows it to hijack `navigator.mediaSession.setActionHandler` to ensure that YouTube's own player logic cannot delete the custom media key bindings.

## Known Limitations

- **OS Media Session Priority**: If another application (like Spotify, Apple Music, or a native media player) is actively playing media, your operating system will typically route media keys to whichever app most recently started its media session. If the keys aren't working, pause your background music app to let Chrome take priority.

