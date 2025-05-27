const API_BASE_URL = '/api';

function goHome() {
    window.location.href = "homePage.html";
}

function updateNavbar() {
    const navLinks = document.querySelector('.nav-links');
    if (!navLinks) return;

    const user = getUser();

    let loginLi = Array.from(navLinks.children).find(li => li.textContent.includes('Đăng nhập'));
    
    if (isLoggedIn() && user) {
        if (loginLi) navLinks.removeChild(loginLi);

        if (!document.getElementById('nav-user-info')) {
            const userInfoLi = document.createElement('li');
            userInfoLi.id = 'nav-user-info';
            userInfoLi.innerHTML = `<a href="#">Chào, ${user.fullName || user.email}</a>`;

            const logoutLi = document.createElement('li');
            logoutLi.id = 'nav-logout';
            const logoutButton = document.createElement('a');
            logoutButton.href = '#';
            logoutButton.textContent = 'Đăng xuất';
            logoutButton.onclick = (e) => {
                e.preventDefault();
                logout();
            };
            logoutLi.appendChild(logoutButton);

            const employerBtnLi = Array.from(navLinks.children).find(li => li.querySelector('.btn-employer'));
            if (employerBtnLi) {
                navLinks.insertBefore(userInfoLi, employerBtnLi);
                navLinks.insertBefore(logoutLi, employerBtnLi);
            } else {
                navLinks.appendChild(userInfoLi);
                navLinks.appendChild(logoutLi);
            }
        }
    } else {
        if (!loginLi && !document.getElementById('nav-user-info')) {
            loginLi = document.createElement('li');
            loginLi.innerHTML = `<a href="login.html">Đăng nhập</a>`;
             const employerBtnLi = Array.from(navLinks.children).find(li => li.querySelector('.btn-employer'));
            if (employerBtnLi) {
                navLinks.insertBefore(loginLi, employerBtnLi);
            } else {
                navLinks.appendChild(loginLi);
            }
        }
        const userInfoLi = document.getElementById('nav-user-info');
        const logoutLi = document.getElementById('nav-logout');
        if (userInfoLi) navLinks.removeChild(userInfoLi);
        if (logoutLi) navLinks.removeChild(logoutLi);
    }
}

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

    if (typeof updateNavbar === "function" && typeof getUser === "function") {
         updateNavbar();
    } else {
        console.warn("auth.js might not be loaded, navbar update might fail.");
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
            } else if (event.target.classList.contains('detail-btn-card')) {
                const jobId = event.target.dataset.jobId;
                if (jobId) {
                    window.location.href = `jobsDetail.html?id=${jobId}`;
                } else {
                    alert('Không tìm thấy ID việc làm.');
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
            <h3>Vị trí tuyển dụng: ${job.position}</a></h3>
            <span class="company">${job.company}</span>
            <span class="location">${job.location}</span>
            <span class="salary">${job.salary || 'Thỏa thuận'}</span>
            <div class="tags">
                <span class="tag ${getJobTypeClass(job.jobtype)}">${job.jobtype}</span>
                ${(job.tags && Array.isArray(job.tags)) ? job.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : ''}
            </div>
            <div class="job-card-actions"> 
                <button class="detail-btn-card" data-job-id="${job.id}">Xem chi tiết</button>
                <button class="apply-btn apply-btn-card" data-job-id="${job.id}" data-job-title="${job.position}">Ứng tuyển</button>
            </div>
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