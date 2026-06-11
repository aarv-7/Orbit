# Orbit by CarbonLens AI

## 🌍 Chosen Vertical
**Personal Carbon Footprint Tracking & Sustainable Behavior Change.**

## 🧠 Approach and Logic
Instead of a retrospective "guilt-tracker" that relies on manual data entry, CarbonLens AI (internal codename: Orbit) acts as a **proactive decision-layer assistant**. We intercept moments where users are already making choices (grocery shopping, commuting, dining) and surface the environmental cost *before* the action is finalized. 

We prioritize:
1. **Frictionless Data Capture:** Using AI vision concepts to scan receipts and items instead of manual forms.
2. **Contextual Nudges:** Suggesting a single, high-impact daily swap based on user habits, avoiding information overload.
3. **Tangible Equivalents:** Translating abstract "kg of CO₂" into relatable metrics (e.g., "hours of driving", "trees growing") to drive emotional resonance.

## ⚙️ How the Solution Works
- **The Pulse:** A living dashboard showing your current momentum and a single daily high-leverage swap suggestion.
- **The Lens (AI Vision):** Users can type items or paste receipt data. The AI calculates the carbon cost and suggests lower-carbon alternatives instantly.
- **What-If Simulator:** Users can input natural language scenarios (e.g., "What if I biked to work twice a week?") and see projected 1-month, 6-month, and 1-year environmental impacts.
- **The Ripple:** Visualizes the cumulative societal impact of the user's choices over time.
- **Habit Fingerprint:** Analyzes recurring behaviors to identify the top 3 carbon-heavy habits and recommends targeted interventions.

## 🤔 Assumptions Made
- **Emission Factors:** We assume standard, peer-reviewed lifecycle assessment data (e.g., Poore & Nemecek 2018) for our carbon baseline calculations. Regional variations in grid intensity are generalized for this MVP.
- **User Engagement:** We assume users respond better to positive reinforcement and gamified "momentum" rather than negative guilt-framing.
- **Technical Constraints:** For the hackathon context, receipt scanning uses text-pasting/typing to mock the final OCR pipeline, and we simulate backend interactions via a robust client-side architecture (HTML/CSS/JS without complex build steps) to ensure maximum speed and ease of evaluation.
