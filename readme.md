# Fix It

## Getting Started

Fix It is a Django app with a React front end. To run it, you'll need:

- Python 3. We run under 3.5.3 in production.
- Postgres, at least version 9.5
- memcached
- redis

If you want to ingest transcripts from Pop Up Archive, you'll need to set up Oauth credentials using their developer portal.

Once those basic requirements are present and running, follow these steps to get up and running:

1. Create a virtual environment and activate it.
2. Clone this git repo and `cd` into it.
3. Install requirements with `pip install -r requirements.txt`
4. Choose a settings file to use, or create a new one. If you look at `mla_game/settings/vagrant.py`, you'll get an idea of the basic things you'll need for the app to run. At the most basic, you'll need to set a `SECRET_KEY` environment variable.
5. Migrate your database using `./manage.py migrate`
6. Ensure you have Huey running. See the [Huey documentation](https://huey.readthedocs.io/en/latest/ "Huey documentation") if you don't know how.
7. If you have a Pop Up Archive account you want to use, make sure you've set the `PUA_KEY` and `PUA_SECRET` environment variables, then run `./manage.py scrape_archive`
8. Run the server using `./manage.py runserver`

You should now have a running copy of Fix It.


## Custom Django commands

Fix It has a few custom commands. Here's an overview:

`create_fake_users_and_scores` creates fake users and gives them some scores.

`fake_game_one_gameplay` creates random votes for original transcript phrases.

`fake_game_two_gameplay` creates random corrections for eligible phrases.

`fake_game_three_gameplay` creates random votes for submitted corrections.

`scrape_archive` scrapes the Pop Up Archive for transcripts and records them in the Fix It database.

`get_aapb_metadata` scrapes transcript metadata from the AAPB.

`fill_in_transcript_gaps` creates blank phrases during gaps in the transcript timecode.

`fix_duplicate_phrases` removes duplicate phrases that might be created during PUA scraping.

`recalculate_all` recalculates transcript statistics, phrase confidence, and correction confidence for all eligible transcripts, phrases, and corrections.

`update_stats_for_all_eligible_transcripts` updates only transcript statistics.

`update_loading_screen_data` updates the data seen at the loading screens.

`create_missing_considered_phrases` creates entries in a users considered phrases if a downvote for that user/phrase exists. Should rarely be needed.

`create_missing_upvotes` creates corrections where not_an_error=True for all phrases a user has considered but has not downvoted. Should rarely be needed.

## API documentation

If you have `DEBUG=False` in your settings file, a [Swagger](https://swagger.io "Swagger") interface will be available at `/swagger/`. Additionally, the [Django Rest Framework browsable API](http://www.django-rest-framework.org/topics/browsable-api/ "DRF Browsable API") interface will be available at any given endpoint. Using Swagger is probably the easiest way to explore the API, but here is an overview of the endpoints available:

`/api/contributions/`: provides statistic about contributions from users.

Only GET requests are allowed.

Example output:

```javascript
{
    "statistics": {
        "avg_correction_votes_per_user": 3.1067961165048543,
        "avg_corrections_per_user": 37.26019417475728,
        "avg_phrase_votes_per_user": 74.28932038834951,
        "correction_votes": 1600,
        "corrections_submitted": 19189,
        "phrase_votes": 38259,
        "players": 515
    }
}
```
----

`/api/leaderboard/` provides the data used to populate the leaderboard. This data is calculated hourly.

Only GET requests are allowed.

Example output:

```javascript
{
    "leaderboard": {
        "all_time": [
            {
                "points": 3028,
                "rank": 1,
                "username": "KarenCariani"
            },
            {
                "points": 2981,
                "rank": 2,
                "username": "Sadie"
            },
            {
                "points": 2124,
                "rank": 3,
                "username": "Rachel"
            },
            {
                "points": 1902,
                "rank": 4,
                "username": "SK"
            },
            {
                "points": 1889,
                "rank": 5,
                "username": "LisaThompson"
            }
        ],
        "game_one_all_time": [
            {
                "points": 2981,
                "rank": 1,
                "username": "Sadie"
            },
            {
                "points": 2731,
                "rank": 2,
                "username": "KarenCariani"
            },
            {
                "points": 1902,
                "rank": 3,
                "username": "SK"
            },
            {
                "points": 1782,
                "rank": 4,
                "username": "LynnMason"
            },
            {
                "points": 1652,
                "rank": 5,
                "username": "Rachel"
            }
        ],
        "game_three_all_time": [
            {
                "points": 495,
                "rank": 1,
                "username": "LisaThompson"
            },
            {
                "points": 207,
                "rank": 2,
                "username": "KarenCariani"
            },
            {
                "points": 160,
                "rank": 3,
                "username": "kelseyn"
            },
            {
                "points": 146,
                "rank": 4,
                "username": "JRD923"
            },
            {
                "points": 140,
                "rank": 5,
                "username": "christophergreenman"
            }
        ],
        "game_two_all_time": [
            {
                "points": 723,
                "rank": 1,
                "username": "LisaThompson"
            },
            {
                "points": 95,
                "rank": 2,
                "username": "JRD923"
            },
            {
                "points": 90,
                "rank": 3,
                "username": "KarenCariani"
            },
            {
                "points": 90,
                "rank": 4,
                "username": "hhvarchivist"
            },
            {
                "points": 80,
                "rank": 5,
                "username": "christophergreenman"
            }
        ],
        "past_month": [
            {
                "points": 1835,
                "rank": 1,
                "username": "LisaThompson"
            },
            {
                "points": 1402,
                "rank": 2,
                "username": "JRD923"
            },
            {
                "points": 798,
                "rank": 3,
                "username": "kelseyn"
            },
            {
                "points": 632,
                "rank": 4,
                "username": "KarenCariani"
            },
            {
                "points": 404,
                "rank": 5,
                "username": "Rachel"
            }
        ],
        "past_week": [
            {
                "points": 727,
                "rank": 1,
                "username": "LisaThompson"
            },
            {
                "points": 341,
                "rank": 2,
                "username": "missrrg"
            },
            {
                "points": 305,
                "rank": 3,
                "username": "RexDonahey"
            },
            {
                "points": 271,
                "rank": 4,
                "username": "tagmophoto"
            },
            {
                "points": 170,
                "rank": 5,
                "username": "kelseyn"
            }
        ]
    }
}
```
----

`/api/loading/` provides the data seen on the loading screen. The data is re-generated hourly. Only GET requests are allowed. Example output:

```javascript
{
    "data": {
        "phrases_with_errors": 15964,
        "suggested_corrections": 672,
        "total_fixed": 0,
        "total_number_of_players": 516,
        "total_number_of_transcripts": 68553,
        "transcripts_in_progress": 201,
        "validated_corrections": 7
    }
}
```
----

`/api/profile/` provides an interface to profile data. A GET request to this endpoint will return profile data for the currently logged in user. Example output:

```javascript
{
    "count": 1,
    "next": null,
    "previous": null,
    "results": [
        {
            "completed_challenges": {
                "game_one": 9,
                "game_three": 0,
                "game_two": 0
            },
            "game_scores": {
                "game_one_score": 425,
                "game_three_score": 14,
                "game_two_score": 0,
                "total_score": 439
            },
            "pk": 6,
            "preferred_stations": [
                25,
                43
            ],
            "preferred_topics": [
                1,
                4,
                5,
                7
            ],
            "username": "JayThompson"
        }
    ]
}
```

If you have obtained the profile ID (identified by 'pk' in the above example), you can PATCH the profile to update the username, considered phrases, preferred stations, or preferred topics. You must use the ID in the URL, e.g. `/api/profile/6/`. The PATCH value should have one or more of the keys as seen in the following example:

```javascript
{
    "considered_phrases": [
        "1", "2", "3"
    ],
    "preferred_stations": [
        "25", "43"
    ],
    "preferred_topics": [
        "1", "3", "4"
    ],
    "username": "my_unique_username"
}
```
The profile endpoint also provides some special routes:

`/api/profile/{id}/clear_preferences/` is used in special cases when a user chooses to set their preferred stations or topics to a null set. This endpoint only accepts PATCH requests. The value should include one or both keys as seen in the following example:

```javascript
{
    "clear_stations": true,
    "clear_topics": true
}
```
If either value is `false` or the key is missing, the associated preferences will remain unchanged.

`/api/profile/{id}/completed/` is used to increment the record of how many rounds of each game the user has finished. This endpoint only accepts PATCH requests. The value should take the form of this example:
```javascript
{"completed": "game_one"}
```
Possible values for the `completed` key are: `game_one`, `game_two`, `game_three`. No other value will have any effect.

`/api/profile/{id}/skip_transcript/` is used when a user decides to skipt a transcript. This endpoint only accepts PATCH requests. The data should take the form of this example:
```javascript
{
    "transcript": 24882
}
```
The value of `transcript` should be the ID (`pk`) of the transcript the user is viewing.

----
`/api/profilestats/` and `/api/profilestats/{username}/` provide statistics about users. The former provides this data in a paginated array of all users, and the latter provides the same data for a single user by their username. This endpoint only accepts GET requests. Example data from the single-lookup endpoint:
```javascript
{
    "completed_challenges": {
        "game_one": 0,
        "game_three": 14,
        "game_two": 16
    },
    "game_scores": {
        "game_one_score": 1016,
        "game_three_score": 495,
        "game_two_score": 723,
        "total_score": 2234
    },
    "pk": 440,
    "preferred_stations": [],
    "preferred_topics": [],
    "username": "LisaThompson"
}
```
----

`/api/score` provides an interface for adding scores for actions completed in the browser, and for accessing an array of score objects for the logged-in user. For POST requests, the value should take the form of this example:
```javascript
{
  "game": "game_two",
  "score": 5
}
```
The `game` key accepts the values `game_one`, `game_two`, `game_three`. The value for the `score` key must be an integer. The score created will automatically be associated with the user making the request.

----
`/api/source/` provides a paginated array of sources associated with the transcripts and only accepts GET requests. Example data:
```javascript
{
    "count": 98,
    "next": null,
    "previous": null,
    "results": [
        {
            "pk": 1,
            "source": "KAKM Alaska Public Media",
            "state": "AK"
        },
        {
            "pk": 2,
            "source": "KCAW",
            "state": "AK"
        },
        {
            "pk": 3,
            "source": "KDLG",
            "state": "AK"
        },
        {
            "pk": 4,
            "source": "Koahnic Broadcast Corporation",
            "state": "AK"
        },
        {
            "pk": 5,
            "source": "KUCB",
            "state": "AK"
        },
        {
            "pk": 6,
            "source": "Arkansas Educational TV Network",
            "state": "AR"
        },
        {
            "pk": 7,
            "source": "KEET",
            "state": "CA"
        }, 
        ---snip---
    ]
}
```
----

`/api/topic/` provides an array of topics associated with the transcripts and only accepts GET requests. Example data:

```javascript
{
    "count": 7,
    "next": null,
    "previous": null,
    "results": [
        {
            "pk": 1,
            "slug": "arts",
            "topic": "Arts"
        },
        {
            "pk": 2,
            "slug": "home",
            "topic": "Home"
        },
        {
            "pk": 3,
            "slug": "news",
            "topic": "News and Public Affairs"
        },
        {
            "pk": 4,
            "slug": "humanities",
            "topic": "Humanities"
        },
        {
            "pk": 5,
            "slug": "politics",
            "topic": "Politics"
        },
        {
            "pk": 6,
            "slug": "society",
            "topic": "Society"
        },
        {
            "pk": 7,
            "slug": "science",
            "topic": "Science"
        }
    ]
}
```
----

`/api/transcript/` is the endpoint for all data dealing with transcripts. A GET request to this endpoint will provide a paginated array of all transcripts in the game in their original, uncorrected form. Additionally, a single transcript can be retrieved by appending the asset name, e.g. `/api/transcript/cpb-aacip_500-xp6v2q58/`

`/api/transcript/random/` returns a single, random, uncorrected transcript. This endpoint only responds to GET requests.

There are endpoints associated with each of the three games: `/api/transcript/game_one`, `/api/transcript/game_two`, and `/api/transcript/game_three`. Each of these special endpoints only accept GET requests.

`/api/transcript/game_one` returns an uncorrected transcript. The transcript is chosen based on the user's preferred stations and topics. If the user has already progressed through some of the transcript, the array of phrases will pick up where the user left off. This endpoint only responds to GET requests. Example output:

```javascript
[
    {
        "aapb_link": "http://americanarchive.org/catalog/cpb-aacip_15-gm81j97g2g",
        "media_url": "https://ci-buckets-assets-1umcaf2mqwhhg.s3.amazonaws.com/cifiles/0a809fbfdd7d4e98b7d31520e8aed249/cpb-aacip-15-gm81j97g2g__CBS305273_.h264.mp4?AWSAccessKeyId=AKIAIIRADF3LJIY2O5IA&Expires=1499463693&response-content-disposition=attachment%3B%20filename%3D%22cpb-aacip-15-gm81j97g2g__CBS305273_.h264.mp4%22&response-content-type=application%2Foctet-stream&Signature=uKU4ginkiWCNulHnfOD0a9GFwuQ%3D&u=16a555d05c60439a8243a3d6c349fd8b&a=0a809fbfdd7d4e98b7d31520e8aed249&ct=42cff4f6dbd74474808dee3c9ab49092&et=download",
        "metadata": {
            "broadcast_date": "1975-01-27",
            "description": "\n     Another supply convoy has reached Phnom Penh, proving that with some\n    ingenuity the Cambodian government can run the Khmer Rouge blockade and keep\n    the Mekong River open. The second convoy included a fuel tanker and two\n    ammunitions barges. Statements by the captain of one of the tankers. Shots\n    of the tankers moving down the river Shots of tug boats moving barges. Shots\n    of some holes in the tankers from Khmer Rouge artillery. In the countryside,\n    where the last bushels of the rice crop are being harvested, Khmer Rouge\n    gunners are firing mortars to scare young girls from the paddy fields. Shots\n    of the girls running in the fields. This item consists of raw, unpackaged,\n    news materials relating to the Cambodian civil war. \n  ",
            "media_type": "v",
            "series": "Vietnam: A Television History"
        },
        "name": "AA1670L5/cpb-aacip-15-gm81j97g2g__CBS305273_.h264.mp4",
        "phrases": [
            {
                "end_time": "26.32",
                "pk": 4711489,
                "start_time": "21.38",
                "text": "The second convoy included a fuel tanker and two ammunition barges. The tanker arrived under"
            },
            {
                "end_time": "31.28",
                "pk": 4711490,
                "start_time": "26.32",
                "text": "cover of darkness with 250000 gallons of aviation fuel and several gaping"
            },
            ---snip---
            {
                "end_time": "224.07",
                "pk": 4711515,
                "start_time": "216.15",
                "text": "Owned."
            }
        ],
        "pk": 5359,
        "source": [
            {
                "source": "WGBH"
            }
        ]
    }
]
```
`/api/transcript/game_two` provides an array of transcripts where each phrase has an extra key indicating whether the phrase needs the user to provide a correction. Otherwise, the data looks exactly as in the game one endpoint above. This endpoint only responds to GET requests. Example data from the array of phrases:

```javascript
            {
                "end_time": "666.88",
                "needs_correction": false,
                "pk": 14267183,
                "start_time": "662.58",
                "text": "other situations like this you know provide a framework and"
            },
            {
                "end_time": "668.69",
                "needs_correction": true,
                "pk": 14267184,
                "start_time": "666.88",
                "text": "recommendations for doing it."
            },
            {
                "end_time": "671.51",
                "needs_correction": true,
                "pk": 14267185,
                "start_time": "668.81",
                "text": "Smith said There will be three phases of the study."
            },
            {
                "end_time": "676.50",
                "needs_correction": false,
                "pk": 14267186,
                "start_time": "671.51",
                "text": "The first part will look at the fiscal and service demand on local government with projections of impact"
            },
```

`/api/transcript/game_three/` provides an array of transcript where each phrase that has corrections for the user to vote on has an extra key for those corrections. This endpoint only responds to GET requests. Example data from the array of phrases:
```javascript
            {
                "end_time": "14.96",
                "pk": 14267046,
                "start_time": "10.25",
                "text": "to respond to discharges from any loaded takers"
            },
            {
                "corrections": [
                    {
                        "corrected_text": "that are doing trade at their port that",
                        "pk": 13702
                    },
                    {
                        "corrected_text": "that are doing trade at their port. Um that",
                        "pk": 13745
                    },
                    {
                        "corrected_text": "that are doing trade at their port. Um, that",
                        "pk": 13619
                    }
                ],
                "end_time": "19.97",
                "pk": 14267047,
                "start_time": "15.15",
                "text": "that are doing trade at their port. That"
            },
```

`/api/transcript/{asset_name}/corrected/` returns the corrected version of a transcript. This endpoint only responds to GET requests.

----
`/api/add-transcript` provides a POST-only endpoint for adding transcripts to Fix It. The logged-in user must be a staff member to use this endpoint. The data should conform to the following example:

```javascript
{
    "name": "a_test_transcript.h264.mp4",
    "asset_name": "cpb-aacip-315sks",
    "phrases": [
        {
            "end_time": 9.28,
            "start_time": 0.00,
            "text": "A squid eating dough"
        },
        {
            "end_time": 13.89,
            "start_time": 9.28,
            "text": "in a polyethylene bag"
        },
        {
            "end_time": 17.72,
            "start_time": 14.73,
            "text": "is fast and bulbous,"
        },
        {
            "end_time": 23.69,
            "start_time": 18.96,
            "text": "got me?"
        }
    ]
}

```

Notes on the keys and data requirements:

`name` is a string and the name of the audio file from which the transcript was created.

`asset_name` is the AAPB asset name and will be used to collect metadata from AAPB after the transcript is saved.

`phrases` is an array of objects. Each object must contain a `start_time`, `end_time`, and `text`. `start_time` and `end_time` are numbers representing the time in seconds, to the hundredth of a second. `text` is the corresponding transcript text.


----

`/api/transcriptphrasecorrection/` provides an interface for adding corrections in game two. You can also retrieve an array of the logged-in user's correction. This endpoint only accepts GET and POST requests. When adding a correction, the data should take the form of this example:

```javascript
{
    "correction": "The user's submission goes here",
    "not_an_error": false,
    "transcript_phrase": "666"
}
```
The `transcript_phrase` key's value should be the PK of the phrase being corrected.

----

`/api/transcriptphrasecorrectionvote/` is used for voting on user-submitted corrections in game three. You can also retrieve an array of the logged-in user's votes. This endpoint only accepts GET and POST requests. When voting, the data should take the form of this example:

```javascript
{
    "transcript_phrase_correction": "324810",
    "upvote": true
}
```
The value for `transcript_phrase_correction` should be equal to the PK of the correction being voted on.

----

`/api/transcriptphrasedownvote/` is used for voting on phrases in game one. You can also retrieve an array of the logged-in user's downvotes. This endpoint only accepts GET and POST requests. When voting, the data should take the form of this example:
```javascript
{
    "transcript_phrase": "119"
}
```
The value for `transcript_phrase` should be equal to the PK of the phrase being downvoted.


## Front end documentation
The front end for Fix It is built primarily on [React](https://facebook.github.io/react/ "React JS") using [Redux](http://redux.js.org/ "Redux JS") for state management.

### Dependencies and Build Tools
Fix It uses [Gulp](http://gulpjs.com/ "Gulp JS") for asset management. To get started you will need to run `npm install` inside `/mla_game/`. This will install all the JavaScript dependencies with [NPM](https://www.npmjs.com/ Node Package Manager). There are two tasks available.

1. The default task `gulp` will:
  * Sets the `NODE_ENV` variable to `'development'` which will build a development version of React (very useful for debugging).
  * Compiles SCSS to CSS (compressed)
  * Bundles all the JavaScript using Browserify
  * Transpiles all the JavaScript using Babel.
2. The production build task `gulp production_build`
  * Sets the `NODE_ENV` to `'production'` which will build a production version of React (necessary before pushing code to the repository).
  * Compresses and bundles JavasSript with production build.

New NPM packages should added with `npm install package-name --save-dev`.

### JavaScript outside of React
All JavaScript that is not part of the react application is handled inline in `mla_game/templates/base.html` with the exception
of [A11y Dialog](https://github.com/edenspiekermann/a11y-dialog "A11y Dialog") which is loaded as an external script. All this JavScript
handles the login screen for the application and any interactivity before the application is mounted.


### Application Architecture

```bash
.
├── front-end
    ├── dist    # Output files that get loaded in the browser
    ├── javascript
        ├── actions     # Redux action creators
            ├── actionCreators.js   # Contains all action creators (functions that trigger actions)
        ├── components  # React Components
            ├── partials        # Small reusable components
            ├── routes          # Route components
            ├── base.js         # Base component (gets mounted to router)
            ├── base_connect.js # Configures base with Redux and state mapping
        ├── images      # Background images used in the app
        ├── reducers    # Describes what happens with actions
        ├── helpers.js  # A collection of helper functions that can be used throughout the application
        ├── index.js    # Application gets mounted to the dom here. Contains router
        ├── store.js    # holds the application state tree. Included as prop on provider on index.js
    ├── scss
        ├──  _animations.scss   # Contains canned animation mixins
        ├──  _config.scss       # Configuration for scss. contains colors and grid
        ├──  _gamefooter.scss   # All css for in game footer
        ├──  _gamemenu.scss     # All css for game menu
        ├──  _header.scss       # All css for game header
        ├──  _mixins.scss       # Scss Mixins used across the app
        ├──  _preferences.scss  # All css for preferences page
        ├──  _reset.scss        # Css Reset
        ├──  _slashPage.scss    # All css for the splash page
        ├──  _typography.scss   # All css typographic base styles
        ├──  _main.scss         # Imports all other .scss files and contains styling for in game ui.

```
### Data Fetching
The action creators are functions that trigger data changes in the application. Some global data is fetched when the app mounts initially. This is triggered by `fetchData()` and inserts some
global data into state such as profile information, games scores, leader board and preferences. This data gets re fetched when the preferences route component gets unmounted.
This insures that game preferences get applied for any future games that get fetched during the current session.

Data for each game gets fetched when the route component for each respective game gets mounted. See the following action creators:

* `fetchGameOne()` uses the api endpoint `/api/transcript/game_one`  
* `fetchGameTwo()` uses the api endpoint  `/api/transcript/game_two`
* `fetchGameThree()` uses the api endpoint  `/api/transcript/game_three`

when each route gets unmounted the local state data for each game is reset.

Other action creators trigger state changes throughout the app and are all located in the `actionCreators.js`.

### Reducers
The Reducers handle telling the application what happened when actions get triggered and handle how global state gets structured.
Each reducer creates an object at the top level of the global state of the app. To inspect global state on the client side you can use the
[React dev tools](https://github.com/facebook/react-devtools "React dev tools")

### Components
Components fall into two main categories: **Routes** and **Partials**

**Route** Components are high level components that for the most part have their state managed in Redux. Local state is
added only if it does not need to be shared with other components that are not nested inside of them (lifting state).

**Partial** Components are small reusable components that usually inherit state through props from parent components. Partials 
are more likely to have local state than routes.

### CSS
All game UI related CSS is stored in the main.scss file. High level components get there own files such as `_preferences.scss` or `_gamefooter.scss`
The dependencies are:

* [Gulp Compass](https://www.npmjs.com/package/gulp-compass "Gulp Compass")
* [Sass](http://sass-lang.com/ "Sass")
* [Susy](http://oddbird.net/susy/ "Susy")

`_config.scss` contains the base setup for grids and colors. `_mixins.scss` contains scss mixin helpers.

