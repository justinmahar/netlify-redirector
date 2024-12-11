[Screenshot](src/redirect.webp)

# Netlify Redirector

This is a simple React app that redirects any domain to another URL via Netlify.

It's quick, easy, and painless. Just follow the steps below.

<!-- ![Screenshot](./screenshot.png) -->

## Deploy To Netlify

First, click this button to deploy Netlify Redirector:

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/justinmahar/netlify-redirector)

## Set Up Redirect URL

Next, in Netlify, open your site, then open `Site configuration > Environment variables`.

Then add a single variable called `REACT_APP_REDIRECT_URL`, and set it to the URL you'd like to redirect to.

```
REACT_APP_REDIRECT_URL=https://www.github.com/
```

Once the `REACT_APP_REDIRECT_URL` environment variable has been set, open your site in Netlify, open `Deploys`, and click `Trigger deploy` to deploy the site. 

Once it finishes, your redirect will be active!

## Troubleshooting

`URIError: Failed to decode param '/%REACT_APP_REDIRECT_URL%'`

If you see this error, the `REACT_APP_REDIRECT_URL` environment variable has not been configured. Make sure you trigger a new deploy after the variable has been configured. 