
# Git convention

## Available types

| Type          | Description                                                                                                                                                                                                                                                        |
|---------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| feature       | Any code changes for a new module or use case should be done on a feature branch. This branch is created based on the current development branch. When all changes are Done, a Pull Request/Merge Request is needed to put all of these to the development branch. |
| enhancement   | A code change that neither fixes a bug nor adds a feature                                                                                                                                                                                                          |
| refactoring   | Commits, that rewrite/restructure your code, however does not change any behaviour                                                                                                                                                                                 |
| fix           | If the code changes made from the feature branch were rejected after a release, sprint or demo, any necessary fixes after that should be done on the bugfix branch.                                                                                                |
| codestyle     | Commits, that do not affect the meaning (white-space, formatting, missing semi-colons, etc)                                                                                                                                                                        |
| build         | Commits, that affect build components like build tool, dependencies, project version, ...                                                                                                                                                                          |
| ci            | Commits, that affect ci pipeline, github actions, ...                                                                                                                                                                                                              |
| documentation | Commits, that affect documentation only                                                                                                                                                                                                                            |
| workflow      | Commits, that affect config files only                                                                                                                                                                                                                             |
| performance   | Refactoring commit, that improves performance                                                                                                                                                                                                                      |
| suggestion    | Any new feature or idea that is not part of a release or a sprint. A branch for playing around.                                                                                                                                                                    |
| test          | Commits, that add missing tests or correcting existing tests                                                                                                                                                                                                       |
| release       | Commit patter to run automatically publishing to npm                                                                                                                                                                                                               |

### Branch naming:

- Use task type in the branch naming
- Add task id or some abbr for you task
- Describe your task

```BASH
task-type/TASK-ID-Task-Title
```

### Commit naming

- Separate subject from body with a blank line.
- Limit the subject line to 72 characters
- Capitalize the subject line (Begin all subject lines with a capital letter.)
- Do not end the subject line with a period (Trailing punctuation is unnecessary in subject lines.)
- Use the imperative mood in the subject line (Imperative mood just means “spoken or written as if giving a command or instruction”.)
- Wrap the body at 72 characters (Git never wraps text automatically. When you write the body of a commit message, you must mind its right margin, and wrap text manually. The recommendation is to do this at 72 characters, so that Git has plenty of room to indent text while still keeping everything under 80 characters overall.)
- Use the body to explain what and why vs. how
- Use the footer to attach links or other additional information

#### Structure:

```BASH
task-type/TASK-ID Task Title - The same as a branch name
-- description 1
-- description ...
-- description N
-- tag 1
-- tag ...
-- tag N
-- etc...
```

