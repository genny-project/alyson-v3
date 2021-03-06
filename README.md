# alysonv3

- [Get started](#get-started)
  - [iOS](#ios)
  - [Android](#android)
  - [Web](#web)
- [Notes](#notes)
- [FAQs](#faqs)
- [Troubleshooting](#troubleshooting)
- [Running in Up mode as part of the full Genny Project stack](#running-in-up-mode-as-part-of-the-full-genny-project-stack)

## Get started

### iOS

1. Install JS dependencies

```bash
npm install
```

2. Install iOS dependencies

    *Note:* you will need Cocoapods installed on your machine

```bash
cd ios && pod install
```

3. Run the packager

```bash
cd .. && npm run start:native
```

1. place your environment variables into a .env file in the root of the project, or place them into a .env.project-name file
2. Open XCode
3. Build the project
4. If using a simulator, run the project under the selected simulator in XCode
5. If using a device, run the project under the selected device in XCode
6. If using an environment variable file that is not .env, run

```
ENVFILE=.env.project-name react-native run-ios
```


### Android


1. Install JS dependencies

```bash
npm install
```

2. Run the packager

```bash
cd .. && npm run start:native
```

3. Open the `/android` folder as a project in Android Studio.

4. Start the simulator in Android Studio, then run

```
react-native run-android
```

if using an environment variable file that is not ` .env `, use

```
ENVFILE=.env.project-name  react-native run-android
```

---

### Web


1. Install JS dependencies

```bash
npm install
```

2. Run the web app

```bash
npm run start:web
```

3. Open http://localhost:3000/

---

## Notes

- Do not run `npm link`! Always only use `npm link {library_name}`.

```diff
- npm link
+ npm link {library_name}
```

If you do run `npm link` across the project, you will break many other libraries. These other libraries need installations more complex than `npm link` command can offer, and in running that command you are breaking their complex installations. It is tricky to reverse the effects of running this command, so we recommend you simply reset your project files.

---

## FAQs

<details>
	<summary>How do I set environment variables?</summary>

<p></p>

By default, all the config values are fetched from Bridge and used from thereon in. On web, the Bridge URL is assumed to be accessible from the same URL which the web app is hosted on, and therefore no extra guidance from you needs to be given for the web app to point to the correct Bridge URL.

However, sometimes you may need to change what the Bridge URL should be. A good example of this is when you're developing locally, and trying to point to the staging Bridge URL. You need to override the environment variable `ENV_GENNY_BRIDGE_URL` and set it to the relevant app's Bridge URL.

You can easily override any environment variables by either passing them in when you run `npm run start:web`.

To do so, simply follow this convention:

```diff
- --env.{key}={value}
+ --env.ENV_GENNY_BRIDGE_URL=http://www.google.com.au
```

So your run command may end up looking like this:

```bash
npm run start:web -- --env.VAR_ONE=one --env.VAR_TWO=two
```

Alternatively, you can also set up a `.env` file containing these environmental variables to save you from passing them in via the CLI every time you run the web app.

To do so, follow these steps:

1. Create a file named `.env` in the root directory of this project

2. Open the `.env` file and write your environment variables inside, like so:

```bash
ENV_GENNY_BRIDGE_URL=https://www.google.com.au
ENV_LAYOUT_PUBLICURL=http://localhost:2224
ENV_LAYOUT_QUERY_DIRECTORY=layouts/example-directory
```

3. Run the web app again

```bash
npm run start:web
```

4. Open http://localhost:3000/

</details>

<p></p>

---

## Troubleshooting

### Copy Plist File Error (iOS)

> /PROJECT_PATH/alyson-v3/ios/alysonv3/AppCenter-Config.plist:0: error: reading data: The file “AppCenter-Config.plist” couldn’t be opened because there is no such file.

To fix this error, run the following command:

```bash
ENVFILE=.env npm run setup-files
```

## Running in Up mode as part of the full Genny Project stack


Git pull the following projects:
```bash
   alyson-v3
   layout-cache
```

Create an .env file in the alyson-v3 project. It should contain the following properties:
```bash
	APP_NAME=<Project>
	APP_ID=<project>
	GENNY_HOST=http://bridge.genny.life
	GENNY_INITURL=http://alyson3.genny.life
	GENNY_BRIDGE_PORT=80
	GENNY_BRIDGE_VERTEX=frontend
	GENNY_BRIDGE_SERVICE=api/service
	GENNY_BRIDGE_EVENTS=api/events
	UPPY_URL=""
	KEYCLOAK_REDIRECTURI=http://keycloak.genny.life
	APPCENTER_ANDROID_SECRET=xxx
	APPCENTER_IOS_SECRET=xxx
	CODEPUSH_KEY=xxx
	LAYOUT_PUBLICURL=http://localhost:2224/
	LAYOUT_QUERY_DIRECTORY=layouts/<project>-new
	GUEST_USERNAME=guest
	GUEST_PASSWORD=asdf1234
	GOOGLE_MAPS_APIKEY=<GoogleMapKey>
	GOOGLE_MAPS_APIURL=https://maps.googleapis.com/maps/api/js
```

In alyson-v3 project, run the command ./build-docker.sh

In genny-main project, copy the following service in docker-compose.yml:
```bash
  	alyson-v3:
    		image: gennyproject/alyson-v3:latest
    		container_name: alyson-v3
    		depends_on:
     		     - bridge
    		ports:
    		     - "6000:8080"
    		environment:
   		     - REACT_BRIDGE_HOST=http://bridge.genny.life
    		     - NODE_ENV=production
    		env_file:
   	                 - ${ENV_FILE}
   		 networks:
      		     - mainproxy
    		restart: always
  ```


In layout-cache project, run the command ./build-docker.sh followed by ./start-dev.sh. The response should be as below:

```bash
	Starting layout-cache_layout-cache_1 ... done
	Attaching to layout-cache_layout-cache_1
	layout-cache_1  |
	layout-cache_1  | > layout-cache@1.0.0 start /usr/src/app
	layout-cache_1  | > node index.js
	layout-cache_1  |
	layout-cache_1  | Layout cache listening on port 2223!
	layout-cache_1  | Layout cache public server listening on port 2224!
```

In genny-main project, run the command
```bash
./run.sh <project> up
```

Finally, launch the browser and run the following URL: http://alyson3.genny.life
