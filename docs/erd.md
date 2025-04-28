# ERD

```mermaid

erDiagram
  User {
    type name PK "Comment"
  }
  newEntity_1 {
    type name PK "Comment"
  }
  User ||--o{ newEntity_1 : ""

```
