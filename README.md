##Motivation

I am a big fan of gulp and sadly I did not found any gulp webpack seed project, so I made one.
This seed based on [React Infinite Scroll component](https://github.com/lapanoid/react-infinite-scroll)

##Install

clone this repo

```bash
npm i
```
<!---
#OR Use by package managers
## via npm 
```bash
npm install react-infinite-scroll-webpack
```

## via bower
```bash
bower install react-infinite-scroll
```
--->

##Some Webpack livereload magic
Just run
```bash
gulp
```
to use Webpack dev server.
You can play with source code and it will be livereloaded on change.

##Usual build
```bash
gulp build-all
```
You can also build prod and dev separately.

```bash
gulp build-prod
gulp build-dev
```
Check dist folder for index.html after build.


##TODO
Bump version gulp tasks for bower and npm (with publishing).
