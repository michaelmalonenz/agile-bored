/* global describe it */
const JiraToMarkdown = require('../../../viewmodels/jira-to-markdown')
const assert = require('assert')

const realExample = "As a Monitor UI user\r\nI want a an initial front page that directs me to the routes that I have permissions for\r\nSo that I can simply navigate to my relevant data\r\n\r\nh3. Background\r\nWhen monitor started it only had one data route called {{/usage}} that displayed the user's days of usage.\r\nNow internal users can see individualuser sessions on {{/sessions}}, and dongle users may be able to see their usage on {{/on-demand}}.\r\n\r\nh3. Challenges\r\n* We need some way of determining up-front which routes are relevant to user.  Monitor has no authorisation built in (only authentication), and just shows the data if the API says that the user is allowed to see it.\r\n** Perhaps we can add claims to the user profile response that Monitor currently uses to get the user's name?\r\n* Ideally this font page dynamically changes the list of links to the three aforementioned routes according to the user's permissions\r\n* The font page should be welcoming and pleasantly designed.  Perhaps highlighting T&C's?"
const realExpected = "As a Monitor UI user\r\nI want a an initial front page that directs me to the routes that I have permissions for\r\nSo that I can simply navigate to my relevant data\r\n\r\n### Background\r\nWhen monitor started it only had one data route called `/usage` that displayed the user's days of usage.\r\nNow internal users can see individualuser sessions on `/sessions`, and dongle users may be able to see their usage on `/on-demand`.\r\n\r\n### Challenges\r\n* We need some way of determining up-front which routes are relevant to user.  Monitor has no authorisation built in (only authentication), and just shows the data if the API says that the user is allowed to see it.\r\n** Perhaps we can add claims to the user profile response that Monitor currently uses to get the user's name?\r\n* Ideally this font page dynamically changes the list of links to the three aforementioned routes according to the user's permissions\r\n* The font page should be welcoming and pleasantly designed.  Perhaps highlighting T&C's?"

describe('The jira to markdown converter', function () {
  it('converts the real world example into the expected markdown', function () {
    const actual = JiraToMarkdown.convert(realExample)
    assert.equal(actual, realExpected)
  })
})
