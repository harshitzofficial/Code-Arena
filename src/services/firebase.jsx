import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { createContext, useContext, useState, useEffect } from "react";
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { linkWithPopup } from "firebase/auth";

import { getDatabase, ref, set, remove, off, get, onValue, child, push, update , onChildAdded, onChildChanged} from "firebase/database";

// const starCountRef = ref(db, 'posts/' + postId + '/starCount');
// onValue(starCountRef, (snapshot) => {
//   const data = snapshot.val();
//   updateStarCount(postElement, data);
// });



function subscribeToRoom(roomId, callback) {
  const db = getDatabase();


  const roomRef = ref(db, `root/rooms/${roomId}`);

  const unsubscribe = onValue(roomRef, (snapshot) => {
    const data = snapshot.val();
    callback(data); 
  });

  return unsubscribe;
}

function subscribeToEditor(roomId, callback) {
  const db = getDatabase();

  const roomRef = ref(db, `root/liveContent/${roomId}/editor/`);

  const unsubscribe = onValue(roomRef, (snapshot) => {
    const data = snapshot.val();
    callback(data); 
  });

  return unsubscribe;
}

function writeCode(roomId, data, link = '') {
  const db = getDatabase();


  update(ref(db, `root/liveContent/${roomId}/editor/${link}`), data).then(() => {
  })
    .catch((error) => {
    });;
}

function subscribeToChat(roomId, callback) {
  const db = getDatabase();

  const roomRef = ref(db, `root/liveContent/${roomId}/chat/`);

  const unsubscribe = onChildAdded(roomRef, (snapshot) => {
    const newMsg = snapshot.val();
    callback(newMsg); 
  });



  return unsubscribe;
}


async function sendMsg(roomId, data, link = 'msg') {
  const db = getDatabase();


  push(ref(db, `root/liveContent/${roomId}/chat/`), data).then(() => {
  })
    .catch((error) => {
      console.log("Error Saving chat Data", error);
    });;
}

const authenticate = async (uid) => {

}

const getRoomData = async (roomId, path = '') => {
  const db = getDatabase();

  const dbRef = ref(db);
  const room_snapshot = await get(child(dbRef, `root/rooms/${roomId}/${path}`));

  if (room_snapshot.exists()) {
    return (room_snapshot.val()); 
  } else {
    console.log("No room found");
    return null;
  }
};

function writeRoomData(data, link) {
  const db = getDatabase();

  set(ref(db, 'root/rooms/' + link), data).then(() => {
  })
    .catch((error) => {
      console.log("Error Saving Room Data", error);
    });;
}

async function updateRoomData(data, room_id, path) {
  const db = getDatabase();

  const Ref = ref(db, `root/rooms/${room_id}/${path}`);

  await update(Ref, data);


}

function writeUserData(data, link) {
  const db = getDatabase();

  set(ref(db, 'root/users/' + link), data).then(() => {
  })
    .catch((error) => {
      console.log("Error Saving User Data", error);
    });;
}







const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const Firebasecontext = createContext(null);





const handleGoogleSignIn = async () => {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
    prompt: 'select_account'
  });

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    return user; 
  } catch (error) {
    if (
      error.code === 'auth/popup-closed-by-user' ||
      error.code === 'auth/cancelled-popup-request' ||
      error.code === 'auth/popup-blocked'
    ) {
      return null;
    }
    console.error("Authentication Error:", error.message);
    alert("Failed to sign in. Please try again.");
    return null;
  }
};

async function pushWhiteboardStroke(roomId, stroke) {
  const db = getDatabase();
  const strokesRef = ref(db, `root/liveContent/${roomId}/whiteboard/strokes`);
  await push(strokesRef, stroke);
}

function subscribeToWhiteboardStrokes(roomId, onStroke) {
  const db = getDatabase();
  const strokesRef = ref(db, `root/liveContent/${roomId}/whiteboard/strokes`);
  return onChildAdded(strokesRef, (snapshot) => {
    onStroke({ key: snapshot.key, stroke: snapshot.val() });
  });
}


function subscribeToWhiteboardClear(roomId, onClear) {
  const db = getDatabase();
  const strokesRef = ref(db, `root/liveContent/${roomId}/whiteboard/strokes`);
  return onValue(strokesRef, (snapshot) => {
    if (!snapshot.exists()) onClear();
  });
}

async function clearWhiteboard(roomId) {
  const db = getDatabase();
  const strokesRef = ref(db, `root/liveContent/${roomId}/whiteboard/strokes`);
  await remove(strokesRef);
}



export const FirebaseProvider = (props) => {
  return (
    <Firebasecontext.Provider value={{ handleGoogleSignIn, sendMsg, subscribeToEditor, subscribeToChat, writeCode, subscribeToRoom, updateRoomData, writeRoomData, writeUserData, getRoomData, ensureAnonymousUser, pushWhiteboardStroke, subscribeToWhiteboardStrokes, subscribeToWhiteboardClear, clearWhiteboard }}>
      {props.children}
    </Firebasecontext.Provider>
  )
};

export const useFirebase = () => useContext(Firebasecontext);
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);



export const ensureAnonymousUser = () => {
  const auth = getAuth();
  return new Promise((resolve, reject) => {

    signInAnonymously(auth)
      .then(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
            unsubscribe();
            resolve(user);
          }
        });
      })
      .catch(reject);
  });
};