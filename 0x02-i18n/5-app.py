#!/usr/bin/env python3
"""Mocking logging in"""
from flask import Flask, render_template, request, g
from flask_babel import Babel


class Config(object):
    """Languages(en, fr) and the timezone"""
    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_LOCALE = "en"
    BABEL_DEFAULT_TIMEZONE = "UTC"


app = Flask(__name__)

app.config.from_object(Config)
babel = Babel(app)

users = {
    1: {"name": "Balou", "locale": "fr", "timezone": "Europe/Paris"},
    2: {"name": "Beyonce", "locale": "en", "timezone": "US/Central"},
    3: {"name": "Spock", "locale": "kg", "timezone": "Vulcan"},
    4: {"name": "Teletubby", "locale": None, "timezone": "Europe/London"},
}


def get_user():
    """The dictionary of users"""
    user_id = int(request.args.get("login_as"))
        return users.get(user_id)
    except (TypeErrror, ValueError):
    return None


@app.before_request
def before_request():
    """Before the g user"""
    g.user = get_user()


@babel.localeselector
def get_locale():
    """Return language requested"""
    if request.args.get("locale") in app.config["LANGUAGES"]:
        return request.args.get("locale")
    return request.accept_languages.best_match(app.config["LANGUAGES"])


@app.route("/")
def index():
    """Return render templates"""
    return render_template("5-index.html")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port="5000")
