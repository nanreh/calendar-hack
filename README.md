# Calendar Hack Project Info

Calendar Hack is a web application for runners who train for races. It renders a training program on a calendar and provides some basic editing features. It also provides for downloading the result as an iCal file which can be imported into any calendar application worth using.

The project is hosted at [defy.org/hacks/calendarhack](https://www.defy.org/hacks/calendarhack)

More project details are available on [the About page](https://www.defy.org/hacks/calendarhack/about)

## Contributing
If you have a bugfix, a new feature, a new training plan, a UX/UI fix, or other contribution, please send a PR.
Feel free to create a GitHub issue if you want to call something out.

## Plans
Training plans are represented as YAML files that are easy to create and edit. They can be found in [plans/yaml](public/plans/yaml/). A JSON schema exists at [public/schema/plan-schema.json](public/schema/plan-schema.json)

## Running Locally

Calendar Hack is a React application. It was created using [Create React App](https://reactjs.org/docs/create-a-new-react-app.html#create-react-app) with the TypeScript template:
```
yarn create react-app ch-bootstrap --template typescript
```
So you can run locally with: `yarn start`

The other standard scripts exist also: `yarn test`, `yard build`, etc.
