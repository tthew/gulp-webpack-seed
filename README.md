##Motivation

I am a big fan of gulp and sadly I did not found any gulp webpack seed project, so I made one.
This seed based on [React Infinite Scroll component](https://github.com/lapanoid/react-infinite-scroll)

##How to Use It

clone this repo

```bash
npm i
gulp
```

to build
```bash
gulp build-all
```
you can also build prod and dev separately

```bash
gulp build-prod
gulp build-dev
```
check dist folder then

##TODO
Webpack generate solid bundle called **infinitescroll.js**, which already contains all its dependencies. 
I am planing to split bundles in future. (When I figure out how to do it)




