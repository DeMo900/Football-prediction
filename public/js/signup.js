const signupBtn = document.getElementById("signupBtn");
const errorMsg = document.getElementById("errorMsg");

signupBtn.onclick = async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("cpassword").value;

  try {
    const response = await fetch("/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password, confirmPassword }),
    });

    if (response.status === 400 || response.status === 401) {
      const data = await response.json();
      errorMsg.textContent = data.msg || "An error occurred";
    } else if (response.ok) {
      window.location.href = "/login";
    } else {
      const data = await response.json();
      errorMsg.textContent = data.msg || "An error occurred";
    }
  } catch (error) {
    console.error("Error:", error);
    errorMsg.textContent = "An error occurred. Please try again.";
  }
};
