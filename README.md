# alysonv3


## !WARNING!

- Do NOT run `react-native link`, it will break `react-native-maps`



## Get started

### iOS

(these could be wrong, please let me know if it doesn't work or a step is unnecessary)

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
