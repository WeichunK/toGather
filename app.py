from application import create_app
from flask_cors import CORS
from flask import jsonify
from werkzeug.wrappers import Response

class JSONResponse(Response):
    default_mimetype = 'application/json'

    @classmethod
    def force_type(cls, response, environ=None):
        if isinstance(response, dict):
            response = jsonify(response)
        return super(JSONResponse, cls).force_type(response, environ)

app = create_app('development')
CORS(app)
app.response_class = JSONResponse

if __name__ == '__main__':
    app.run(debug=True)