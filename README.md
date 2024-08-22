# PlainChord

This is an initiative to create a Universal Standard for Chord data.

## How does it work?

A plain text file following the established Text Standard is transformed into an Object that can be viewed through the Component.

### PlainChord (Text Standard)

The Chords have `title`, `author`, `capo` fields, in addition to `sections`.

Following the Standard:

```
Title
Author
#1

@Into
$C $G/B $Am

@Music
$C Doxa tō Theō $G/B Lorren $Am Christos
````

Thus forming a "complete" Chord for the interpreter.

### Chord Object (JSON)

PlainChord is transpiled to an Object:

```JSON
{
    "title": "Title",
    "artist": "Author",
    "capo": 1,
    "sections": [
        {
            "lyrics": [
                {
                    "title": "Into",
                    "chords": [
                        [
                            {
                                "chord": "C",
                                "lyrics": ""
                            },
                            {
                                "chord": "G/B",
                                "lyrics": ""
                            },
                            {
                                "chord": "Am",
                                "lyrics": ""
                            }
                        ]
                    ],
                    "repeat": 0
                }
            ]
        },
        {
            "lyrics": [
                {
                    "title": "Music",
                    "chords": [
                        [
                            {
                                "chord": "C",
                                "lyrics": " Doxa tō Theō"
                            },
                            {
                                "chord": "G/B",
                                "lyrics": " Lorren"
                            },
                            {
                                "chord": "Am",
                                "lyrics": " Christos"
                            }
                        ]
                    ],
                    "repeat": 0
                }
            ]
        }
    ]
}
```

To be displayed by a React Component.

Example [via cID.](https://plainchord.surge.sh/?cid=QmZteiNT4WNyhmVzVz9BSuQscrQXJbCDcvEqnU6RxxCYpu)

### Possible Improvements
- [ ] Improve Parse and Stringify logic (?)
- [ ] Improve logic that gets the Tonic
- [ ] Implement Tablatures
- [ ] Documentation about .Chord and .PlainChord and how to use them
- [ ] Create Unit Tests
- [ ] Implement Typescript
- [ ] Support for "Embed"
- [ ] Auto Scroll