chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'askQuestion') {
      const userQuestion = request.question;

      // Simulating a backend response (you can call your real backend API here)
      console.log('Question received:', userQuestion);

      // You can replace below with actual API call
      const dummyAnswer = `You asked: "${userQuestion}". This is a sample answer!`;

      sendResponse({ answer: dummyAnswer });
  }

  return true; // Important for async sendResponse
});
