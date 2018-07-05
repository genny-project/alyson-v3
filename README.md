# alysonv3

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

4. Open XCode
5. Build the project
6. If using a simulator, run the project under the selected simulator in XCode
7. If using a device, run the project under the selected device in XCode

## !WARNING!

- Do NOT run `react-native link`, it will break `react-native-maps`
