export default defineContentScript({
  matches: ["*://www.reddit.com/r/*/comments/*"],

  main() {
    const createUpvoteButton = (): void => {
      const button = document.createElement("button");
      button.innerText = "Upvote All";
      button.style.position = "fixed";
      button.style.bottom = "20px";
      button.style.right = "20px";
      button.style.padding = "2px 20px";
      button.style.zIndex = "1000";
      button.style.backgroundColor = "#ff4500";
      button.style.color = "#fff";
      button.style.border = "none";
      button.style.cursor = "pointer";
      button.style.fontSize = "16px";

      button.addEventListener("click", upvoteAllComments);

      document.body.appendChild(button);
    };

    const upvoteAllComments = async (): Promise<void> => {
      const delay = (ms: number): Promise<void> =>
        new Promise((resolve) => setTimeout(resolve, ms));

      const scrollToBottom = async (): Promise<void> => {
        let lastHeight = document.body.scrollHeight;
        window.scrollTo(0, lastHeight);
        await delay(2000);

        // Check for dynamically loaded comments
        while (document.body.scrollHeight > lastHeight) {
          lastHeight = document.body.scrollHeight;
          window.scrollTo(0, lastHeight);
          await delay(2000);
        }
      };

      const getUpvoteButtons = (): HTMLElement[] => {
        return Array.from(document.querySelectorAll('[aria-label="upvote"]'));
      };

      const performUpvote = async (): Promise<void> => {
        await scrollToBottom();

        const upvoteButtons = getUpvoteButtons();
        if (upvoteButtons.length === 0) {
          alert("No comments or replies to upvote.");
          return;
        }

        let upvotedCount = 0; // Counter for upvoted comments
        console.log(`Found ${upvoteButtons.length} upvote buttons.`); // Debug log

        for (const button of upvoteButtons) {
          if (!button.classList.contains("upvoted")) {
            try {
              button.click();
              upvotedCount++;
              console.log(`Upvoted button: ${button}`); // Debug log
              await delay(1000 + Math.random() * 2000); // 1-3 second delay
            } catch (error) {
              console.error("Error upvoting:", error);
            }
          }
        }

        // Alert with the total count of upvoted comments
        if (upvotedCount > 0) {
          alert(`Successfully upvoted ${upvotedCount} comment(s)!`);
        } else {
          alert("All comments are already upvoted.");
        }
      };

      await performUpvote();
    };

    // Inject the button into the Reddit post page
    createUpvoteButton();
  },
});
