document.addEventListener('DOMContentLoaded', function () {
    const wrapper = document.querySelector('.wrapper');
    const loginLink = document.querySelector('.login-link');
    const forgotLink = document.querySelector('.forgot-link');
    const forgotbackLink = document.querySelector('.forgot-back');
    const registerLink = document.querySelector('.register-link');

    registerLink.addEventListener('click', () => {
        wrapper.classList.add('register');
        wrapper.classList.remove('login', 'forgot');
    });

    loginLink.addEventListener('click', () => {
        wrapper.classList.add('login');
        wrapper.classList.remove('register', 'forgot');
    });

    forgotLink.addEventListener('click', () => {
        wrapper.classList.add('forgot');
        wrapper.classList.remove('login', 'register');
    });

    forgotbackLink.addEventListener('click', () => {
        wrapper.classList.add('login');
        wrapper.classList.remove('forgot');
    });

    function validateLoginForm() {
        var user = document.getElementById("user").value;
        var password = document.getElementById("password").value;
        var userField = document.getElementById("user");
        var passwordField = document.getElementById("password");

        if (user.trim() === '') {
            document.getElementById("userError").innerHTML = "กรุณากรอกชื่อผู้ใช้";
            userField.classList.add("input-error");
            userField.focus();
            return false;
        } else {
            document.getElementById("userError").innerHTML = "";
            userField.classList.remove("input-error");
        }

        if (password.trim() === '') {
            document.getElementById("passwordError").innerHTML = "กรุณากรอกรหัสผ่าน";
            passwordField.classList.add("input-error");
            passwordField.focus();
            return false;
        } else {
            document.getElementById("passwordError").innerHTML = "";
            passwordField.classList.remove("input-error");
        }

        return true;
    }
});
