#Clock#

##Client Requirements##
* Python 2.x
* Qt 4.8.x

##Server requirements##
* Node.js

## Message Format ##
```json
{
    "html": "string of html content to display", 
    "recurring": "integer corresponding to proper constant",
    "target": "string of format '%m-%d-%Y %H:%M:%S'"
}
```