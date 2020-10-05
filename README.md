# Calendar Hack Project Info

Calendar Hack is a web application for runners who train for races. It renders a training program on a calendar and provides some basic editing features. It also provides for downloading the result as an iCal file which can be imported into any calendar application worth using.

The project is hosted at [defy.org/hacks/calendarhack](https://www.defy.org/hacks/calendarhack)

More project details are available on [the About page](https://www.defy.org/hacks/calendarhack/about)

## Contributing
See [CONTRIBUTING.md](./CONTRIBUTING.md)

## Plans

Plans are represented as [JSON files](./public/plans/) and there's a JSON Schema defining the format [here](./public/schema/plan-schema.json). There's a bash script to validate the plans. To run the validation script, you first need to install the `ajv` cli command. Info for that project is [here](https://www.npmjs.com/package/ajv-cli). You can install it with yarn like this:
```
yarn global add ajv-cli
```
You should then be able to run the validation script in this project.
```
> ./bin/validatePlans
Validating plan ./public/plans/c25k.json ...
./public/plans/c25k.json valid
Validating plan ./public/plans/hansons_adv_half.json ...
./public/plans/hansons_adv_half.json valid
... and so on
```
`ajv` provides helpful error messages if a document fails to validate. But if you have a validation error you don't understand you should read [the schema](./public/schema/plan-schema.json).

## Running Locally

Calendar Hack is a React application. It was created using [Create React App](https://reactjs.org/docs/create-a-new-react-app.html#create-react-app) with the TypeScript template:
```
yarn create react-app ch-bootstrap --template typescript
```
So you can run locally with: `yarn start`

The other standard scripts exist also: `yarn test`, `yard build`, etc.
