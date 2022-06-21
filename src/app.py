from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/signin')
def signin():
    return render_template('signin.html')

@app.route('/signup')
def signup():
    return render_template('signup.html')

@app.route('/students')
def students():
    return render_template('students.html')

@app.route('/assign')
def assign():
    return render_template('assign.html')

@app.route('/assign/student')
def assignStudent():
    return render_template('assign-student.html')

@app.route('/assign/group')
def assignGroup():
    return render_template('assign-group.html')

@app.route('/validation')
def validation():
    return render_template('validation.html') 

@app.route('/progress')
def progress():
    return render_template('progress.html')

if __name__ == '__main__':
    app.run(debug = True, port = 4000)