# Framework for building libraries and npm packages

## Commands

- `npm login`
- `npm publish` - to publish / update a package
- `npm unpublish [package_name]` - to delete

## Framework structure

The framework allows you to write code in the form of Typescript and SCSS, code that will be compiled in JavaScript and CSS.

The output will be placed inside `dist` folder and it's represented by two files.

- `my-library.js` - you JS and CSS code bundled in one file
- `my-library.d.ts` - types for your code

## Start developing your library (and testing)

1. Inside src folder, change the name of the main file, from `my-library.ts` to the desired filename.
2. Update this name inside `package.json` in `main` and `types` properties.
3. Update this name in `webpack.config.js` in `entry` and `output` properties.
4. To test your code just import it in any test file like in the example from `test` folder.
5. To test the code on the UI, update the `<script></script>` tag in `index.html` file.
6. Open `index.html` with a Live Server or as a simple file and test the library.
