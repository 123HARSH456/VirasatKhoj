# Virasat-Khoj (Phase 2 MVP)

Apk download link: https://expo.dev/artifacts/eas/twRuptFRvbJrF4yupFywgR.apk

Deployment link (Web app): https://virasat-khoj-harsh-v1.web.app/

**Virasat-Khoj** is a gamified heritage discovery application designed to crowdsource the mapping and documentation of unprotected and forgotten historical sites across India. By leveraging AI-driven verification and a "Capture-to-Claim" mechanic, it empowers citizens to become digital "Guardians" of their local history.

---

## 🏛️ Project Overview

Traditional heritage databases often overlook smaller, local ruins. **Virasat-Khoj** bridges this gap by turning the act of discovery into an engaging mobile experience.

### **Core Features**
* **AI-Powered Verification:** Uses Google Gemini 1.5 Flash to instantly analyze photos, verify they contain heritage structures, and generate historical narratives.
* **Gamified Exploration:** Users navigate a live map to find unmapped sites, earning XP and "Guardian Ranks" for every successful claim.
* **Local-First Persistence:** Data is stored locally on the device via AsyncStorage to ensure functionality in remote or low-connectivity areas.

---

## 🛠️ Technical Stack
* **Frontend:** React Native (Expo)
* **AI Engine:** Google Gemini 1.5 Flash API
* **Navigation:** Expo Router
* **Maps:** `react-native-maps`

---

## 🚀 Setup Instructions

### **Prerequisites**
* Node.js (LTS)
* Expo Go app on your mobile device
* Google Gemini API Key (from Google AI Studio)

### **Installation**
1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/123HARSH456/VirasatKhoj.git](https://github.com/123HARSH456/VirasatKhoj.git)
    cd virasat-khoj
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Setup:**
    Create a `.env` file in the root directory and add your Gemini API key:
    ```text
    EXPO_PUBLIC_GEMINI_API_KEY=your_api_key_here
    ```

4.  **Start the app:**
    ```bash
    npx expo start
    ```
    Scan the QR code with the Expo Go app to view the project on your phone.

---

## 📈 Current Progress (Phase 2)

As of the current Phase 2 milestone, the project has transitioned from a theoretical architecture to a functional local prototype:

* **Functional Map:** A live geolocation map with custom markers for hidden and claimed sites.
* **Integrated Camera:** A seamless camera interface that captures images and converts them to Base64 for AI processing.
* **Working AI Pipeline:** The app successfully communicates with Gemini 1.5 Flash to perform real-time verification and historical storytelling.
* **Data Persistence:** Captured discoveries successfully persist across app restarts using local storage.

---

## 🔮 Remaining Work
* Migration to a global Firebase backend for real-time leaderboards and site claims.
* App crash fixes due to map not loaded.
