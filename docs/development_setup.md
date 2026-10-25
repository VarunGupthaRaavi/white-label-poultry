# Local Development and Verification Guide

## 1. Prerequisites
- **Flutter SDK**: 3.44.0+ (Dart 3.12.0+)
- **Node.js**: v20.x or v22.x
- **npm**: 10.x+
- **Firebase CLI**: 15.x+ (`npm install -g firebase-tools`)
- **Git**

---

## 2. Environment Configuration

Copy the example environment files:
```bash
# In root directory
cp .env.example .env

# In developer_panel directory
cp developer_panel/.env.example developer_panel/.env.local
```

---

## 3. Running Local Firebase Emulators

The platform supports offline local development using the Firebase Emulator Suite.
```bash
# Start Firestore, Auth, Functions, and Storage emulators
firebase emulators:start
```
- Emulator UI: `http://localhost:4000`
- Auth Emulator: `localhost:9099`
- Firestore Emulator: `localhost:8080`
- Functions Emulator: `localhost:5001`
- Storage Emulator: `localhost:9199`

---

## 4. Running the Developer Control Panel (Next.js)

The Developer Control Panel features an automatic hybrid provider:
- When Firebase environment variables are provided, it connects to live Firebase or local Firebase Emulators.
- When run in development without cloud credentials, it falls back seamlessly to a high-fidelity local developer mock state with complete state persistence, allowing immediate evaluation of tenant creation, branding editing, entitlement matrices, lifecycle transitions, and audit logs.

```bash
cd developer_panel
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 5. Running the Flutter Customer Application

```bash
# Get dependencies
flutter pub get

# Run static analysis
flutter analyze

# Run unit and widget tests
flutter test

# Launch mobile application (Chrome/Web, Windows, Android, or iOS)
flutter run -d chrome
```

---

## 6. Running Automated Test Suites

```bash
# 1. Run Flutter tests
flutter test

# 2. Run Functions TypeScript build
cd functions
npm run build

# 3. Run Developer Panel build
cd ../developer_panel
npm run build
```
