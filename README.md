<p align="center">
    <a href="" rel="nooperner">
    <img width=200px height=200px src="public/logo.png" alt="Tailfin Logo"></a>
</p>

<h1 align="center">Tailfin</h2>

<h3 align="center">A self-hosted digital flight logbook</h3>

![Screenshots](public/mockup.png)

<p align="center">
    <a href="LICENSE"><img src="https://img.shields.io/github/license/azpsen/tailfin-web?style=for-the-badge" /></a>
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" /></a>
    <a href="https://react.dev/"><img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB" alt="React" /></a>
    <a href="https://remix.run/"><img src="https://img.shields.io/badge/remix-%23000.svg?style=for-the-badge&logo=remix&logoColor=white" alt="Remix-Run" /></a>
    <a href="https://tanstack.com/query/latest/"><img src="https://img.shields.io/badge/-React%20Query-FF4154?style=for-the-badge&logo=react%20query&logoColor=white" alt="TanStack Query" /></a>
</p>

## Table of Contents

- [About](#about)
- [Getting Started](#getting_started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
- [Usage](#usage)
- [Roadmap](#roadmap)

## About <a name="about"></a>

Tailfin is a digital flight logbook designed to be hosted on a personal server, computer, or cloud solution. This is the
web frontend.

I created this because I was disappointed with the options available for digital logbooks. The one provided by
ForeFlight is likely most commonly used, but my proclivity towards self-hosting drove me to seek out another solution.
Since I could not find any ready-made self-hosted logbooks, I decided to make my own.

## Getting Started <a name="getting_started"></a>

### Prerequisites <a name="prerequisites"></a>

- npm
- [tailfin-api](https://github.com/azpsen/tailfin-api)

### Installation <a name="installation"></a>

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

### Configuration <a name="configuration"></a>

The URL for the Tailfin API can be set with the environment variable `TAILFIN_API_URL`. It defaults to `http://localhost:8081`, which assumes the API runs on the same machine and uses the default port.

## Usage <a name="usage"></a>

Once running, the web app can be accessed at `localhost:3000`

## Roadmap <a name="roadmap"></a>

- [x] Create, view, edit, and delete flight logs
- [x] Aircraft managment and association with flight logs
- [x] Dashboard with statistics
- [x] Attach photos to log entries
- [ ] GPS track recording and map display
- [ ] Calendar view
- [ ] Admin dashboard to manage all users and server configuration
- [ ] Integrate database of airports and waypoints that can be queried to find nearest
