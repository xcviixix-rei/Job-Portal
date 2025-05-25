from flask import Flask, send_from_directory
import os

# Initialize Flask App
# static_folder='frontend' means Flask will look for static files (css, js) in the 'frontend' subfolder
# static_url_path='' means that e.g. /styles.css maps to frontend/styles.css
app = Flask(__name__, static_folder='frontend', static_url_path='')

# Route for the homepage
@app.route('/')
def home():
    # Serve homePage.html from the 'frontend' directory
    return send_from_directory('frontend', 'homePage.html')

# Route for other HTML pages (e.g., employer.html, apply.html, job-details.html)
# and also for other static assets like CSS, JS if not caught by static_folder directly
@app.route('/<path:filename>')
def serve_page(filename):
    # Basic security: only allow .html, .css, .js, .png, etc. files from 'frontend'
    # More robust checking might be needed for production
    allowed_extensions = ('.html', '.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.ico', '.webmanifest', '.json') # Add other needed extensions
    
    # For job_data.js, ensure it's explicitly allowed if it's being fetched by a <script src="jobs_data.js"> tag
    # The static_folder setting should handle .js files correctly.
    # This explicit check is more for .html or other types not automatically handled by static_folder if URL isn't /static/filename
    
    if filename.endswith(allowed_extensions):
        # Serve the file from the 'frontend' directory
        return send_from_directory('frontend', filename)
    
    return "File not found or not allowed", 404

if __name__ == '__main__':
    # This is used when running locally. Gunicorn is used by App Engine.
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 8080)), debug=True)