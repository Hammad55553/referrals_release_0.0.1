# Project Name : VibeSea Phone App

**Software Requirements**:

- Node (to install Yarn) [NPM](https://nodejs.org/en/download/prebuilt-installer)
- Yarn Package Manager [Yarn](https://classic.yarnpkg.com/en/docs/install#mac-stable)
- VS code: IDE [download](https://code.visualstudio.com/download)
- XCode (if using Mac and wants to test app on iOS simulators) [Xcode](https://developer.apple.com/xcode/resources/). Watch this video to know more [Set up Xcode](https://youtu.be/5DbMomHr5ys?si=zN34K3-zMNoy050c)
- Android Studio (works on both Windows and Mac, test app on Android emulators) [Android Studio](https://developer.android.com/studio). Watch this video to know more [Set up Android emulators](https://youtu.be/GhuiNcOEv1A?si=Z9E2W6dX9NXDwN2d)
- Firebase Creds
  - Firebase Credential files are already included in the repository inside the "assets" folder.

## Dependencies

**Installing Dependencies**:
Run the following command to install all necessary dependencies:

- use YARN as package manager

```
yarn install
```

Please use the above command after every pull, so that you have the latest dependencies installed.

## Running the Project

**Starting the Development Server**:
To start the server, run:

```
yarn start
```

To start using the iOS:

```
press i
```

To start using the Android:

```
press a
```

In the terminal window, there will be a list of commands available from Expo.
Please read them and use them accordingly.
Here is an example

```
Welcome to Metro v0.80.9
Fast - Scalable - Integrated

info Dev server ready

i - run on iOS
a - run on Android
d - open Dev Menu
r - reload app
```

**Starting the Development Server**:
To close the server, press -

```
Ctrl + C
```

## Git Branching

- `main` - stable production code.
- `dev` - latest dev code.
- `feature/feature-name` - feature related code. New feature branches will be based on `dev` branch. After feature is ready it will be merged in the `dev`.

**Submitting a Pull Request**:

1. Create your feature branch (`git checkout -b feature/[feature-name]-[jira-id]`).
2. Commit your changes (`git commit -m 'Descriptive commit'`).
3. Push to the branch (`git push origin feature/[feature-name]-[jira-id]`).
4. Open a pull request.

**Merging Feature Branches**:

- Ensure code review is completed.
- Squash and merge PRs to `dev`.
- Follow the pull request template and ensure all checks pass.

**Checks Required**:

- Ensure all tests pass.
- Code review approval.
- Linting and formatting checks.
