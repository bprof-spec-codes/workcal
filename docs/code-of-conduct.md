# Code of conduct

## What is CoC?
A code of conduct includes policies and rules for employees and employers to follow in the workplace. Often, a company uses its core values, including its mission, to guide the creation of these codes. These guidelines outline how people can appropriately interact with one another at work.

[Benefits of CoC](https://www.indeed.com/career-advice/career-development/code-of-conduct-examples)

## Communicaton
All communication must be done via MS Teams's official channels and group chats, dedicated for that purpose. All SCRUM team members should have full overview of the internal development process. 1 on 1 private chats are accepted as well, but must be made inside Teams as well.

## Development
Development must be made accordingly to the SCRUM rules and roles. Each team member is responsible for his role and his work. Based on this, sprints must be involved during development.

## Using boards
Under each repository there will be the Projects tab, where the boards will be maintained. Each board will represent 1 sprint, where the tickets will be moved from one board's backlog to another board's backlog (there is no better option at this time at GitHub) as we move from one sprint to another.

Columns to be used:
- `Backlog`
- `To Do`
- `In Progress`
- `In Testing` (optionally)
- `Done`

## Using branches
Using GitKraken and connect it to GitHub will enable the funcionality to create branches based on a given ticket/issue. In any case use the following strategy below, where branch names must be easy to understand and identify which problem is it aimed for. GitKraken's approach is preferred, because it has the ticket ID in the branch name as well.
- `feature/short-branch-name-with-dashes`
- `bugfix/short-branch-name-with-dashes`

## Using PRs
After a feature is ready, do not merge directly to master locally! Create a PR from the branch you want to merge to the master, add reviewers to confirm or correct the changes. Only if everybody accepted it should be merged! If there is any modification needed, is should be commented to the PR itself. Every PR must have an assignee (who created the PR) and must have at least 3 reviewers.


## Developer tools to be used
* Backend development: Visual Studio or Rider
* Frontend development: Visual Studio Code or Webstorm
* Git GUI: GitKraken is proposed for any platforms (Mac, Linux, Windows)
    * https://www.gitkraken.com/download
* Issue management: GitHub official docs about Issues, Boards, PRs and Milestones
    * https://docs.github.com/en/issues/tracking-your-work-with-issues/about-issues
* SCRUM poker: this tool should be used during sprint plannings
    * https://www.scrumpoker-online.org/en/
    * Create a room and join by using real names (in order to be identified). During checking the tickets/issues everybody has to think about the currently discussed issue and estimate a time/effort it needs to be used to solve the issue. We reveal these and discuss. If there is some outlier value it should be justified and discussed. The average value should be noted as estimated value to the issue/ticket.
    * Values to be used:
        | Value | What it means |
        |-------|---------------|
        | 1     | 20 mins       |
        | 2     | half day      |
        | 3     | 1 day         |
        | 5     | 2-3 day       |
        | 8     | 1 week        |
        | 13    | 2 week        |
        | 21    | more          |

