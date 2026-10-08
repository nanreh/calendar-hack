# Calendar Hack Project Info

Calendar Hack is a web application for runners who train for races. It renders a training program on a calendar and provides some basic editing features. It also provides for downloading the result as an iCal file which can be imported into any calendar application worth using.

The project is hosted at [defy.org/hacks/calendarhack](https://www.defy.org/hacks/calendarhack)

More project details are available on [the About page](https://www.defy.org/hacks/calendarhack/about)

## Contributing
If you have a bugfix, a new feature, a new training plan, a UX/UI fix, or other contribution, please send a PR.
Feel free to create a GitHub issue if you want to call something out.

## Running Locally

Calendar Hack is a React application built with Vite. You need Node.js 24.9 or later and yarn.

```
yarn install
yarn dev
```

The other standard scripts exist also: `yarn test`, `yarn lint`, `yarn build`, etc.

## Plans
Training plans are represented as YAML files that are easy to create and edit. They can be found in [plans/yaml](public/plans/yaml/).

Plans can be validated against a JSON schema ([public/schema/plan-schema.json](public/schema/plan-schema.json)) as follows:

```
# Install ajv
npm install -g ajv-cli

# Run the validator with yarn
yarn run validatePlans
```

## Converting new plans

If you are adding a new plan or modifying an existing one, you should work with the YAML version of the plan.

A simple program then converts the YAML plans to JSON for the application to consume:
```
python3 -m venv my_env
source ./my_env/bin/activate
pip install pyyaml
yarn convertPlans
```

Commit the generated JSON files in [plans/json](public/plans/json/) along with your YAML changes. A new plan also needs an entry in [src/ch/planList.ts](src/ch/planList.ts) to show up in the app.
