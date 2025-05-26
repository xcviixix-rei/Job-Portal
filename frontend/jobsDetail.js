const API_BASE_URL = 'http://localhost:8080/api';

function goHome() {
    window.location.href = "homePage.html";
}

function getJobTypeClass(type) {
    if (!type) return '';
    if (type.toLowerCase() === 'full-time') return 'fulltime';
    if (type.toLowerCase() === 'part-time') return 'parttime';
    if (type.toLowerCase() === 'remote') return 'remote';
    return '';
}

document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const jobId = params.get('id');
    const container = document.getElementById('jobDetailContainer');

    if (!jobId) {
        container.innerHTML = '<p>ID việc làm không hợp lệ.</p>';
        return;
    }

    container.innerHTML = '<p>Đang tải chi tiết việc làm...</p>';

    try {
        const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`);
        if (!response.ok) {
            if (response.status === 404) {
                container.innerHTML = '<p>Không tìm thấy thông tin việc làm.</p>';
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return;
        }
        const job = await response.json();
        const logoUrl = job.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company.substring(0,1))}&background=random&size=60`;


        container.innerHTML = `
            <h1>${job.position}</h1>
            <div class="company-info">
                <img src="${logoUrl}" alt="${job.company} logo">
                <div>
                    <div class="company-name">${job.company}</div>
                    <div>${job.location}</div>
                </div>
            </div>
            <div class="job-meta">
                <span><strong>Mức lương:</strong> ${job.salary || 'Thỏa thuận'}</span>
                <span><strong>Loại hình:</strong> <span class="tag ${getJobTypeClass(job.jobtype)}">${job.jobtype}</span></span>
            </div>
            <h3 class="description-title">Mô tả công việc</h3>
            <div class="description-content">
                ${job.description.replace(/\n/g, '<br>')}
            </div>
            <button
                class="apply-btn-card"
                onclick="window.location.href='apply.html?job_title=${encodeURIComponent(job.position)}&job_id=${job.id}'">
                Ứng tuyển ngay
            </button>
        `;
    } catch (error) {
        console.error('Failed to load job details:', error);
        container.innerHTML = '<p style="color:red;">Lỗi tải chi tiết việc làm. Vui lòng thử lại sau.</p>';
    }
});