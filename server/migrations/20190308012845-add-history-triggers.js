'use strict'

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION changelogIssueDiff() RETURNS TRIGGER AS $$
      BEGIN
        IF NEW."title" <> OLD."title" THEN
          INSERT INTO changelog ("issueId", "field", "authorId", "oldValue", "newValue", "timestamp")
          VALUES (NEW.id, 'title', NEW."latestEditorId", OLD.title, NEW.title, current_timestamp);
        END IF;
        IF NEW."description" <> OLD."description" THEN
          INSERT INTO changelog ("issueId", "field", "authorId", "oldValue", "newValue", "timestamp")
          VALUES (NEW.id, 'description', NEW."latestEditorId", OLD."description", NEW."description", current_timestamp);
        END IF;
        IF NEW."statusId" <> OLD."statusId" THEN
          INSERT INTO changelog ("issueId", "field", "authorId", "oldValue", "newValue", "timestamp")
          VALUES (NEW.id, 'status', NEW."latestEditorId",
            (SELECT name FROM issue_statuses WHERE id = OLD."statusId"),
            (SELECT name FROM issue_statuses WHERE id = NEW."statusId"), current_timestamp);
        END IF;
        IF NEW."typeId" <> OLD."typeId" THEN
          INSERT INTO changelog ("issueId", "field", "authorId", "oldValue", "newValue", "timestamp")
          VALUES (NEW.id, 'type', NEW."latestEditorId",
            (SELECT name FROM issue_type WHERE id = OLD."typeId"),
            (SELECT name FROM issue_type WHERE id = NEW."typeId"), current_timestamp);
        END IF;
        IF NEW."assigneeId" <> OLD."assigneeId" THEN
          INSERT INTO changelog ("issueId", "field", "authorId", "oldValue", "newValue", "timestamp")
          VALUES (NEW.id, 'assignee', NEW."latestEditorId",
            (SELECT "displayName" FROM users WHERE id = OLD."assigneeId"),
            (SELECT "displayName" FROM users WHERE id = NEW."assigneeId"), current_timestamp);
        END IF;
        IF NEW."reporterId" <> OLD."reporterId" THEN
          INSERT INTO changelog ("issueId", "field", "authorId", "oldValue", "newValue", "timestamp")
          VALUES (NEW.id, 'reporter', NEW."latestEditorId",
            (SELECT "displayName" FROM users WHERE id = OLD."reporterId"),
            (SELECT "displayName" FROM users WHERE id = NEW."reporterId"), current_timestamp);
        END IF;
        IF NEW."parentId" <> OLD."parentId" THEN
        INSERT INTO changelog ("issueId", "field", "authorId", "oldValue", "newValue", "timestamp")
          VALUES (NEW.id, 'parent', NEW."latestEditorId", CAST(OLD."parentId" AS TEXT), CAST(NEW."parentId" AS TEXT), current_timestamp);
        END IF;

        RETURN NEW;
      END; $$ LANGUAGE plpgsql;`
    ).then(() => {
      queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION changelogIssueInsert() RETURNS TRIGGER AS $$
      BEGIN
        IF NEW."title" IS NOT NULL THEN
          INSERT INTO changelog ("issueId", "field", "authorId", "oldValue", "newValue", "timestamp")
          VALUES (NEW.id, 'title', NEW."latestEditorId", '', NEW.title, current_timestamp);
        END IF;
        IF NEW."description" IS NOT NULL THEN
          INSERT INTO changelog ("issueId", "field", "authorId", "oldValue", "newValue", "timestamp")
          VALUES (NEW.id, 'description', NEW."latestEditorId", '', NEW."description", current_timestamp);
        END IF;
        IF NEW."statusId" IS NOT NULL THEN
          INSERT INTO changelog ("issueId", "field", "authorId", "oldValue", "newValue", "timestamp")
          VALUES (NEW.id, 'status', NEW."latestEditorId", NULL,
            (SELECT name FROM issue_statuses WHERE id = NEW."statusId"), current_timestamp);
        END IF;
        IF NEW."typeId" IS NOT NULL THEN
          INSERT INTO changelog ("issueId", "field", "authorId", "oldValue", "newValue", "timestamp")
          VALUES (NEW.id, 'type', NEW."latestEditorId", NULL,
            (SELECT name FROM issue_type WHERE id = NEW."typeId"), current_timestamp);
        END IF;
        IF NEW."assigneeId" IS NOT NULL THEN
          INSERT INTO changelog ("issueId", "field", "authorId", "oldValue", "newValue", "timestamp")
          VALUES (NEW.id, 'assignee', NEW."latestEditorId", NULL,
            (SELECT "displayName" FROM users WHERE id = NEW."assigneeId"), current_timestamp);
        END IF;
        IF NEW."reporterId" IS NOT NULL THEN
          INSERT INTO changelog ("issueId", "field", "authorId", "oldValue", "newValue", "timestamp")
          VALUES (NEW.id, 'reporter', NEW."latestEditorId", NULL,
            (SELECT "displayName" FROM users WHERE id = NEW."reporterId"), current_timestamp);
        END IF;
        IF NEW."parentId" IS NOT NULL THEN
        INSERT INTO changelog ("issueId", "field", "authorId", "oldValue", "newValue", "timestamp")
          VALUES (NEW.id, 'parent', NEW."latestEditorId", NULL, CAST(NEW."parentId" AS TEXT), current_timestamp);
        END IF;

        RETURN NEW;
      END; $$ LANGUAGE plpgsql;`
    )
    }).then(() => {
      return queryInterface.sequelize.query(`
  CREATE TRIGGER issue_insert_changelog_trigger AFTER INSERT
  ON issues FOR EACH ROW EXECUTE PROCEDURE changelogIssueInsert();`)
    }).then(() => {
      return queryInterface.sequelize.query(`
  CREATE TRIGGER issue_update_changelog_trigger AFTER UPDATE
  ON issues FOR EACH ROW EXECUTE PROCEDURE changelogIssueDiff();`)
    })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.query('DROP TRIGGER "issue_insert_changelog_trigger" ON issues;')
    .then(() => {
      return queryInterface.sequelize.query('DROP TRIGGER "issue_update_changelog_trigger" ON issues;')
    })
    .then(() => {
      return queryInterface.sequelize.query('DROP FUNCTION changelogIssueDiff();')
    })
    .then(() => {
      return queryInterface.sequelize.query('DROP FUNCTION changelogIssueInsert();')
    })
  }
}
