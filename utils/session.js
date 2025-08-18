// utils/session.js
export function getSessionId() {
  let sessionId = localStorage.getItem("sessionId");
  if (!sessionId) {
    sessionId = crypto.randomUUID(); // generate a unique session ID
    localStorage.setItem("sessionId", sessionId);
  }
  return sessionId;
}
