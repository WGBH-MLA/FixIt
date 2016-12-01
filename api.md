API endpoints

/api/transcript/

Here you can GET a paginated list of transcripts or you can append a PK to the end for a single transcript, e.g. /api/transcript/1/

/api/transcript/random/ returns a random transcript

/api/transcript/user_transcripts/

Returns a list of transcripts suitable for the current logged in user based on their preferences.


/api/transcriptphrasedownvote/ will return a list of downvoted phrases from the current logged in user. You can POST a phrase downvote using JSON like so:

`{"transcript_phrase": 231}`


/api/transcriptphrasecorrection/

Returns a list of phrase corrections authored by the logged in user. You can POST new corrections like so:

`{"correction": "this is the corrected text for this phrase", "transcript_phrase": 1234}`


/api/profile/

Return a list of the logged in user's preferred stations and topics (by PK), and the user's username.

Not currently functional but coming soon: POST to update the profile:

`{"preferred_stations": [1, 3, 6, 12]}`

or

`{"username": "zap_rowsdower"}`


/api/source/

Return a list of all known sources. Format is like so:

```
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
...
```


/api/topic/

Return a list of topics:

```
{
    "pk": 1,
    "topic": "Arts",
    "slug": "arts"
},
{
    "pk": 2,
    "topic": "Home",
    "slug": "home"
},
```
