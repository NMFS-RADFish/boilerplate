# RADFish Boilerplate Application Code

![test and build workflow](https://github.com/NMFS-RADFish/boilerplate/actions/workflows/run-tests.yml/badge.svg)

![radfish_logo](https://github.com/NMFS-RADFish/boilerplate/assets/11274285/f0c1f78d-d2bd-4590-897c-c6ec87522dd1)

## Getting Started

Assuming you have generated the application with the cli application, you should already have a webpack server running on `localhost:3000`. We have created a example form `DemoForm.js` that demonstrates how to build a form using the `react-radfish` components. You can modify and make changes to this form as needed.

You have the following scripts available to you during development to setup this project outside of the cli bootstrapping process:

- `npm start` starts the development server, with hot reloading
- `npm run build` build a production bundle of your application for deployment
- `npm run test` runs unit test suite
- `npm run eject` ejects create-react-app preconfiguration (you shouldn't need this often)
- `npm run lint` lints code with eslint
- `npm run lint:fix` lints and updates code to correct format
- `npm run format` lints, updates, and saves changed files for commit
- `npm run serve` runs the application as a production bundle (need to `npm run build` first). Helpful for debugging service worker behavior in a "production like" environment

## State Management

Form state is managed with react context. The code for this state can be found in `contexts/FormWrapper.js`. This context exports form handlers, and captures form data on submit. Whenever you want to leverage this context for a form you create, be sure to wrap this component with the `FormWrapper`.

```
    <FormWrapper onSubmit={handleFormSubmit}>
        <DemoForm asyncFormOptions={asyncFormOptions} />
    </FormWrapper>
```

This will ensure that the state that is managed in context will be passed correctly to the child form that you are building, and should behave in a similar way. You can access the form data within the `FormWrapper` and can `console.log`, `debug`, or otherwise pass this data to the context's children as you application needs.

## Interfacing with backend services

Radfish comes bundled with a mock server that you can use to mock out api requests. This file can be found in `mocks/browser.js`. You can add HTTP handlers here that will get intercepted and handled whenever they are called from an HTTP client like Postman, or from the Radfish application itself.

In order to make an API request, you should use the included `APIService.js` module that is provided in the radfish application. A common pattern, is to call this `ApiService` in a `useEffect` that will trigger whenever a React component loads:

```
  useEffect(() => {
    const fetchData = async () => {
      const { data } = await ApiService.get(API_ENDPOINT);
      // handle data as needed
    };
    fetchData();
  }, []);
```

Note that this `APIService` can be used in conjunction with the mock service worker, or configured to consume and interact with an external REST API.
