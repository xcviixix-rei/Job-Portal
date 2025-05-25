
const API_BASE_URL = 'http://localhost:8080/api';

function goHome() {
    window.location.href = "homePage.html";
}

document.getElementById("employerForm").addEventListener("submit", async function(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const jobData = Object.fromEntries(formData.entries());

    if (!jobData.company || !jobData.position || !jobData.description) {
        alert("Vui lòng điền đầy đủ thông tin bắt buộc: Tên công ty, Vị trí, Mô tả.");
        return;
    }

    const submitButton = e.target.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Đang đăng...';

    try {
        const response = await fetch(`${API_BASE_URL}/jobs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(jobData),
        });

        if (response.ok) {
            const result = await response.json();
            alert("Tin tuyển dụng đã được đăng thành công! ID: " + result.id);
            e.target.reset();
            goHome();
        } else {
            const errorData = await response.json();
            alert("Lỗi khi đăng tin: " + (errorData.message || response.statusText));
        }
    } catch (error) {
        console.error('Error posting job:', error);
        alert("Đã xảy ra lỗi. Vui lòng thử lại. Chi tiết: " + error.message);
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Đăng tin';
    }
});