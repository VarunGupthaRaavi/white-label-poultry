# Firebase Provisioning & Manual Setup Runbook

When onboarding a new enterprise client to the white-label commerce platform, cloud resources must be established adhering to the principle of least privilege. If automated Google Cloud Service Usage / Resource Manager credentials are not yet configured in the CI/CD pipeline, follow this authorized manual checklist.

---

## 1. Platform Management Project Setup (Control Plane)

The platform developer control plane runs against a dedicated central Firebase project (e.g. `poultry-platform-control`).

### Step 1.1: Create Platform Firebase Project
1. Log into the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add project**, name it `poultry-platform-control` (or your chosen organization prefix).
3. Disable Google Analytics unless specifically needed for developer panel telemetry.

### Step 1.2: Enable Core Services
1. **Authentication**:
   - Navigate to **Build > Authentication > Get Started**.
   - Enable **Email/Password**.
   - Set up initial platform developer accounts under Users.
2. **Cloud Firestore**:
   - Navigate to **Build > Firestore Database > Create Database**.
   - Select your preferred central multi-region or regional location (e.g., `nam5` or `eur3`).
   - Start in Production mode.
3. **Cloud Functions**:
   - Upgrade the project to the **Blaze (Pay as you go)** plan (required for Cloud Functions deployment).
4. **Cloud Storage**:
   - Navigate to **Build > Storage > Get Started**.
   - Select default bucket location matching Firestore.

### Step 1.3: Assign Developer Super-Admin Claims
To bootstrap the first platform developer without exposing write vulnerabilities:
Run the platform bootstrapping script (or Firebase Admin CLI tool):
```bash
node scripts/bootstrap_developer.js --email="lead.developer@platform.dev" --uid="FIREBASE_AUTH_UID"
```
This writes:
- Document at `/control_plane/v1/platform_admins/{uid}`
- Custom user claims `{ role: 'developer', permissions: ['*'] }`

### Step 1.4: Deploy Control Plane Rules & Functions
```bash
firebase use poultry-platform-control
firebase deploy --only firestore:rules,storage:rules,functions
```

---

## 2. Dedicated Client Project Setup (Tenant Data Plane)

For each new enterprise tenant (e.g., `apex-poultry-hub`):

### Step 2.1: Project Creation & Billing Linkage
1. In Google Cloud Console or Firebase Console, create project: `client-apex-poultry`.
2. Link the corporate billing account.
3. Enable Cloud Firestore in Native Mode.
4. Enable Firebase Authentication (Email/Password, Phone OTP, Google Sign-In as required by client branding).
5. Enable Cloud Storage bucket: `gs://client-apex-poultry.appspot.com`.

### Step 2.2: Register Application Clients
1. **Android App**:
   - Register package name: `com.whitelabel.apex_poultry`.
   - Add SHA-1 and SHA-256 fingerprint from the release signing keystore.
   - Download `google-services.json` (used during client build).
2. **iOS App**:
   - Register iOS bundle identifier: `com.whitelabel.apex-poultry`.
   - Download `GoogleService-Info.plist`.
3. **Web App**:
   - Register web app: `Apex Poultry Web`.
   - Record Firebase configuration keys (`apiKey`, `projectId`, `appId`, etc.).

### Step 2.3: Record Tenant Metadata in Developer Control Panel
1. Open the Developer Control Panel.
2. Navigate to **Tenants > Onboard New Client**.
3. Enter Tenant ID: `apex-poultry-hub`.
4. Enter Legal Business Name: `Apex Agro Poultry Hatcheries`.
5. Enter Firebase Project ID: `client-apex-poultry`.
6. Select initial tier and feature entitlements.
7. Save as `draft` or `provisioning`.
8. Complete the **Provisioning Checklist** in the Developer Panel:
   - [x] GCP Project initialized
   - [x] Firestore created
   - [x] Authentication methods enabled
   - [x] Storage bucket created
   - [x] App IDs registered
   - [x] Security rules deployed to client project
9. Transition lifecycle state to **Active**.
