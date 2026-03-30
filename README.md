# Code-Colab

**Code Arena ** is a real-time collaborative coding platform, inspired by how Skribbl works, built for pairs and small teams to practice DSA problems colaboaratively. LeetCode — but live, with friends, a voice chat, a shared whiteboard, and an AI judge that scores your code on the spot.

## Features at a Glance

- Google Sign-In or anonymous join via session ID
- Driver-based coding model — one person codes, everyone collaborates
- 2500+ actual LeetCode problems derived using LeetCode Query API
- Each person gets a chance in rotation, similar to Skribbl, and has to code a problem as per the selected time limit.
- AI-powered judge evaluates code correctness, complexity, and edge cases, and provides useful insights using time and space complexity.
- Live voice chat between participants (WebRTC)
- Real-time collaborative whiteboard while solving the problem.
- Live group chat synced across all participants
- Round history with per-problem AI analysis and team score
- Real time DB where updates are made using Firebase Real Time DB

### Login 
The entry point. You just need to have a Google Account to create a new room using a unique room ID. You can also join an existing room using an existing room ID provided by your friends.

<img width="510" height="406" alt="image" src="https://github.com/user-attachments/assets/79780c71-f589-40ac-a38f-27c8c7f2ec52" />

### Lobby
Where the host configures the session before it starts — set the timer duration for each problem, max number of problems in one session(depending on no of participants, note: once selected this no cant be changed during the whole game session), and see who's joined. Participants wait in the lobby until the host starts the session.
Once joined, one of the participants will be able to see the Problem Picking Window, where they can choose which topic they want to practice, and what difficulty.

<img width="587" height="414" alt="image" src="https://github.com/user-attachments/assets/bbf29bd3-c688-4440-b927-b8ef292784de" />
<img width="597" height="537" alt="image" src="https://github.com/user-attachments/assets/7fb49ea9-2e31-4393-a0e6-a871c3b03c4e" />


### Room
The main coding arena. Split into three panels:

- **Problem Panel** — displays the active DSA problem with full description
- **Editor Panel** — a collaborative integrated Monaco code editor synced in real time across all participants, with language selection, a countdown timer, and run/submit controls. Only the driver is allowed to submit the code or run it, other users or guests can only see whats happening. There is also an integrated whiteboard where users can do some visualisations and practice dry runs. 
- **Chat + Voice Panel** — live group chat and one-click WebRTC voice chat which enables users to join the voice chat rooms, and communicate with each other.

<img width="1359" height="645" alt="image" src="https://github.com/user-attachments/assets/15376daa-2123-4f6d-98f0-fc62299e196f" />
<img width="1355" height="632" alt="image" src="https://github.com/user-attachments/assets/1be2b10a-1c28-47f9-8601-6e7b21248e6b" />
<img width="970" height="552" alt="image" src="https://github.com/user-attachments/assets/6d5cd38c-d2c2-4d9e-ad9b-82643306a13e" />

### Round Score
Shown after code is submitted. Displays the AI judge's verdict — overall status (Accepted / WA / TLE), score out of 100, time and space complexity, a per-test-case report, and a short analysis of what went right or wrong.
<img width="715" height="584" alt="image" src="https://github.com/user-attachments/assets/4a2ab2e9-3215-4a58-9827-8f592639e24f" />


### Round History
A session recap shown at the end of the session. Lists every problem attempted, who drove it, whether it was accepted, and the AI's analysis for each round. Shows the team's overall success rate.
<img width="636" height="460" alt="image" src="https://github.com/user-attachments/assets/9af8c460-a7d7-43de-adfb-5006c1f89d0a" />


### Tech Stack Used
Frontend - React + Vite + TailwindCSS 
Backend - Node.js + Express 
Database - Firebase Realtime Database 
Auth - Firebase Auth (Google + Anonymous) 
LLM - Google Gemini 2.5 Flash
Voice Chat - WebRTC via simple-peer 


## License

MIT
