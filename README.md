# Academy Bugs Automation

Automated end-to-end tests for [academybugs.com](https://academybugs.com) using Playwright.

## Project Structure

```
bugAcademy/
├── data/
│   └── bugs.js                # Bug definitions and actions
├── tests/
│   ├── academyBugsTests.spec.js
│   └── academyBugs2.spec.js
├── utils/
│   ├── bugInformation.js      # Bug reporting and popup handling
│   ├── bugTracker.js          # Bug tracking helpers
│   └── elementHelper.js       # Element interaction helpers
├── bugsFound.json             # Output of found bugs
├── package.json               # Project dependencies and scripts
├── playwright.config.js       # Playwright configuration
└── README.md                  # Project documentation
```

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run all tests:**
   ```bash
   npx playwright test
   ```

3. **Run a specific test file:**
   ```bash
   npx playwright test tests/academyBugsTests.spec.js
   ```

4. **View test reports:**
   - After running tests, open `playwright-report/index.html` in your browser.

## Key Files

- `data/bugs.js`: Defines all bugs and their Playwright actions.
- `utils/elementHelper.js`: Helper functions for clicking, typing, and navigation.
- `utils/bugInformation.js`: Handles bug reporting popups and questionnaire logic.
- `tests/academyBugsTests.spec.js`: Main test suite for bug actions.

## Customization

- To add or update bugs, edit `data/bugs.js`.
- To change element selectors or interaction logic, update `utils/elementHelper.js`.

## Tips

- Use headed mode for debugging:
  ```bash
  npx playwright test --headed
  ```
- Check local storage for bug progress (`found-bug` key).
- Update `academyBugId` in `bugs.js` to match the app’s internal bug tracking.

## Tricks

Feel free to use this list to unlock all bugs in one clic:
   {
   "first":1,
   "second":1,
   "third":1,
   "fourth":1,
   "fifth":1,
   "sixth":1,
   "seventh":1,
   "eighth":1,
   "ninth":1,
   "tenth":1,
   "eleventh":1,
   "twelfth":1,
   "thirteenth":1,
   "fourteenth":1,
   "fifteenth":1,
   "sixteenth":1,
   "seventeenth":1,
   "eighteenth":1,
   "nineteenth":1,
   "twentieth":1,
   "twentyFirst":1,
   "twentySecond":1,
   "twentyThird":1,
   "twentyFourth":1,
   "twentyFifth":1
   }

---

Happy testing! 🐞🥑
