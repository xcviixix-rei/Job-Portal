const API_BASE_URL = 'http://localhost:8080/api';

function goHome() {
    window.location.href = "homePage.html";
}

let jobIdToApply = null;

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const jobTitle = params.get('job_title');
    jobIdToApply = params.get('job_id');

    if (jobTitle) {
        const positionInput = document.querySelector('input[name="position"]');
        if (positionInput) {
            positionInput.value = decodeURIComponent(jobTitle);
        }
    }
});

document.getElementById("applyForm").addEventListener("submit", async function(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const applicationData = Object.fromEntries(formData.entries());

    if (jobIdToApply) {
        applicationData.jobId = jobIdToApply;
    }

    const cvFile = formData.get('cvfile');

    if (!applicationData.fullname || !applicationData.email || !applicationData.position || !cvFile || cvFile.size === 0) {
        alert("Vui lòng điền đầy đủ thông tin bắt buộc: Họ tên, Email, Vị trí và tải lên CV.");
        return;
    }

    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Đang nộp...';

    // Đọc file CV thành base64 để gửi
    const reader = new FileReader();
    reader.readAsDataURL(cvFile);
    reader.onload = async () => {
        applicationData.cvfile_content = reader.result; // base64 string
        applicationData.cvfile_name = cvFile.name;
        delete applicationData.cvfile; // Xóa key 'cvfile' vì đã xử lý

        try {
            const response = await fetch(`${API_BASE_URL}/applications`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(applicationData),
            });

            if (response.ok) {
                const result = await response.json();
                console.log("Bạn đã nộp hồ sơ thành công! " + (result.message || ''));
                form.reset();
                goHome();
            } else {
                let errorMessage = `Lỗi ${response.status}: ${response.statusText}`;
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    const errorData = await response.json();
                    errorMessage = `Lỗi khi nộp hồ sơ: ${errorData.message || response.statusText}`;
                    console.error("API call failed (JSON), error data:", errorData);
                } else {
                    const errorText = await response.text();
                    console.error("API call failed (Non-JSON), response text:", errorText);
                }
                alert(errorMessage);
            }
        } catch (error) {
            console.error('Error submitting application:', error);
            alert("Đã xảy ra lỗi. Vui lòng thử lại. " + error.message);
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Nộp hồ sơ';
        }
    };
    reader.onerror = (error) => {
        console.error('Error reading file:', error);
        alert('Lỗi khi đọc file CV.');
        submitButton.disabled = false;
        submitButton.textContent = 'Nộp hồ sơ';
    };
});