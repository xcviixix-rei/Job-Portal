import { getJobTypeClass } from './jobsData';

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('job-list-container')) {
        // Load tất cả jobs ban đầu
        loadJobs(jobsData);
    }

    const searchBtn = document.getElementById('search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            performSearch();
        });
    }
    
    const jobKeywordInput = document.getElementById('job-keyword');
    const jobLocationInput = document.getElementById('job-location');

    if(jobKeywordInput) {
        jobKeywordInput.addEventListener('keypress', function(event) {
            if (event.key === "Enter") {
                event.preventDefault();
                performSearch();
            }
        });
    }
    if(jobLocationInput) {
        jobLocationInput.addEventListener('keypress', function(event) {
            if (event.key === "Enter") {
                event.preventDefault();
                performSearch();
            }
        });
    }


    const companyBtns = document.querySelectorAll('.company-btn');
    if (companyBtns) {
        companyBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                alert('Chức năng xem thông tin công ty chi tiết sẽ được phát triển sau! (Demo)');
            });
        });
    }

    const jobListContainer = document.getElementById('job-list-container');
    if (jobListContainer) {
        jobListContainer.addEventListener('click', function(event) {
            if (event.target.classList.contains('apply-btn-card')) {
                const jobTitle = event.target.dataset.jobTitle;
                if (jobTitle) {
                    window.location.href = `apply.html?job_title=${encodeURIComponent(jobTitle)}`;
                } else {
                    window.location.href = 'apply.html';
                }
            }
        });
    }
});

function performSearch() {
    const keyword = document.getElementById('job-keyword').value.trim().toLowerCase();
    const location = document.getElementById('job-location').value.trim().toLowerCase();

    if (!keyword && !location) {
        // Hiển thị lại tất cả nếu không có từ khóa
        loadJobs(jobsData);
        return;
    }

    const filteredJobs = jobsData.filter(job => {
        const titleMatch = job.title.toLowerCase().includes(keyword);
        const companyMatch = job.company.toLowerCase().includes(keyword);
        const descriptionMatch = job.description.toLowerCase().includes(keyword);
        const locationMatch = job.location.toLowerCase().includes(location);

        const keywordCondition = keyword ? (titleMatch || companyMatch || descriptionMatch) : true;
        const locationCondition = location ? locationMatch : true;
        
        return keywordCondition && locationCondition;
    });

    loadJobs(filteredJobs);

    if (filteredJobs.length === 0) {
        const jobListContainer = document.getElementById('job-list-container');
        if (jobListContainer) {
            jobListContainer.innerHTML = '<p style="text-align:center; width:100%;">Không tìm thấy việc làm phù hợp với tìm kiếm của bạn.</p>';
        }
    }
}

function loadJobs(jobsToLoad) {
    const jobListContainer = document.getElementById('job-list-container');
    if (!jobListContainer) return;

    jobListContainer.innerHTML = '';

    if (jobsToLoad.length === 0) {
        jobListContainer.innerHTML = '<p style="text-align:center; width:100%;">Hiện chưa có tin tuyển dụng nào.</p>';
        return;
    }

    jobsToLoad.forEach(job => {
        const jobCard = document.createElement('div');
        jobCard.classList.add('job-card');
        jobCard.innerHTML = `
            <img src="${job.logo || 'https://via.placeholder.com/48'}" alt="${job.company} Logo" class="company-logo">
            <h3><a href="job-details.html?id=${job.id}" style="text-decoration:none; color:inherit;">${job.title}</a></h3>
            <span class="company">${job.company}</span>
            <span class="location">${job.location}</span>
            <span class="salary">${job.salary}</span>
            <div class="tags">
                ${job.tags.map(tag => `<span class="tag ${getJobTypeClass(tag)}">${tag}</span>`).join('')}
            </div>
            <button class="apply-btn apply-btn-card" data-job-title="${job.title}">Ứng tuyển</button>
        `;
        jobListContainer.appendChild(jobCard);
    });
}