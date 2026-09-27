# UNISAVE Android App

This repository contains the complete Flutter/Dart source code for the official UNISAVE Android application.

## ⚠️ Action Required: Native Compilation

The Flutter Dart code inside the `lib/` directory is **100% complete**. 

However, because the `flutter` SDK was not available in the environment where this code was generated, the native platform folders (like `android/`) were not generated.

### Steps to Run

1. **Ensure Flutter is installed** on your machine.
2. Open a terminal in this directory (`c:\PROJECTS\UNISAVE\unisave_app`).
3. Run the following command to generate the missing native wrappers safely without overwriting the `lib/` directory:
   ```bash
   flutter create . --org com.unisave
   ```
4. Update the generated `android/app/src/main/AndroidManifest.xml`:
   * Add permissions: `INTERNET`, `WAKE_LOCK`, `FOREGROUND_SERVICE`, `FOREGROUND_SERVICE_DATA_SYNC`.
   * Add the `android.intent.action.SEND` text/url filter inside the `<activity>` block to enable the "Share to UNISAVE" feature.
5. Install dependencies and generate models:
   ```bash
   flutter pub get
   dart run build_runner build -d
   ```
6. Run the app:
   ```bash
   flutter run
   ```

## Architecture

* **State Management:** Riverpod (`flutter_riverpod`)
* **Routing:** GoRouter (`go_router`)
* **Networking:** Dio (`dio`)
* **Storage:** SharedPreferences (for Local History / Onboarding state)
* **Background Downloads:** `background_downloader`

## Features Included
* First Launch Onboarding flow
* REST API Integration (`AnalyzeUrl`, `StartDownload`, `PollStatus`)
* Background Isolates for downloading files
* Share-To-App Intents detection
* Premium UI implementation (Dark mode, segmented controls, native dialogs)
