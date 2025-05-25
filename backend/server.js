const express = require('express');
const { Firestore, Timestamp } = require('@google-cloud/firestore'); // Import Timestamp
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 8080; // Port cho backend API

// --- Middleware ---
app.use(cors()); // Cho phép Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// --- Firestore Initialization ---
const firestore = new Firestore({
    keyFilename: path.join(__dirname, 'config/serviceAccountKey.json'),
    // projectId: 'your-gcp-project-id' // Nếu không được tự động nhận diện
});

// --- API Routes ---

// Endpoint để đăng tin tuyển dụng mới
app.post('/api/jobs', async (req, res) => {
    try {
        const { company, position, location, salary, jobtype, description } = req.body;

        if (!company || !position || !location || !description || !jobtype) {
            return res.status(400).send({ message: 'Vui lòng điền đủ thông tin bắt buộc: Tên công ty, Vị trí, Địa điểm, Loại hình, Mô tả.' });
        }

        const newJob = {
            company,
            position,
            location,
            salary: salary || "Thỏa thuận",
            jobtype,
            description,
            postedAt: Timestamp.now()
        };

        const docRef = await firestore.collection('jobs').add(newJob);
        res.status(201).send({ id: docRef.id, ...newJob });
    } catch (error) {
        console.error('Error posting job:', error);
        res.status(500).send({ message: 'Lỗi khi đăng tin tuyển dụng.', error: error.message });
    }
});

// Endpoint để lấy danh sách tất cả việc làm
app.get('/api/jobs', async (req, res) => {
    try {
        const jobsSnapshot = await firestore.collection('jobs').orderBy('postedAt', 'desc').get();
        const jobs = [];
        jobsSnapshot.forEach(doc => {
            jobs.push({ id: doc.id, ...doc.data() });
        });
        res.status(200).send(jobs);
    } catch (error) {
        console.error('Error fetching jobs:', error);
        res.status(500).send({ message: 'Lỗi khi lấy danh sách việc làm.', error: error.message });
    }
});

// Endpoint để lấy chi tiết một việc làm theo ID
app.get('/api/jobs/:id', async (req, res) => {
    try {
        const jobId = req.params.id;
        const jobDoc = await firestore.collection('jobs').doc(jobId).get();

        if (!jobDoc.exists) {
            return res.status(404).send({ message: 'Không tìm thấy việc làm.' });
        }
        res.status(200).send({ id: jobDoc.id, ...jobDoc.data() });
    } catch (error)
    {
        console.error('Error fetching job details:', error);
        res.status(500).send({ message: 'Lỗi khi lấy chi tiết việc làm.', error: error.message });
    }
});


// Endpoint để nộp hồ sơ ứng tuyển
app.post('/api/applications', async (req, res) => {
    try {
        const { fullname, email, phone, position, cvfile_content, cvfile_name, note, jobId } = req.body; // jobId là ID của job ứng tuyển

        if (!fullname || !email || !position || !cvfile_content || !cvfile_name) { // Giả sử cvfile_content là base64 string của file
            return res.status(400).send({ message: 'Vui lòng điền đủ thông tin bắt buộc: Họ tên, Email, Vị trí, CV.' });
        }

        // TODO: Xử lý lưu trữ file CV (ví dụ: Google Cloud Storage)
        // Hiện tại, cta có thể lưu tên file và nội dung base64 (nếu nhỏ) hoặc chỉ link
        // Cta có thể đơn giản hóa bằng cách chỉ lưu tên file hoặc một ghi chú về CV.
        // Hoặc nếu muốn lưu base64, đảm bảo Firestore có thể xử lý kích thước.
        // Ví dụ đơn giản:
        const newApplication = {
            fullname,
            email,
            phone: phone || "",
            positionApplied: position,
            cvFileName: cvfile_name,
            note: note || "",
            jobId: jobId || null, // Liên kết với job đã ứng tuyển
            submittedAt: Timestamp.now()
        };

        const docRef = await firestore.collection('applications').add(newApplication);
        res.status(201).send({ id: docRef.id, ...newApplication, message: "Nộp hồ sơ thành công!" });
    } catch (error) {
        console.error('Error submitting application:', error);
        res.status(500).send({ message: 'Lỗi khi nộp hồ sơ.', error: error.message });
    }
});


app.listen(port, () => {
    console.log(`Backend server listening at http://localhost:${port}`);
});