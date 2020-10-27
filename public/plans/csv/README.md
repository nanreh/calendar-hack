## Plans
Plans are text files with a CSV flavor to them. Each plan file is named with the plan id and the `csv` extension.

### Plan Properties
Rows beginning with `#` that have just a key and value separated by a `:` are read as top-level properties of the plan. All plans must have the following top-level properties:

| Property      | Description                                   |
| :------------ | :-------------------------------------------: |
|  id           | A unique and URL-friendly id for this plan    |
|  name         | A unique name for this plan (shown in the UI) |
|  description  | A description for this plan (shown in the UI) |
|  units        | The units used for distances (mi or km)       |
|  source       | Source for this plan so we can link to it     |
|  type         | One of [ Marathon, Half Marathon, 5K, 10K ]   |

See one of the existing plans for examples.

All other rows beginning with `#` are ignored and can be used for comments.

### Weeks
A plan has one or more weeks in it. Each week starts on Monday and must have seven rows representing each day of the week. Empty days are acceptable:
```
# Week 1
"","",0
"Run {7} miles","Hills if you can find them",7
"","",0
"Endurance\n{9:14}","",9
"Recovery\n{4:6}","",4
"More hills {4}","Run uphill one mile, repeat 4x",4
"Long Run {15}","Take this one easy",15
```

### Workouts
Each data row represents a workout. have three columns:
```
title,description,distance
```

#### Distance Rendering
Distances in title or description are enclosed in curly braces. These values are interpreted using `Plan.units`.
```
"Easy Run {7.5}","{1.5} Warm Up, {5} Easy, {1} Cool Down",7.5
```
If `Plan.units` is `mi`, this workout will render like this for a user that selects `mi` in the application:
```
Easy Run 7.5 mi
1.5 mi Warm Up, 5 mi Easy, 1 mi Cool Down
```
It will automatically render in `km` for a user that selects `km` in the application:
```
Easy Run 12.1 km
2.4 km Warm Up, 8.0 km Easy, 1.6 mi Cool Down
```

##### Providing Explicit Conversions
To provide an explicit value for both `mi` and `km`, provide both in the curly braces: {planUnits:otherUnits}:
```
"Easy Run {7.5:12}","{1.5:2.5} Warm Up, {5:8} Easy, {1:1.5} Cool Down",7.5
```
Rendered in `mi`:
```
Easy Run 7.5 mi
1.5 mi Warm Up, 5 mi Easy, 1 mi Cool Down
```
Rendered in `km`:
```
Easy Run 12 km
2.5 km Warm Up, 8.0 km Easy, 1.5 mi Cool Down
```
Explicit conversions can be provided on any distance. Without an explicit value, the arithmetic conversion and a round to one decimal place will be done.

#### Newlines
Newlines can appear in titles and descriptions. They will render correcly in the application and in iCal files and can help a lot with readability.
