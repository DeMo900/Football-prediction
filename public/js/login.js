const loginBtn = document.getElementById('loginBtn');
const error = document.getElementById('error'); 
loginBtn.onclick = async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ identifier: email, password })
        });

        if (response.status === 400 || response.status ===401) {
            const data = await response.json();
        error.textContent = data.msg;
        } else if (!response.ok) {
            const data = await response.json();
        console.log(data)
        } else {
            window.location.href = '/dashboard';
        }
    } catch (error) {
        console.log(error);
    }
};
