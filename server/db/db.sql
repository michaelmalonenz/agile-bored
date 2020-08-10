CREATE TABLE IF NOT EXISTS users {
    "id" GENERATED ALWAYS AS IDENTITY,
    "externalId" VARCHAR(255),
    "username" VARCHAR(255),
    "displayName" VARCHAR(255),
    "avatar" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ
};

CREATE TABLE IF NOT EXISTS issue_statuses {
    "id" GENERATED ALWAYS AS IDENTITY,
    "name" VARCHAR(255),
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ
};

CREATE TABLE IF NOT EXISTS issue_types {
    "id" GENERATED ALWAYS AS IDENTITY,
    "name" VARCHAR(64),
    "colour" VARCHAR(64),
    "subtask" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ,
};

CREATE TABLE IF NOT EXISTS issues {
    "id" GENERATED ALWAYS AS IDENTITY,
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
    CONSTRAINT FK_issues_parent FOREIGN KEY(parentId) REFERENCES issues(id),
    CONSTRAINT FK_issues_users  FOREIGN KEY(assigneeId) REFERENCES users(id),
    CONSTRAINT FK_issues_editor FOREIGN KEY(latestEditorId) REFERENCES users(id),
    CONSTRAINT FK_issues_reporter FOREIGN KEY(reporterId) REFERENCES users(id),
    CONSTRAINT FK_issues_type FOREIGN KEY(typeId) REFERENCES issue_types(id),
    CONSTRAINT FK_issues_status FOREIGN KEY(statusId) REFERENCES issue_statuses(id)
};

CREATE TABLE IF NOT EXISTS changelog {
    "id" GENERATED ALWAYS AS IDENTITY,
    "issueId" INT NOT NULL,
    "authorId" INT NOT NULL,
    "field" VARCHAR(255) NOT NULL,
    "oldValue" TEXT NULL,
    "newValue" TEXT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT FK_changelog_issues FOREIGN KEY(issueId) REFERENCES issues(id),
    CONSTRAINT FK_changelog_users  FOREIGN KEY(authorId) REFERENCES users(id)
};

CREATE TABLE IF NOT EXISTS comments {
    "id" GENERATED ALWAYS AS IDENTITY,
    "authorId" INT NOT NULL,
    "issueId" INT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,
    CONSTRAINT FK_comments_issues FOREIGN KEY(issueId) REFERENCES issues(id),
    CONSTRAINT FK_comments_users  FOREIGN KEY(authorId) REFERENCES users(id)
};

CREATE TABLE IF NOT EXISTS settings {
    "id" GENERATED ALWAYS AS IDENTITY,
    "jiraUrl" TEXT,
    "jiraProjectName" TEXT,
    "jiraRapidBoardId" INT,
    "useJira" BOOLEAN,
    "groupByEpic" BOOLEAN,
    "jiraEpicField" VARCHAR(255),
    "userId" INT,
    CONSTRAINT FK_settings_user FOREIGN KEY(userId) REFERENCES users(id)
};

CREATE TABLE IF NOT EXISTS "version" {
    "id" GENERATED ALWAYS AS IDENTITY,
    "description" TEXT
    "insertedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
};
