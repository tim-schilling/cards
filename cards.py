from flask import Flask
from flask import render_template
from flask_sockets import Sockets

app = Flask(__name__)
sockets = Sockets(app)

@app.route('/')
def game():
    return render_template('game.html')

@sockets.route('/echo')
def echo_socket(ws):
    while True:
        message = ws.receive()
        ws.send(message)

if __name__ == '__main__':
    app.run()
