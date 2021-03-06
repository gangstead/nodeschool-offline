nodeschool-offline
==================

Offline site for NodeSchool.io events that includes Node installers, zipped workshoppers and instructions.  Host your instructions and downloads from a laptop to avoid bottleneck shared internet connection.
![Nodeschool-offline in action](./nodeschool-offline-demo.png)
This page is to be run by one of the presenters on their laptop and projected during the meetup (or at least the beginning) and serves two purposes:

1. Informational screen so users walking into the meetup know what to do
2. Once users connect (using the page's instructions) they navigate to it on their laptops to get started installing Node.JS and/or workshops.

Fork for [Nodeschool Dallas](https://github.com/nodeschool/dallas) meetups.

## Setup

First time you want to run you need to download all the dependencies.  Will have to do this again whenever you add a module.
```
> npm install
```
Modify `config.json` with your wifi settings and modules you are going to do tonight.

## Running

The default gulp task opens a web server at port 3000
```
> gulp
```
Then visit http://localhost:3000 and put it up on a projector

Attendees can go to the http://[your-ip]:3000 and get started.

## Adding a module
"My meetup is super advanced and we're going to do some more modules."  Bully for you.  Here's what you do.

Let's say you are going to add get-it.  First install get-it locally, saving to your package.json:
```
npm install git-it --save-dev
```

Next modify `config.json` and add `git-it` to the list of modules:
```json
{
  "local_ip": "0.0.0.0",
  "port": 3000,
  "wifi_ssid": "wifi network",
  "wifi_pw": "wifi password",
  "modules": [
    "learnyounode",
    "stream-adventure",
    "javascripting",
    "git-it"
  ]
}
```

Now run `npm install` and `gulp` as before.
