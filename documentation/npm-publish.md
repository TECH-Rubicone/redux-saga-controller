# Publish to NPM automatically with GitHub Actions

## Repository has setup workflow to auto npm publishing

### To publish package you should just create new release and setup

- Tag version: X.X.X
- Release title vX.X.X
- Describe a release (Add release notes)

### When publishing a release, trigger a workflow
- In the build, first, check out the branch the release is targetting
- Update the version in package.json based on the release tag
- Build the project and run tests to make sure everything works
- Publish the project to an NPM registry
- Push the version change to GitHub
