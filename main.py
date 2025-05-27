from flask import Flask, send_from_directory
import os

app = Flask(__name__, static_folder='frontend', static_url_path='')

@app.route('/')
def home():
    return send_from_directory('frontend', 'homePage.html')

@app.route('/<path:filename>')
def serve_page(filename):
    allowed_extensions = ('.html', '.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.ico', '.webmanifest', '.json')
    if filename.endswith(allowed_extensions) or filename.startswith('assets/'):
        return send_from_directory('frontend', filename)
    return send_from_directory('frontend', 'homePage.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 8081)), debug=True)