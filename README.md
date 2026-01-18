# Calendar Hack Project Info

Calendar Hack is a web application for runners who train for races. It renders a training program on a calendar and provides some basic editing features. It also provides for downloading the result as an iCal file which can be imported into any calendar application worth using. CSV download is also available.

The project is hosted at [defy.org/hacks/calendarhack](https://www.defy.org/hacks/calendarhack)

More project details are available on [the About page](https://www.defy.org/hacks/calendarhack/about)

## Contributing
If you have a bugfix, a new feature, a new training plan, a UX/UI fix, or other contribution, please send a PR.
Feel free to create a GitHub issue if you want to call something out.

## Running Locally

Calendar Hack is a React application. Using yarn, you can run it locally with: `yarn dev`

The other standard scripts exist also: `yarn test`, `yarn build`, etc.

## Plans
Training plans are represented as YAML files that are easy to create and edit. They can be found in [plans/yaml](public/plans/yaml/).

Plans can be validated against a JSON schema ([public/schema/plan-schema.json](public/schema/plan-schema.json)) as follows:

```
# Install ajv
npm install -g ajv-cli

# Run the validator with yarn
yarn run validatePlans
```
