// Simple chatbot placeholder for wellness check
document.getElementById("chatbotBtn").addEventListener("click", () => {
  const mood = prompt("Hi! How are you feeling today? 😊");
  if(mood) alert(`Thanks for sharing! Remember, it's okay to feel ${mood}.`);
});
