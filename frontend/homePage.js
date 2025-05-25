const API_BASE_URL = 'http://localhost:8080/api';

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('job-list-container')) {
        loadJobsFromAPI();
    }

    const searchBtn = document.getElementById('search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearchWithAPI);
    }

    const companyBtns = document.querySelectorAll('.company-btn');
    if (companyBtns) {
        companyBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                alert('Chức năng xem thông tin công ty chi tiết sẽ được phát triển sau!');
            });
        });
    }

    const jobListContainer = document.getElementById('job-list-container');
    if (jobListContainer) {
        jobListContainer.addEventListener('click', function(event) {
            if (event.target.classList.contains('apply-btn-card')) {
                const jobTitle = event.target.dataset.jobTitle;
                const jobId = event.target.dataset.jobId;
                if (jobTitle && jobId) {
                    window.location.href = `apply.html?job_title=${encodeURIComponent(jobTitle)}&job_id=${jobId}`;
                } else {
                    window.location.href = 'apply.html';
                }
            }
        });
    }
});

async function performSearchWithAPI() {
    const keyword = document.getElementById('job-keyword').value.trim().toLowerCase();
    const location = document.getElementById('job-location').value.trim().toLowerCase();

    try {
        const response = await fetch(`${API_BASE_URL}/jobs`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        let jobsToLoad = await response.json();

        if (keyword || location) {
            jobsToLoad = jobsToLoad.filter(job => {
                const titleMatch = job.position.toLowerCase().includes(keyword);
                const companyMatch = job.company.toLowerCase().includes(keyword);
                const descriptionMatch = job.description.toLowerCase().includes(keyword);
                const locationMatch = job.location.toLowerCase().includes(location);

                const keywordCondition = keyword ? (titleMatch || companyMatch || descriptionMatch) : true;
                const locationCondition = location ? locationMatch : true;
                
                return keywordCondition && locationCondition;
            });
        }
        renderJobs(jobsToLoad);
        if (jobsToLoad.length === 0) {
            const jobListContainer = document.getElementById('job-list-container');
            if (jobListContainer) {
                jobListContainer.innerHTML = '<p style="text-align:center; width:100%;">Không tìm thấy việc làm phù hợp.</p>';
            }
        }
    } catch (error) {
        console.error("Failed to fetch or filter jobs:", error);
        const jobListContainer = document.getElementById('job-list-container');
        if(jobListContainer) jobListContainer.innerHTML = '<p style="text-align:center; width:100%; color:red;">Lỗi tải dữ liệu việc làm.</p>';
    }
}

async function loadJobsFromAPI() {
    const jobListContainer = document.getElementById('job-list-container');
    if (!jobListContainer) return;
    jobListContainer.innerHTML = '<p style="text-align:center; width:100%;">Đang tải việc làm...</p>';

    try {
        const response = await fetch(`${API_BASE_URL}/jobs`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jobs = await response.json();
        renderJobs(jobs);
    } catch (error) {
        console.error("Failed to load jobs:", error);
        jobListContainer.innerHTML = '<p style="text-align:center; width:100%; color:red;">Không thể tải danh sách việc làm. Vui lòng thử lại sau.</p>';
    }
}

function renderJobs(jobsToLoad) {
    const jobListContainer = document.getElementById('job-list-container');
    jobListContainer.innerHTML = '';

    if (jobsToLoad.length === 0) {
        jobListContainer.innerHTML = '<p style="text-align:center; width:100%;">Hiện chưa có tin tuyển dụng nào.</p>';
        return;
    }

    jobsToLoad.forEach(job => {
        const jobCard = document.createElement('div');
        jobCard.classList.add('job-card');
        // Giả sử logo không có trong dữ liệu trả về từ API ban đầu, có thể thêm sau
        const logoUrl = job.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company.substring(0,1))}&background=random&size=48`;
        jobCard.innerHTML = `
            <img src="${logoUrl}" alt="${job.company} Logo" class="company-logo">
            <h3><a href="job-details.html?id=${job.id}" style="text-decoration:none; color:inherit;">${job.position}</a></h3>
            <span class="company">${job.company}</span>
            <span class="location">${job.location}</span>
            <span class="salary">${job.salary || 'Thỏa thuận'}</span>
            <div class="tags">
                <span class="tag ${getJobTypeClass(job.jobtype)}">${job.jobtype}</span>
                ${(job.tags && Array.isArray(job.tags)) ? job.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : ''}
            </div>
            <button class="apply-btn apply-btn-card" data-job-id="${job.id}" data-job-title="${job.position}">Ứng tuyển</button>
        `;
        jobListContainer.appendChild(jobCard);
    });
}

function getJobTypeClass(type) {
    if (!type) return '';
    if (type.toLowerCase() === 'full-time') return 'fulltime';
    if (type.toLowerCase() === 'part-time') return 'parttime';
    if (type.toLowerCase() === 'remote') return 'remote';
    return '';
}