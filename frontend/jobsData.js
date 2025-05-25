// jobs_data.js
const jobsData = [
    {
        id: 1,
        title: "Giáo viên Tiếng Anh",
        company: "Trường THPT Nguyễn Trãi",
        location: "Hà Nội",
        salary: "10-15 triệu/tháng",
        type: "Full-time",
        description: "Dạy Tiếng Anh cho học sinh cấp 3. Yêu cầu kinh nghiệm giảng dạy ít nhất 2 năm, có chứng chỉ sư phạm và IELTS 7.0 trở lên. Môi trường làm việc năng động, chuyên nghiệp.",
        logo: "https://cdn-icons-png.flaticon.com/512/3032/3032931.png",
        tags: ["Full-time"]
    },
    {
        id: 2,
        title: "Kỹ sư xây dựng",
        company: "Công ty Xây dựng Hòa Bình",
        location: "TP.HCM",
        salary: "18-25 triệu/tháng",
        type: "Full-time",
        description: "Thiết kế, giám sát thi công các công trình dân dụng và công nghiệp. Tốt nghiệp Đại học chuyên ngành Xây dựng, có kinh nghiệm 3-5 năm. Sử dụng thành thạo AutoCAD, Revit.",
        logo: "https://cdn-icons-png.flaticon.com/512/3135/3135755.png",
        tags: ["Full-time"]
    },
    {
        id: 3,
        title: "Bác sĩ đa khoa",
        company: "Bệnh viện Đa khoa Quốc tế",
        location: "Đà Nẵng",
        salary: "25-35 triệu/tháng",
        type: "Part-time",
        description: "Khám và điều trị các bệnh lý thông thường. Yêu cầu có chứng chỉ hành nghề, kinh nghiệm làm việc tại các bệnh viện lớn. Thời gian làm việc linh hoạt.",
        logo: "https://cdn-icons-png.flaticon.com/512/2965/2965567.png",
        tags: ["Part-time"]
    },
    {
        id: 4,
        title: "Lập trình viên Frontend (ReactJS)",
        company: "Tiki Corporation",
        location: "Remote",
        salary: "Thỏa thuận",
        type: "Remote",
        description: "Phát triển giao diện người dùng cho các sản phẩm của Tiki. Yêu cầu thành thạo ReactJS, Redux, HTML, CSS, JavaScript. Có kinh nghiệm làm việc với RESTful APIs. Có thể làm việc từ xa.",
        logo: "https://logo.clearbit.com/tiki.vn",
        tags: ["Remote", "ReactJS"]
    }
];

// Helper function to get job type class for styling
function getJobTypeClass(type) {
    if (type.toLowerCase() === 'full-time') return 'fulltime';
    if (type.toLowerCase() === 'part-time') return 'parttime';
    if (type.toLowerCase() === 'remote') return 'remote';
    return '';
}