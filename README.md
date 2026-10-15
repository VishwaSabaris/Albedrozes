# Albedrozes Autonomous Rover - Cloud Frontend

This is the cloud frontend web application for **Albedrozes Private Limited**, designed to run on **AWS** (S3 + CloudFront, AWS Amplify, or EC2/ECS) while communicating in real-time with the **Raspberry Pi** onboard the autonomous surface rover.

---

## 🎨 Theme & Design System
- **Colors**: Albedrozes Corporate Navy (`#001A70`) and Tech Azure (`#1E88E5`).
- **Typography**: Google Fonts (*Plus Jakarta Sans* & *JetBrains Mono*).
- **Logos**: Official Albedrozes emblem and corporate header logos.
- **Product Gallery**: Interactive showcase of the actual Archimedes screw propulsion rover and high-capacity green mesh catchment hopper (`rover1.jpeg` & `rover2.jpeg`).
- **Company Profile**: Incorporated under Ministry of Corporate Affairs, CIN: `U62013TZ2026PTC038703`. Founders: **Dhandapani Govardhan** & **Adithya Viswanathan**.

---

## 🚀 Running Locally

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Start the local development server:
   ```bash
   npm run dev
   ```

3. Open in your browser: `http://localhost:5173`

---

## ☁️ Deploying to AWS

### Method 1: AWS Amplify (Easiest & Automatic CI/CD)
1. Push your repository to GitHub.
2. In AWS Console, open **AWS Amplify Hosting** -> **Host web app**.
3. Select your GitHub repository (`rover2` / `frontend`).
4. Amplify will automatically detect the build settings in `aws-deploy/amplify.yml`.
5. Click **Save and Deploy**. Your frontend is live with automatic SSL!

### Method 2: AWS S3 + CloudFront (High Performance & Low Cost)
1. Build the production bundle:
   ```bash
   npm run build
   ```
2. Upload the `dist/` directory to an S3 bucket configured for static website hosting:
   ```bash
   aws s3 sync dist/ s3://your-albedrozes-bucket --delete
   ```
3. Connect the S3 bucket as an Origin to an **AWS CloudFront Distribution**.

---

## 🛰️ Raspberry Pi Communication & Gateway Setup

- By default, the frontend attempts to reach the Raspberry Pi at `http://localhost:8000` (for local bench testing).
- When deployed on AWS, the operator can configure the Raspberry Pi URL at runtime:
  1. Click the **"Pi Link: Connected / Standby"** button on the top right of the dashboard.
  2. Enter the Raspberry Pi's public IP, Ngrok, or Cloudflare Tunnel URL (e.g. `https://rover-pi.ngrok-free.app`).
  3. Click **Save & Test Connection**. The frontend connects to the Raspberry Pi to stream live camera and telemetry.

---

## 🤫 Secret Simulation Mode (Visible to Operator Only)

To test or demonstrate sensor telemetry without physical hardware:
- **Shortcut**: Press **`Alt + D`** (or **`Ctrl + Shift + S`**).
- **Alternative**: Rapidly click the **Albedrozes Logo 3 times**, or access the option in the Operator profile dropdown.
- When activated, a discreet bar appears:
  - Click **"Start Random Sensor Values"** to start realistic fluctuating readings.
  - Click **"Stop"** to immediately halt random values and return to real Raspberry Pi sensor telemetry.
  - Invisible to standard visitors, accessible to you whenever needed!

---

## 📥 Downloading Sensor Telemetry

- **Export CSV**: Downloads a timestamped `.csv` spreadsheet containing every reading (pH, Turbidity, TDS, DO, BOD, COD, Battery, Debris, Area, Latitude, Longitude).
- **Download Report**: Generates an official printable PDF-ready environmental telemetry report.
