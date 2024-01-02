<p align="center">
    <a href="" rel="nooperner">
    <img width=200px height=200px src="public/logo.png" alt="Tailfin Logo"></a>
</p>

<h3 align="center">Tailfin</h3>

---

<p align="center">A self-hosted digital flight logbook</p>

## Table of Contents

+ [About](#about)
+ [Getting Started](#getting_started)
+ [Configuration](#configuration)
+ [Usage](#usage)
+ [Roadmap](#roadmap)

## About <a name="about"></a>

Tailfin is a digital flight logbook designed to be hosted on a personal server, computer, or cloud solution. This is the
web frontend.

I created this because I was disappointed with the options available for digital logbooks. The one provided by
ForeFlight is likely most commonly used, but my proclivity towards self-hosting drove me to seek out another solution.
Since I could not find any ready-made self-hosted logbooks, I decided to make my own.

## Getting Started <a name="getting_started"></a>

### Prerequisites

- npm
- [tailfin-api](https://github.com/azpsen/tailfin-api)

### Installation

1. Clone the repo

```
$ git clone https://git.github.com/azpsen/tailfin-web.git
$ cd tailfin-web
```

3. Install NPM requirements

```
$ npm install
```

5. Build and run the web app

```
$ npm run build && npm run start
```

## Usage <a name="usage"></a>

Once running, the web app can be accessed at `localhost:3000`

Currently, this only supports a local Tailfin API instance running at `localhost:8081`. This can be modified by manually editing `app/util/api.ts`.

## Roadmap <a name="roadmap"></a>

- [x] Basic API sessions and data fetching
- [ ] Functionality for adding flights
- [ ] Dashboard with statistics
- [ ] Attach photos to log entries
- [ ] Admin dashboard to manage all users and server configuration
- [ ] Integrate database of airports and waypoints that can be queried to find nearest
- [ ] GPS track recording and map display
