const updateBtn = document.getElementById('updateBtn');
const messageBox = document.getElementById('messageBox');

updateBtn.onclick = async (e) => {
    e.preventDefault();

    const password = document.getElementById('password').value;
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (!token) {
        messageBox.textContent = "Invalid or missing token.";
        messageBox.className = "text-red-500 text-sm mt-3 text-center";
        return;
    }

    try {
        const response = await fetch(`/updatepassword?token=${token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ password })
        });

        const data = await response.json();

        if (response.status === 400 || response.status === 404) {
            messageBox.textContent = data.msg || "An error occurred";
            messageBox.className = "text-red-500 text-sm mt-3 text-center";
        } else if (response.ok) {
            messageBox.textContent = data.message || "Password reset successfully!";
            messageBox.className = "text-green-500 text-sm mt-3 text-center";
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);
        } else {
            messageBox.textContent = data.msg || data.message || "An error occurred";
            messageBox.className = "text-red-500 text-sm mt-3 text-center";
        }
    } catch (error) {
        console.error("Error:", error);
        messageBox.textContent = "An error occurred. Please try again.";
        messageBox.className = "text-red-500 text-sm mt-3 text-center";
    }
};
