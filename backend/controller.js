import { useState } from "react";
import { db } from "./config/firebase-admin.js";
import { LeetCode } from "leetcode-query";
let problemSet = [];
let seenProbs = [];

const lc = new LeetCode();

async function seedDatabase() {
    try {
        console.log('Auto-Seed: Fetching problems from LeetCode...');
        const problemList = await lc.problems({ limit: 2000 });
        // const data = JSON.stringify(problemList.questions, null, 2);

        await db.ref('problemList/').set(problemList.questions);



        console.log(`Success! Seeded ${problemList.questions.length} problems into Firebase.`);
    } catch (error) {
        console.error(" Auto-Seed Failed:", error.message);
    }
}

async function fetchProblems() {

    const probs = await db.ref('problemList/').get();


    if (!probs.exists()) {
        await seedDatabase();

        let data = probs.val();
        data = Array.isArray(data) ? data : Object.values(data);

        const cleanProblems = data?.map(prob => {
            return {
                id: prob.questionFrontendId,
                title: prob.title,
                slug: prob.titleSlug,
                difficulty: prob.difficulty,
                tags: prob.topicTags ? prob.topicTags.map(tag => tag.name) : []
            };
        });
        return cleanProblems;


    }

    else {

        let data = probs.val();
        data = Array.isArray(data) ? data : Object.values(data);

        const cleanProblems = data?.map(prob => {
            return {
                id: prob.questionFrontendId,
                title: prob.title,
                slug: prob.titleSlug,
                difficulty: prob.difficulty,
                tags: prob.topicTags ? prob.topicTags.map(tag => tag.name) : []
            };
        });
        return cleanProblems;

    }


}

export async function initGame(roomId) {

    problemSet = await fetchProblems();
    console.log('room', roomId);
    const allTags = [...new Set(problemSet.flatMap(prob => prob.tags))];


    //once this is done, we have the probls set, noow assign a driver based on participants list
    chooseDriver(roomId);

    console.log(allTags);
    return allTags;


    // console.log('p', probs);

}

async function getProblemDetails(topic, difficulty) {
    try {
        if (!problemSet || problemSet.length == 0) {
            problemSet = await fetchProblems();
            console.log('heyyy')
        }

        if (problemSet.length != 0) {
            const eligibleProblems = problemSet.filter(prob =>
                prob.difficulty === difficulty &&
                prob.tags.includes(topic) && (!seenProbs.includes(prob.id))
            );
            if (eligibleProblems.length === 0) {
                console.warn("No problems found for these criteria!");
                return null;
            }

            const randomIndex = Math.floor(Math.random() * eligibleProblems.length);
            const problem_id = eligibleProblems[randomIndex].id;
            const problem_slug = eligibleProblems[randomIndex].slug;


            try {
                const problem = await lc.problem(problem_slug);

                console.log("Fetched Problem:", problem.title);
                seenProbs.push(problem_id);

                return problem;
            } catch (error) {
                console.error("Error fetching problem details:", error);
            }
        }

    } catch (err) {
        console.error("Failed to load problem set:", err);
        return res.status(500).json({ error: "Database load failed" });
    }



}

export function normalizeTestCases(testCases) {
    return testCases.map(tc => ({
        stdin: tc.stdin
            .trim()
            .replace(/\r\n/g, "\n"), // windows safety
        expected: tc.expected
            .trim()
            .replace(/\s+/g, "")     // remove spaces/newlines
    }));
}


export async function setProblem(roomId, topic, difficulty) {

    console.log('prob is', topic, difficulty)
    const problem = await getProblemDetails(topic, difficulty);

    console.log('2');
    const duration = await db.ref(`root/rooms/${roomId}/config/timer`).get();
    const round = await db.ref(`root/rooms/${roomId}/gameState/currentRound`).get();

    const startTime = Date.now();
    const endTime = startTime + (duration.val() * 60 * 1000);

    const updates = {
        'gameState/currentProblem': problem,
        'gameState/timerStartTime': startTime,
        'gameState/timerEndTime': endTime,
        'gameState/roundStatus': 'coding',
        'gameState/currentRound': round.val() + 1,
        // Add the new problem to seenProbs
    };

    console.log('iu', updates);

    await db.ref(`root/rooms/${roomId}/`).update(updates);



    //set the problem into the firebase as active problem

    //update the current round and states, make status as coding, and catch it in frontend
    //also initialise the timer with the confi time , 
    //store the prob start and end time and store it in the gamestaate/

}

async function chooseDriver(roomId) {
    // 1. Get the current room data
    const roomSnap = await db.ref(`root/rooms/${roomId}`).get();
    if (!roomSnap.exists()) return;

    const roomData = roomSnap.val();
    const gameState = roomData.gameState;

    // 2. Get participants and current driver from existing structure [cite: 2025-12-25]
    const participantsObj = gameState.participants_list;
    const currentDriverId = gameState.driver_id;

    if (!participantsObj) return;

    // 3. Convert object keys to a sorted array to ensure consistent order
    const userIds = Object.keys(participantsObj).sort();

    // 4. Find where the current driver is in that list
    const currentIndex = userIds.indexOf(currentDriverId);

    // 5. Logic: If driver not found or at end of list, pick index 0. Otherwise, index + 1.
    const nextIndex = (currentIndex === -1 || currentIndex === userIds.length - 1)
        ? 0
        : currentIndex + 1;

    const selectedDriverId = userIds[nextIndex];

    // 6. Update ONLY the existing driver_id field [cite: 2025-12-25]
    await db.ref(`root/rooms/${roomId}/gameState/driver_id`).set(selectedDriverId);

    console.log(`Rotated from ${currentDriverId} to ${selectedDriverId}`);
}

export const runCode = async (roomId, results) => {


    const updates = {

        'gameState/roundStatus': 'executed',
        'gameState/judgeResults': results

        // Add the new problem to seenProbs
    };
    await db.ref(`root/rooms/${roomId}/`).update(updates);
    console.log('added run results to room');

}

export const submitCode = async (roomId, results) => {

    console.log('submit code')

    //append the prev prob to round history -> rooms/roomId/roundHistory/ round_no:{score, analysis, time_take, driver:}
    const snapshot = await db.ref(`root/rooms/${roomId}/gameState/currentRound`).get();

    // 2. Extract the actual value (e.g., 1, 2, 3)
    const currentRound = snapshot.exists() ? snapshot.val() : 1;
    console.log('round', currentRound);
    const updates = {
        'gameState/roundStatus': 'submitted',
        'gameState/judgeResults': results, // ADD THIS so the useEffect can find it
        [`roundHistory/${currentRound}`]: results
    };
    console.log('submit done')

    await db.ref(`root/rooms/${roomId}/`).update(updates);

    console.log('added submit results to room');

}



export const initiatenextRound = async (roomId) => {
    //first chk for no of rounds done and how many are pending
    let snapshot = await db.ref(`root/rooms/${roomId}/gameState/currentRound`).get();
    const currentRound = snapshot.exists() ? snapshot.val() : 1;
    console.log('round', currentRound);
    snapshot = await db.ref(`root/rooms/${roomId}/config/max_prob`).get();
    const maxrounds = snapshot.exists() ? snapshot.val() : 1;
    console.log('roundss', maxrounds);

    if (maxrounds <= currentRound) {
        const updates = {

            'gameState/gameStatus': "ended",
            'gameState/gameUrl': `/${roomId}/results/`

        };
        await db.ref(`root/rooms/${roomId}/`).update(updates);

    }

    else {
        await chooseDriver(roomId);

        const updates = {

            'gameState/roundStatus': 'initialising',

        };
        await db.ref(`root/rooms/${roomId}/`).update(updates);
    }

    //update timer start and timer end time
    //this is called after judgement is done, and then update the whole session at redirecting it to the end page

}

const judge = () => {
    // 
    //
}

export default problemSet;

