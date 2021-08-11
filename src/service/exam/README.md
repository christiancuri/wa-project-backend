# Exam API

## Content
 - [Get exams](#Get-Exams)
 - [Create exam](#Create-Exam)
 - [Update exam](#Update-Exam)
 - [Deactivate exams](#Deactivate-Exams)
 - [Assign Exam to Laboratory](#Assign-Exam-to-Laboratory)
 - [Unassign Exam from Laboratory](#Unassign-Exam-from-Laboratory)
 - [Common Types](#Common-Types)
 - [Routes](routes.ts)

Other Contents
- [Laboratory API Doc](../laboratory/README.md)
- [Back to home](../../../README.md)

## Get started

### Get Exams

```ts
GET /api/exam
```

```ts
Response
[
  {
    _id: ObjectId,
    id: number,
    name: string,
    status: Status,
    type: ExamType,
    createdAt: Date,
    updatedAt: Date,
  }
]
```

### Create Exam
```ts
POST /api/exam
Payload
{
  name: string,
  type: ExamType,
}
```
```ts
Response
{
  _id: ObjectId,
  id: number,
  name: string,
  status: Status,
  type: ExamType,
  createdAt: Date,
  updatedAt: Date,
}
```

### Update Exam
```ts
PUT /api/exam/:examId
Payload
{
  name: string,
  type: ExamType,
  status?: Status,
}
```
```ts
Response
{
  _id: ObjectId,
  id: number,
  name: string,
  status: Status,
  type: ExamType,
  createdAt: Date,
  updatedAt: Date,
}
```

### Deactivate Exams
```ts
DELETE /api/exam?ids=ObjectId[]
```
```
Response
204 No content
```

### Assign Exam to Laboratory
```ts
PUT /api/exam/assign/:examId
Payload
{
  laboratory: ObjectId
}
```
```ts
Response
{
  _id: ObjectId,
  id: number,
  name: string,
  address: string,
  status: Status,
  exams: Exam[]
}
```

### Unassign Exam from Laboratory
```ts
PUT /api/exam/unassign/:examId
Payload
{
  laboratory: ObjectId
}
```
```ts
Response
{
  _id: ObjectId,
  id: number,
  name: string,
  address: string,
  status: Status,
  exams: Exam[]
}
```

<br>

### Common Types
```ts
export enum Status {
  ACTIVE = "active",
  INACTIVE = "inactive",
}
```
```ts
export enum ExamType {
  IMAGE = "image",
  CLINICAL_ANALYSIS = "clinical_analysis",
}
```

<hr>

[Laboratory API Doc](../laboratory/README.md)

[Back to home](../../../README.md)