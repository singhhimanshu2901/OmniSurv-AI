# Demonstration & B.Tech Defense Walkthrough

## Step-by-Step Viva Presentation Script

1. **Open Dashboard:** Navigate to `http://localhost:3000`.
2. **Review Optical Matrix:** Inspect Camera 01 (Gate 1 North), Camera 02 (Parking Area), Camera 03 (Perimeter Corridor), Camera 04 (Exit Gate).
3. **Execute Natural-Language Query:** Click or type:
   > *"Find the blue sedan near Gate 1 after 15:00 and track its movement until exit."*
4. **Observe LangGraph Execution:** Watch the 7-node pipeline transition:
   - Query Analyzer extracts: `class: car, color: blue, loc: Gate 1, t >= 15:00`.
   - Temporal/Spatial Gate maps constraints.
   - Hybrid Search queries 512D CLIP vectors and SQL filters.
   - Trajectory Stitcher reconstructs Track #42.
   - Evidence Validator confirms similarity (0.887).
   - Timeline Generator builds 5 milestones.
   - Forensic Report Generator synthesizes official findings.
5. **Synchronized Video Verification:**
   - Click milestone **15:07:21 ENTRY**: CCTV seeks to 15:07:21, switches to Camera 01, and highlights Track #42 with reticle.
   - Click milestone **15:09:43 PARKING**: Switches to Camera 02.
   - Click milestone **15:14:02 EXIT**: Switches to Camera 04.
6. **2D Trajectory Map:** Switch to Trajectory tab to display multi-camera movement and explain the explicit blind spot gap.
7. **Export Report:** Click **OFFICIAL REPORT** to inspect, copy, or print the signed forensic document.
8. **Viva Defense Tab:** Open **VIVA DEFENSE** modal to present architecture justifications and mathematical formulas to examiners.
