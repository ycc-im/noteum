# API Contract: Client Frontend Framework

**Date**: 2025-10-15
**Version**: v1.0.0
**Format**: OpenAPI 3.0.3

## Overview

本文档定义了前端应用与后端服务之间的 API 接口合约，包括认证、笔记管理、协作功能等核心功能。

## Base Configuration

```yaml
openapi: 3.0.3
info:
  title: Noteum Client API
  description: Frontend application API contract
  version: 1.0.0
  contact:
    name: Development Team
    email: dev@noteum.com
servers:
  - url: http://localhost:8080/api/v1
    description: Development server
  - url: https://api.noteum.com/v1
    description: Production server
security:
  - BearerAuth: []
```

## Authentication Schemes

```yaml
components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
```

## Paths

### Authentication

#### POST /auth/login
```yaml
post:
  tags:
    - Authentication
  summary: User login
  description: Authenticate user and return JWT token
  requestBody:
    required: true
    content:
      application/json:
        schema:
          type: object
          required:
            - email
            - password
          properties:
            email:
              type: string
              format: email
              example: user@example.com
            password:
              type: string
              format: password
              example: password123
            rememberMe:
              type: boolean
              default: false
  responses:
    '200':
      description: Login successful
      content:
        application/json:
          schema:
            type: object
            required:
              - token
              - user
            properties:
              token:
                type: string
                description: JWT access token
              user:
                $ref: '#/components/schemas/User'
              expiresIn:
                type: number
                description: Token expiration time in seconds
    '401':
      $ref: '#/components/responses/Unauthorized'
    '422':
      $ref: '#/components/responses/ValidationError'
```

#### POST /auth/register
```yaml
post:
  tags:
    - Authentication
  summary: User registration
  description: Register new user account
  requestBody:
    required: true
    content:
      application/json:
        schema:
          type: object
          required:
            - email
            - password
            - name
          properties:
            email:
              type: string
              format: email
            password:
              type: string
              format: password
              minLength: 8
            name:
              type: string
              minLength: 2
              maxLength: 50
            acceptTerms:
              type: boolean
  responses:
    '201':
      description: User created successfully
      content:
        application/json:
          schema:
            type: object
            required:
              - user
              - token
            properties:
              user:
                $ref: '#/components/schemas/User'
              token:
                type: string
    '409':
      $ref: '#/components/responses/Conflict'
    '422':
      $ref: '#/components/responses/ValidationError'
```

#### POST /auth/refresh
```yaml
post:
  tags:
    - Authentication
  summary: Refresh JWT token
  description: Refresh an existing JWT token
  requestBody:
    required: true
    content:
      application/json:
        schema:
          type: object
          required:
            - refreshToken
          properties:
            refreshToken:
              type: string
  responses:
    '200':
      description: Token refreshed successfully
      content:
        application/json:
          schema:
            type: object
            required:
              - token
            properties:
              token:
                type: string
              expiresIn:
                type: number
    '401':
      $ref: '#/components/responses/Unauthorized'
```

#### POST /auth/logout
```yaml
post:
  tags:
    - Authentication
  summary: User logout
  description: Invalidate current JWT token
  responses:
    '200':
      description: Logout successful
    '401':
      $ref: '#/components/responses/Unauthorized'
```

### Notebooks

#### GET /notebooks
```yaml
get:
  tags:
    - Notebooks
  summary: Get user notebooks
  description: Retrieve all notebooks accessible to the current user
  parameters:
    - name: page
      in: query
      schema:
        type: integer
        minimum: 1
        default: 1
    - name: limit
      in: query
      schema:
        type: integer
        minimum: 1
        maximum: 100
        default: 20
    - name: search
      in: query
      schema:
        type: string
        description: Search term for notebook titles
    - name: visibility
      in: query
      schema:
        type: string
        enum: [private, shared, public]
        description: Filter by visibility
  responses:
    '200':
      description: Notebooks retrieved successfully
      content:
        application/json:
          schema:
            type: object
            required:
              - notebooks
              - pagination
            properties:
              notebooks:
                type: array
                items:
                  $ref: '#/components/schemas/Notebook'
              pagination:
                $ref: '#/components/schemas/Pagination'
    '401':
      $ref: '#/components/responses/Unauthorized'
```

#### POST /notebooks
```yaml
post:
  tags:
    - Notebooks
  summary: Create new notebook
  description: Create a new notebook for the current user
  requestBody:
    required: true
    content:
      application/json:
        schema:
          type: object
          required:
            - title
          properties:
            title:
              type: string
              minLength: 1
              maxLength: 100
            description:
              type: string
              maxLength: 500
            visibility:
              type: string
              enum: [private, shared, public]
              default: private
            color:
              type: string
              pattern: '^#[0-9A-Fa-f]{6}$'
              default: '#3B82F6'
            icon:
              type: string
              maxLength: 50
  responses:
    '201':
      description: Notebook created successfully
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Notebook'
    '401':
      $ref: '#/components/responses/Unauthorized'
    '422':
      $ref: '#/components/responses/ValidationError'
```

#### GET /notebooks/{notebookId}
```yaml
get:
  tags:
    - Notebooks
  summary: Get notebook by ID
  description: Retrieve a specific notebook by its ID
  parameters:
    - name: notebookId
      in: path
      required: true
      schema:
        type: string
        format: ulid
  responses:
    '200':
      description: Notebook retrieved successfully
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Notebook'
    '401':
      $ref: '#/components/responses/Unauthorized'
    '404':
      $ref: '#/components/responses/NotFound'
```

#### PUT /notebooks/{notebookId}
```yaml
put:
  tags:
    - Notebooks
  summary: Update notebook
  description: Update notebook information
  parameters:
    - name: notebookId
      in: path
      required: true
      schema:
        type: string
        format: ulid
  requestBody:
    required: true
    content:
      application/json:
        schema:
          type: object
          properties:
            title:
              type: string
              minLength: 1
              maxLength: 100
            description:
              type: string
              maxLength: 500
            visibility:
              type: string
              enum: [private, shared, public]
            color:
              type: string
              pattern: '^#[0-9A-Fa-f]{6}$'
            icon:
              type: string
              maxLength: 50
  responses:
    '200':
      description: Notebook updated successfully
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Notebook'
    '401':
      $ref: '#/components/responses/Unauthorized'
    '404':
      $ref: '#/components/responses/NotFound'
    '422':
      $ref: '#/components/responses/ValidationError'
```

#### DELETE /notebooks/{notebookId}
```yaml
delete:
  tags:
    - Notebooks
  summary: Delete notebook
  description: Delete a notebook and all its notes
  parameters:
    - name: notebookId
      in: path
      required: true
      schema:
        type: string
        format: ulid
  responses:
    '204':
      description: Notebook deleted successfully
    '401':
      $ref: '#/components/responses/Unauthorized'
    '404':
      $ref: '#/components/responses/NotFound'
```

### Notes

#### GET /notes
```yaml
get:
  tags:
    - Notes
  summary: Get notes
  description: Retrieve notes with filtering and pagination
  parameters:
    - name: notebookId
      in: query
      schema:
        type: string
        format: ulid
        description: Filter by notebook ID
    - name: page
      in: query
      schema:
        type: integer
        minimum: 1
        default: 1
    - name: limit
      in: query
      schema:
        type: integer
        minimum: 1
        maximum: 100
        default: 20
    - name: search
      in: query
      schema:
        type: string
        description: Search term for note titles and content
    - name: tags
      in: query
      schema:
        type: array
        items:
          type: string
        description: Filter by tags
    - name: sortBy
      in: query
      schema:
        type: string
        enum: [createdAt_asc, createdAt_desc, updatedAt_asc, updatedAt_desc, title_asc, title_desc]
        default: updatedAt_desc
    - name: isArchived
      in: query
      schema:
        type: boolean
        description: Filter by archived status
  responses:
    '200':
      description: Notes retrieved successfully
      content:
        application/json:
          schema:
            type: object
            required:
              - notes
              - pagination
            properties:
              notes:
                type: array
                items:
                  $ref: '#/components/schemas/Note'
              pagination:
                $ref: '#/components/schemas/Pagination'
    '401':
      $ref: '#/components/responses/Unauthorized'
```

#### POST /notes
```yaml
post:
  tags:
    - Notes
  summary: Create new note
  description: Create a new note in a notebook
  requestBody:
    required: true
    content:
      application/json:
        schema:
          type: object
          required:
            - title
            - notebookId
          properties:
            title:
              type: string
              minLength: 1
              maxLength: 255
            notebookId:
              type: string
              format: ulid
            content:
              type: string
              default: ''
            contentType:
              type: string
              enum: [markdown, rich_text, code, plain_text]
              default: rich_text
            tags:
              type: array
              items:
                type: string
                maxLength: 50
              maxItems: 10
            category:
              type: string
              maxLength: 50
            isPublic:
              type: boolean
              default: false
            isCollaborative:
              type: boolean
              default: false
  responses:
    '201':
      description: Note created successfully
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Note'
    '401':
      $ref: '#/components/responses/Unauthorized'
    '404':
      description: Notebook not found
    '422':
      $ref: '#/components/responses/ValidationError'
```

#### GET /notes/{noteId}
```yaml
get:
  tags:
    - Notes
  summary: Get note by ID
  description: Retrieve a specific note by its ID
  parameters:
    - name: noteId
      in: path
      required: true
      schema:
        type: string
        format: ulid
    - name: includeContent
      in: query
      schema:
        type: boolean
        default: true
        description: Include note content in response
  responses:
    '200':
      description: Note retrieved successfully
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Note'
    '401':
      $ref: '#/components/responses/Unauthorized'
    '404':
      $ref: '#/components/responses/NotFound'
```

#### PUT /notes/{noteId}
```yaml
put:
  tags:
    - Notes
  summary: Update note
  description: Update note information and content
  parameters:
    - name: noteId
      in: path
      required: true
      schema:
        type: string
        format: ulid
  requestBody:
    required: true
    content:
      application/json:
        schema:
          type: object
          properties:
            title:
              type: string
              minLength: 1
              maxLength: 255
            content:
              type: string
            tags:
              type: array
              items:
                type: string
                maxLength: 50
              maxItems: 10
            category:
              type: string
              maxLength: 50
            isPublic:
              type: boolean
            isArchived:
              type: boolean
            version:
              type: integer
              minimum: 1
              description: Note version for conflict detection
  responses:
    '200':
      description: Note updated successfully
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Note'
    '401':
      $ref: '#/components/responses/Unauthorized'
    '404':
      $ref: '#/components/responses/NotFound'
    '409':
      description: Version conflict
      content:
        application/json:
          schema:
            type: object
            properties:
              error:
                type: string
                example: Version conflict
              currentVersion:
                type: integer
    '422':
      $ref: '#/components/responses/ValidationError'
```

#### DELETE /notes/{noteId}
```yaml
delete:
  tags:
    - Notes
  summary: Delete note
  description: Delete a note permanently
  parameters:
    - name: noteId
      in: path
      required: true
      schema:
        type: string
        format: ulid
  responses:
    '204':
      description: Note deleted successfully
    '401':
      $ref: '#/components/responses/Unauthorized'
    '404':
      $ref: '#/components/responses/NotFound'
```

### Collaboration

#### POST /collaboration/documents/{noteId}/join
```yaml
post:
  tags:
    - Collaboration
  summary: Join collaborative session
  description: Join a collaborative editing session for a note
  parameters:
    - name: noteId
      in: path
      required: true
      schema:
        type: string
        format: ulid
  requestBody:
    required: true
    content:
      application/json:
        schema:
          type: object
          required:
            - token
          properties:
            token:
              type: string
              description: Collaboration session token
  responses:
    '200':
      description: Joined session successfully
      content:
        application/json:
          schema:
            type: object
            required:
              - sessionId
              - websocketUrl
              - yjsDocumentId
            properties:
              sessionId:
                type: string
                description: Unique session identifier
              websocketUrl:
                type: string
                description: WebSocket server URL
              yjsDocumentId:
                type: string
                description: YJS document identifier
              permissions:
                type: object
                properties:
                  canEdit:
                    type: boolean
                  canComment:
                    type: boolean
                  canShare:
                    type: boolean
    '401':
      $ref: '#/components/responses/Unauthorized'
    '403':
      $ref: '#/components/responses/Forbidden'
    '404':
      $ref: '#/components/responses/NotFound'
```

#### POST /collaboration/documents/{noteId}/sync
```yaml
post:
  tags:
    - Collaboration
  summary: Sync document state
  description: Sync YJS document state with server
  parameters:
    - name: noteId
      in: path
      required: true
      schema:
        type: string
        format: ulid
  requestBody:
    required: true
    content:
      application/json:
        schema:
          type: object
          required:
            - state
            - version
          properties:
            state:
              type: string
              format: byte
              description: Base64 encoded YJS state
            version:
              type: integer
              description: Document version
            operations:
              type: array
              items:
                type: object
                properties:
                  type:
                    type: string
                    enum: [insert, delete, format]
                  position:
                    type: integer
                  content:
                    type: string
                  attributes:
                    type: object
  responses:
    '200':
      description: Sync successful
      content:
        application/json:
          schema:
            type: object
            properties:
              mergedState:
                type: string
                format: byte
                description: Merged document state
              conflicts:
                type: array
                items:
                  $ref: '#/components/schemas/Conflict'
    '401':
      $ref: '#/components/responses/Unauthorized'
    '409':
      description: Sync conflict
      content:
        application/json:
          schema:
            type: object
            properties:
              conflicts:
                type: array
                items:
                  $ref: '#/components/schemas/Conflict'
```

#### GET /collaboration/documents/{noteId}/presence
```yaml
get:
  tags:
    - Collaboration
  summary: Get user presence
  description: Get current user presence for a document
  parameters:
    - name: noteId
      in: path
      required: true
      schema:
        type: string
        format: ulid
  responses:
    '200':
      description: Presence data retrieved successfully
      content:
        application/json:
          schema:
            type: object
            required:
              - users
              - isConnected
            properties:
              users:
                type: array
                items:
                  $ref: '#/components/schemas/UserPresence'
              isConnected:
                type: boolean
              lastSyncAt:
                type: string
                format: date-time
    '401':
      $ref: '#/components/responses/Unauthorized'
    '404':
      $ref: '#/components/responses/NotFound'
```

### Search

#### GET /search
```yaml
get:
  tags:
    - Search
  summary: Search notes and notebooks
  description: Search across notes and notebooks
  parameters:
    - name: q
      in: query
      required: true
      schema:
        type: string
        minLength: 1
        maxLength: 100
      description: Search query
    - name: type
      in: query
      schema:
        type: string
        enum: [notes, notebooks, all]
        default: all
        description: Search type filter
    - name: notebookId
      in: query
      schema:
        type: string
        format: ulid
        description: Limit search to specific notebook
    - name: tags
      in: query
      schema:
        type: array
        items:
          type: string
        description: Filter by tags
    - name: dateFrom
      in: query
      schema:
        type: string
        format: date
        description: Filter by creation date (from)
    - name: dateTo
      in: query
      schema:
        type: string
        format: date
        description: Filter by creation date (to)
    - name: page
      in: query
      schema:
        type: integer
        minimum: 1
        default: 1
    - name: limit
      in: query
      schema:
        type: integer
        minimum: 1
        maximum: 50
        default: 20
  responses:
    '200':
      description: Search results
      content:
        application/json:
          schema:
            type: object
            required:
              - results
              - pagination
            properties:
              results:
                type: object
                properties:
                  notes:
                    type: array
                    items:
                      $ref: '#/components/schemas/Note'
                  notebooks:
                    type: array
                    items:
                      $ref: '#/components/schemas/Notebook'
              pagination:
                $ref: '#/components/schemas/Pagination'
              facets:
                type: object
                properties:
                  tags:
                    type: array
                    items:
                      type: object
                      properties:
                        tag:
                          type: string
                        count:
                          type: integer
                  notebooks:
                    type: array
                    items:
                      type: object
                      properties:
                        notebook:
                          $ref: '#/components/schemas/Notebook'
                        count:
                          type: integer
    '422':
      $ref: '#/components/responses/ValidationError'
```

## Components

### Schemas

#### User
```yaml
components:
  schemas:
    User:
      type: object
      required:
        - id
        - email
        - name
        - createdAt
      properties:
        id:
          type: string
          format: ulid
          example: 01H8X6PZ5Q8Y0Z0X0Z0X0Z0X0Z0
        email:
          type: string
          format: email
          example: user@example.com
        name:
          type: string
          minLength: 2
          maxLength: 50
          example: John Doe
        avatar:
          type: string
          format: uri
          example: https://example.com/avatar.jpg
        preferences:
          $ref: '#/components/schemas/UserPreferences'
        profile:
          $ref: '#/components/schemas/UserProfile'
        createdAt:
          type: string
          format: date-time
        lastLoginAt:
          type: string
          format: date-time
```

#### UserPreferences
```yaml
    UserPreferences:
      type: object
      properties:
        theme:
          type: string
          enum: [light, dark, system]
          default: system
        language:
          type: string
          pattern: '^[a-z]{2}-[A-Z]{2}$'
          default: en-US
        fontSize:
          type: string
          enum: [small, medium, large]
          default: medium
        autoSave:
          type: boolean
          default: true
        notifications:
          type: object
          properties:
            desktop:
              type: boolean
            email:
              type: boolean
            collaboration:
              type: boolean
            system:
              type: boolean
        editor:
          type: object
          properties:
            mode:
              type: string
              enum: [rich_text, markdown, code, plain_text]
              default: rich_text
            wordWrap:
              type: boolean
              default: true
            showLineNumbers:
              type: boolean
              default: false
            autoComplete:
              type: boolean
              default: true
            spellCheck:
              type: boolean
              default: true
        collaboration:
          type: object
          properties:
            showUserCursors:
              type: boolean
              default: true
            showUserSelections:
              type: boolean
              default: true
            enableNotifications:
              type: boolean
              default: true
            conflictResolution:
              type: string
              enum: [manual, auto_merge, latest_wins]
              default: manual
            syncInterval:
              type: integer
              minimum: 1
              maximum: 300
              default: 5
            offlineMode:
              type: boolean
              default: true
```

#### UserProfile
```yaml
    UserProfile:
      type: object
      properties:
        bio:
          type: string
          maxLength: 500
        location:
          type: string
          maxLength: 100
        website:
          type: string
          format: uri
        socialLinks:
          type: array
          items:
            type: object
            properties:
              platform:
                type: string
              url:
                type: string
                format: uri
        expertise:
          type: array
          items:
            type: string
            maxLength: 50
```

#### Notebook
```yaml
    Notebook:
      type: object
      required:
        - id
        - title
        - ownerId
        - visibility
        - createdAt
        - updatedAt
      properties:
        id:
          type: string
          format: ulid
        title:
          type: string
          minLength: 1
          maxLength: 100
        description:
          type: string
          maxLength: 500
        ownerId:
          type: string
          format: ulid
        visibility:
          type: string
          enum: [private, shared, public]
        color:
          type: string
          pattern: '^#[0-9A-Fa-f]{6}$'
          default: '#3B82F6'
        icon:
          type: string
          maxLength: 50
        stats:
          type: object
          properties:
            noteCount:
              type: integer
              minimum: 0
            collaboratorCount:
              type: integer
              minimum: 0
            lastActivityAt:
              type: string
              format: date-time
            totalWords:
              type: integer
              minimum: 0
        defaultPermissions:
          $ref: '#/components/schemas/NotebookPermissions'
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time
```

#### NotebookPermissions
```yaml
    NotebookPermissions:
      type: object
      properties:
        canView:
          type: boolean
        canEdit:
          type: boolean
        canComment:
          type: boolean
        canShare:
          type: boolean
        canManage:
          type: boolean
```

#### Note
```yaml
    Note:
      type: object
      required:
        - id
        - title
        - notebookId
        - permissions
        - createdAt
        - updatedAt
      properties:
        id:
          type: string
          format: ulid
        title:
          type: string
          minLength: 1
          maxLength: 255
        notebookId:
          type: string
          format: ulid
        structuredData:
          type: object
          properties:
            metadata:
              $ref: '#/components/schemas/NoteMetadata'
            tags:
              type: array
              items:
                type: string
                maxLength: 50
              maxItems: 10
            category:
              type: string
              maxLength: 50
            isPublic:
              type: boolean
            isArchived:
              type: boolean
            version:
              type: integer
              minimum: 1
            wordCount:
              type: integer
              minimum: 0
            readingTime:
              type: integer
              minimum: 0
        collaborationData:
          type: object
          properties:
            yjsState:
              type: string
              format: byte
              description: Base64 encoded YJS state
            lastSyncAt:
              type: string
              format: date-time
            conflictResolved:
              type: boolean
            isCollaborative:
              type: boolean
        permissions:
          $ref: '#/components/schemas/NotePermissions'
        collaboration:
          $ref: '#/components/schemas/CollaborationInfo'
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time
```

#### NoteMetadata
```yaml
    NoteMetadata:
      type: object
      properties:
        description:
          type: string
          maxLength: 500
        authorId:
          type: string
          format: ulid
        contributors:
          type: array
          items:
            type: string
            format: ulid
        language:
          type: string
          pattern: '^[a-z]{2}-[A-Z]{2}$'
        contentType:
          type: string
          enum: [markdown, rich_text, code, plain_text]
        priority:
          type: string
          enum: [low, medium, high, urgent]
```

#### NotePermissions
```yaml
    NotePermissions:
      type: object
      properties:
        canView:
          type: boolean
        canEdit:
          type: boolean
        canComment:
          type: boolean
        canShare:
          type: boolean
        canDelete:
          type: boolean
        sharedWith:
          type: array
          items:
            type: object
            properties:
              userId:
                type: string
                format: ulid
              permission:
                type: string
                enum: [read, write, admin]
```

#### CollaborationInfo
```yaml
    CollaborationInfo:
      type: object
      properties:
        isActive:
          type: boolean
        collaboratorCount:
          type: integer
          minimum: 0
        lastSyncAt:
          type: string
          format: date-time
        conflicts:
          type: array
          items:
            $ref: '#/components/schemas/Conflict'
```

#### Conflict
```yaml
    Conflict:
      type: object
      required:
        - id
        - type
        - description
        - resolved
      properties:
        id:
          type: string
          format: ulid
        documentId:
          type: string
          format: ulid
        type:
          type: string
          enum: [concurrent_edit, sync_failure, version_mismatch, offline_conflict]
        description:
          type: string
          maxLength: 500
        ourVersion:
          type: integer
          minimum: 1
        theirVersion:
          type: integer
          minimum: 1
        resolved:
          type: boolean
        resolvedAt:
          type: string
          format: date-time
        resolvedBy:
          type: string
          format: ulid
```

#### UserPresence
```yaml
    UserPresence:
      type: object
      required:
        - userId
        - userName
        - userColor
        - status
        - lastActivity
        - isTyping
      properties:
        userId:
          type: string
          format: ulid
        userName:
          type: string
          minLength: 1
          maxLength: 50
        userAvatar:
          type: string
          format: uri
        userColor:
          type: string
          pattern: '^#[0-9A-Fa-f]{6}$'
        status:
          type: string
          enum: [online, away, offline, busy]
        cursor:
          type: object
          properties:
            noteId:
              type: string
              format: ulid
            anchor:
              type: integer
              minimum: 0
            head:
              type: integer
              minimum: 0
            line:
              type: integer
              minimum: 0
            column:
              type: integer
              minimum: 0
        selection:
          type: object
          properties:
            noteId:
              type: string
              format: ulid
            start:
              type: integer
              minimum: 0
            end:
              type: integer
              minimum: 0
            text:
              type: string
              maxLength: 1000
            context:
              type: string
              maxLength: 200
        lastActivity:
          type: string
          format: date-time
        isTyping:
          type: boolean
        currentNoteId:
          type: string
          format: ulid
```

#### Pagination
```yaml
    Pagination:
      type: object
      required:
        - page
        - limit
        - total
        - totalPages
        - hasNext
        - hasPrev
      properties:
        page:
          type: integer
          minimum: 1
        limit:
          type: integer
          minimum: 1
          maximum: 100
        total:
          type: integer
          minimum: 0
        totalPages:
          type: integer
          minimum: 0
        hasNext:
          type: boolean
        hasPrev:
          type: boolean
```

### Responses

#### Error Responses
```yaml
    Unauthorized:
      description: Unauthorized access
      content:
        application/json:
          schema:
            type: object
            required:
              - error
            properties:
              error:
                type: string
                example: Unauthorized
              message:
                type: string
                example: Invalid or expired token
              code:
                type: string
                example: UNAUTHORIZED

    Forbidden:
      description: Access forbidden
      content:
        application/json:
          schema:
            type: object
            required:
              - error
            properties:
              error:
                type: string
                example: Forbidden
              message:
                type: string
                example: You don't have permission to access this resource
              code:
                type: string
                example: FORBIDDEN

    NotFound:
      description: Resource not found
      content:
        application/json:
          schema:
            type: object
            required:
              - error
            properties:
              error:
                type: string
                example: Not Found
              message:
                type: string
                example: The requested resource was not found
              code:
                type: string
                example: NOT_FOUND

    Conflict:
      description: Resource conflict
      content:
        application/json:
          schema:
            type: object
            required:
              - error
            properties:
              error:
                type: string
                example: Conflict
              message:
                type: string
                example: Resource already exists or version conflict
              code:
                type: string
                example: CONFLICT

    ValidationError:
      description: Validation error
      content:
        application/json:
          schema:
            type: object
            required:
              - error
              - details
            properties:
              error:
                type: string
                example: Validation Error
              message:
                type: string
                example: Request validation failed
              code:
                type: string
                example: VALIDATION_ERROR
              details:
                type: array
                items:
                  type: object
                  properties:
                    field:
                      type: string
                    message:
                      type: string
                    code:
                      type: string

    InternalServerError:
      description: Internal server error
      content:
        application/json:
          schema:
            type: object
            required:
              - error
            properties:
              error:
                type: string
                example: Internal Server Error
              message:
                type: string
                example: An unexpected error occurred
              code:
                type: string
                example: INTERNAL_ERROR
              requestId:
                type: string
                example: req_1234567890
```

## Usage Examples

### Authentication Flow
```yaml
# Login request
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "rememberMe": true
}

# Response
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "01H8X6PZ5Q8Y0Z0X0Z0X0Z0X0Z0",
    "email": "user@example.com",
    "name": "John Doe",
    "preferences": {...},
    "profile": {...},
    "createdAt": "2025-10-15T10:00:00Z",
    "lastLoginAt": "2025-10-15T10:00:00Z"
  },
  "expiresIn": 3600
}
```

### Create Note Flow
```yaml
# Create note request
POST /notes
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "My New Note",
  "notebookId": "01H8X6PZ5Q8Y0Z0X0Z0X0Z0X0Z0",
  "content": "# Hello World\n\nThis is my note content.",
  "contentType": "markdown",
  "tags": ["personal", "important"],
  "category": "work",
  "isPublic": false,
  "isCollaborative": true
}

# Response
{
  "id": "01H8X6PZ5Q8Y0Z0X0Z0X0Z0X0Z1",
  "title": "My New Note",
  "notebookId": "01H8X6PZ5Q8Y0Z0X0Z0X0Z0X0Z0",
  "structuredData": {
    "metadata": {...},
    "tags": ["personal", "important"],
    "category": "work",
    "isPublic": false,
    "isArchived": false,
    "version": 1,
    "wordCount": 6,
    "readingTime": 1
  },
  "collaborationData": {
    "yjsState": null,
    "lastSyncAt": null,
    "conflictResolved": true,
    "isCollaborative": true
  },
  "permissions": {...},
  "collaboration": {...},
  "createdAt": "2025-10-15T10:05:00Z",
  "updatedAt": "2025-10-15T10:05:00Z"
}
```

### Collaboration Flow
```yaml
# Join collaborative session
POST /collaboration/documents/01H8X6PZ5Q8Y0Z0X0Z0X0Z0X0Z1/join
Authorization: Bearer <token>
Content-Type: application/json

{
  "token": "collab_token_12345"
}

# Response
{
  "sessionId": "session_12345",
  "websocketUrl": "wss://api.noteum.com/ws",
  "yjsDocumentId": "doc_01H8X6PZ5Q8Y0Z0X0Z0X0Z0X0Z1",
  "permissions": {
    "canEdit": true,
    "canComment": true,
    "canShare": false
  }
}
```

## Error Handling

### Error Response Format
All error responses follow a consistent format:

```json
{
  "error": "Error Type",
  "message": "Human-readable error message",
  "code": "ERROR_CODE",
  "details": [
    {
      "field": "field_name",
      "message": "Specific error message",
      "code": "SPECIFIC_ERROR_CODE"
    }
  ],
  "requestId": "req_1234567890"
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `204` - No Content
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `422` - Validation Error
- `429` - Too Many Requests
- `500` - Internal Server Error

## Rate Limiting

API endpoints are subject to rate limiting:

- Authentication endpoints: 5 requests per minute
- Note operations: 100 requests per minute
- Search: 30 requests per minute
- Collaboration: 1000 requests per minute

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1634567890
```

## Versioning

API versioning is handled through URL path `/api/v1/`. Breaking changes will result in a new version number. Backward compatibility is maintained for at least one previous version.

## Conclusion

This API contract provides a comprehensive interface for the frontend application to interact with backend services. It includes all necessary endpoints for authentication, note management, collaboration, and search functionality with proper error handling, validation, and rate limiting.