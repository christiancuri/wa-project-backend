# Laboratory API

Content
 - [Get laboratories](#Get Laboratories)
 - [Create laboratory](#Create Laboratory)
 - [Update laboratory](#Update Laboratory)
 - [Deactivate laboratories](#Deactivate Laboratories)
 - [Common Types](#Common Types)
 - [Routes](routes.ts)

## Get started

### Get Laboratories

```ts
GET /api/laboratory
```
```ts
Response
[
  {
    _id: ObjectId,
    id: number,
    name: string,
    address: string,
    status: Status,
    exams: Exam[]
  }
]
```

### Create Laboratory
```ts
POST /api/laboratory
Payload
{
  name: string,
  address: string,
  exams: ObjectId[],
}
```
```
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

### Update Laboratory
```ts
PUT /api/laboratory/:laboratoryId
Payload
{
  name: string,
  address: string,
  exams: ObjectId[],
}
```
```
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

### Deactivate Laboratories
```ts
DELETE /api/laboratory?ids=ObjectId[]
```
```
Response
204 No content
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
export interface Exam {
  _id: ObjectId;
  id: number;
  name: string;
  status: Status;
  type: ExamType;
  createdAt: Date;
  updatedAt: Date;
}
```