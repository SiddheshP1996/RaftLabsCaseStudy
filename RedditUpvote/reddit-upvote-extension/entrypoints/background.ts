export default defineBackground(() => {
  chrome.runtime.onInstalled.addListener(() => {
    console.log("Reddit Upvote All extension installed.");
  });
});
