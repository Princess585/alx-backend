#!/usr/bin/env python3
"""Force locale with URL parameter"""
from flask import Flask, render_template, request
from flask_babel import Babel


class Config(object):
    """Languages(en, fr) and timezone"""
    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_LOCALE = "en"
    BABEL_DEFAULT_TIMEZONE = "UTC"


app = Flask(__name__)

app.config.from_object(Config)
babel = Babel(app)


@babel.localeselector
def get_locale():
    """Return languages requested"""
    if request.args.get("locale") in app.config["LANGUAGES"]:
        return request.args.get("locale")
    return request.accept_languages.best_match(app.config["LANGUAGES"])


@app.route("/")
def index():
    """Return render templates"""
    return render_template("4-index.html")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port="5000")
