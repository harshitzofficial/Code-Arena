# Code-Arena

**Code Arena** is a real-time collaborative coding platform, inspired by how Skribbl works, built for pairs and small teams to practice DSA problems colaboaratively. LeetCode — but live, with friends, a voice chat, a shared whiteboard, and an AI judge that scores your code on the spot.

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

<img width="1891" height="917" alt="image" src="https://github.com/user-attachments/assets/ecf265f7-40f8-4198-bbd9-440f50d6cc0a" />
<img width="605" height="424" alt="image" src="https://github.com/user-attachments/assets/9c1cb325-a245-46d4-ac54-3b01e51ca0b0" />



### Lobby
Where the host configures the session before it starts — set the timer duration for each problem, max number of problems in one session(depending on no of participants, note: once selected this no cant be changed during the whole game session), and see who's joined. Participants wait in the lobby until the host starts the session.
Once joined, one of the participants will be able to see the Problem Picking Window, where they can choose which topic they want to practice, and what difficulty.

<img width="1857" height="907" alt="image" src="https://github.com/user-attachments/assets/799a209d-305f-420b-a6d9-a8cb2ce4eb02" />



### Room
The main coding arena. Split into three panels:

- **Problem Panel** — displays the active DSA problem with full description
- **Editor Panel** — a collaborative integrated Monaco code editor synced in real time across all participants, with language selection, a countdown timer, and run/submit controls. Only the driver is allowed to submit the code or run it, other users or guests can only see whats happening. There is also an integrated whiteboard where users can do some visualisations and practice dry runs. 
- **Chat + Voice Panel** — live group chat and one-click WebRTC voice chat which enables users to join the voice chat rooms, and communicate with each other.
<img width="1919" height="912" alt="image" src="https://github.com/user-attachments/assets/4a502aaf-5d15-44ce-bb70-b4340f61521d" />
<img width="1919" height="906" alt="image" src="https://github.com/user-attachments/assets/74c4b5ec-e0f5-4944-999b-a7cf871b58a2" />


### Round Score
Shown after code is submitted. Displays the AI judge's verdict — overall status (Accepted / WA / TLE), score out of 100, time and space complexity, a per-test-case report, and a short analysis of what went right or wrong.
<img width="818" height="708" alt="image" src="https://github.com/user-attachments/assets/1e967734-cd82-4265-a569-991e792918fb" />



### Round History
A session recap shown at the end of the session. Lists every problem attempted, who drove it, whether it was accepted, and the AI's analysis for each round. Shows the team's overall success rate.
<img width="1919" height="910" alt="image" src="https://github.com/user-attachments/assets/25ae0d3f-e1fd-491b-99a8-838f74db57cc" />



### Tech Stack Used
Frontend - React + Vite + TailwindCSS 
Backend - Node.js + Express 
Database - Firebase Realtime Database 
Auth - Firebase Auth (Google + Anonymous) 
LLM - Google Gemini 2.5 Flash
Voice Chat - WebRTC via simple-peer 


## License

MIT
