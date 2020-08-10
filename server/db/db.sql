CREATE TABLE IF NOT EXISTS users (
    "id" INT GENERATED ALWAYS AS IDENTITY UNIQUE,
    "externalId" VARCHAR(255),
    "username" VARCHAR(255),
    "displayName" VARCHAR(255),
    "avatar" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS issue_statuses (
    "id" INT GENERATED ALWAYS AS IDENTITY UNIQUE,
    "name" VARCHAR(255),
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS issue_types (
    "id" INT GENERATED ALWAYS AS IDENTITY UNIQUE,
    "name" VARCHAR(64),
    "colour" VARCHAR(64),
    "subtask" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS issues (
    "id" INT GENERATED ALWAYS AS IDENTITY UNIQUE,
    "description" TEXT,
    "title" TEXT,
    "rank" INT,
    "statusId" INT,
    "typeId" INT,
    "assigneeId" INT,
    "reporterId" INT,
    "parentId" INT,
    "latestEditorId" INT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,
    CONSTRAINT FK_issues_users  FOREIGN KEY("assigneeId") REFERENCES users(id),
    CONSTRAINT FK_issues_editor FOREIGN KEY("latestEditorId") REFERENCES users(id),
    CONSTRAINT FK_issues_reporter FOREIGN KEY("reporterId") REFERENCES users(id),
    CONSTRAINT FK_issues_type FOREIGN KEY("typeId") REFERENCES issue_types(id),
    CONSTRAINT FK_issues_status FOREIGN KEY("statusId") REFERENCES issue_statuses(id)
);

CREATE TABLE IF NOT EXISTS changelog (
    "id" INT GENERATED ALWAYS AS IDENTITY UNIQUE,
    "issueId" INT NOT NULL,
    "authorId" INT NOT NULL,
    "field" VARCHAR(255) NOT NULL,
    "oldValue" TEXT NULL,
    "newValue" TEXT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT FK_changelog_issues FOREIGN KEY("issueId") REFERENCES issues(id),
    CONSTRAINT FK_changelog_users  FOREIGN KEY("authorId") REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS comments (
    "id" INT GENERATED ALWAYS AS IDENTITY UNIQUE,
    "authorId" INT NOT NULL,
    "issueId" INT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,
    CONSTRAINT FK_comments_issues FOREIGN KEY("issueId") REFERENCES issues(id),
    CONSTRAINT FK_comments_users  FOREIGN KEY("authorId") REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS settings (
    "id" INT GENERATED ALWAYS AS IDENTITY UNIQUE,
    "jiraUrl" TEXT,
    "jiraProjectName" TEXT,
    "jiraRapidBoardId" INT,
    "useJira" BOOLEAN,
    "groupByEpic" BOOLEAN,
    "jiraEpicField" VARCHAR(255),
    "userId" INT,
    CONSTRAINT FK_settings_user FOREIGN KEY("userId") REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS "version" (
    "id" INT GENERATED ALWAYS AS IDENTITY,
    "description" TEXT,
    "insertedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

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
END; $$ LANGUAGE plpgsql;


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
END; $$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS issue_insert_changelog_trigger ON issues;
CREATE TRIGGER issue_insert_changelog_trigger AFTER INSERT
ON issues FOR EACH ROW EXECUTE PROCEDURE changelogIssueInsert();

DROP TRIGGER IF EXISTS issue_update_changelog_trigger ON issues;
CREATE TRIGGER issue_update_changelog_trigger AFTER UPDATE
ON issues FOR EACH ROW EXECUTE PROCEDURE changelogIssueDiff();
