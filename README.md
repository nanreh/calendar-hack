# Calendar Hack Project Info

Calendar Hack is a web application for runners who train for races. It renders a training program on a calendar and provides some basic editing features. It also provides for downloading the result as an iCal file which can be imported into any calendar application worth using.

The project is hosted at [defy.org/hacks/calendarhack](https://www.defy.org/hacks/calendarhack)

More project details are available on [the About page]((https://www.defy.org/hacks/calendarhack/about)

## Contributing

I'm a runner and I train for races. I built this application because I got tired of manually keying workouts into my Google Calendar... and also because I enjoy web programming.

Over the years, I've had a steady stream of requests for new features, changes, and additional training plans. Some of these requests I've been able to handle but others, despite my best efforts, I have not. So I'm posting the project publicly and hoping you can help make it better.

I have a strong desire to keep this tool useful, free, and open.

If you have a bugfix, a new feature, a plan you'd like to add, a UX/UI fix, please send me a PR.

Also please feel free to create a GitHub issue if you want to call something out.

# Plans

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

Calendar Hack is a React application. I used create-react-app to bootstrap this project. I opted for TypeScript.
```
yarn create react-app ch-bootstrap --template typescript
```
So you can run locally with: `yarn start`

The other standard scripts exist also: `yarn test`, `yard build`, etc.
