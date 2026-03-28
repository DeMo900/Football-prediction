const form = document.getElementById("email-form");
const errorMsg = document.getElementById("error");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;

  try {
    const response = await fetch("/submitemail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (response.status === 400 || response.status === 404) {
      errorMsg.textContent = data.msg || "An error occurred";
      errorMsg.classList.remove("text-font");
      errorMsg.classList.add("text-red-500");
    } else if (response.status === 200 || response.ok) {
      errorMsg.textContent =
        data.msg || data.message || "check your email please";
      errorMsg.classList.remove("text-red-500");
      errorMsg.classList.add("text-font");
    } else {
      errorMsg.textContent = data.msg || "An unexpected error occurred";
      errorMsg.classList.remove("text-font");
      errorMsg.classList.add("text-red-500");
    }
  } catch (err) {
    console.error(err);
    errorMsg.textContent = "Network error. Please try again.";
    errorMsg.classList.remove("text-font");
    errorMsg.classList.add("text-red-500");
  }
});
